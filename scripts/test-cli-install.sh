#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test directory
TEST_DIR=$(mktemp -d)
TEST_POLICIES_DIR="${TEST_DIR}/policies"

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    cd "$ORIGINAL_DIR"
    npm unlink policy-validation-action || true
    rm -rf "$TEST_DIR"
}

# Error handler
handle_error() {
    echo -e "${RED}Error on line $1${NC}"
    cleanup
    exit 1
}

trap 'handle_error $LINENO' ERR
trap cleanup EXIT

# Store original directory
ORIGINAL_DIR=$(pwd)

echo "Setting up test environment..."
mkdir -p "${TEST_POLICIES_DIR}"

# Build and link package
npm install
npm run build

# Make the CLI executable before linking
chmod +x ./lib/cli.js
chmod +x ./dist/index.js

npm link

# Verify CLI exists
if [ ! -f "./lib/cli.js" ]; then
  echo -e "${RED}Error: CLI file not found at ./lib/cli.js${NC}"
  exit 1
fi

echo "CLI file location and permissions:"
ls -l ./lib/cli.js

# Find the correct CLI path - try multiple possible locations
CLI_PATHS=(
  "./lib/cli.js"
  "./dist/index.js"
  "$(npm bin)/policy-validator"
  "$(npm prefix -g)/bin/policy-validator"
)

CLI_COMMAND=""
for path in "${CLI_PATHS[@]}"; do
  if [ -f "$path" ]; then
    chmod +x "$path"
    CLI_COMMAND="$path"
    echo "Found CLI at: $path"
    break
  fi
done

if [ -z "$CLI_COMMAND" ]; then
  echo -e "${RED}Error: Could not find CLI executable${NC}"
  exit 1
fi

echo "Using CLI command: $CLI_COMMAND"

# Create test policies
cat > "${TEST_POLICIES_DIR}/valid.tf" << 'EOL'
resource "oci_identity_policy" "test_policy" {
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group Developers to use instances in compartment dev",
    "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
    "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
    "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy",
    "Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups = 'SecurityAdmins'"
  ]
}
EOL

cat > "${TEST_POLICIES_DIR}/variables.tf" << 'EOL'
resource "oci_identity_policy" "test_policy_vars" {
  statements = [
    "Allow group ${var.admin_group} to manage all-resources in tenancy",
    "Define tenancy ${var.tenant_name} as ${var.tenant_ocid}",
    "Endorse group ${var.network_admins} to manage virtual-network-family in tenancy foo",
    "Admit group ${var.dev_group} of tenancy accountFoo to use instances in compartment ${var.env}",
    "Allow any-user to use instances in compartment ${var.public_compartment} where request.time BETWEEN ${var.start_time} AND ${var.end_time}"
  ]
}
EOL

echo "Running CLI tests..."

# Test help command
echo "Testing help command..."
$CLI_COMMAND --help

# Test version command
echo "Testing version command..."
$CLI_COMMAND --version

# Test single file validation
echo "Testing single file validation..."
$CLI_COMMAND --path "${TEST_POLICIES_DIR}/valid.tf"

# Test directory scanning
echo "Testing directory scanning..."
$CLI_COMMAND --path "${TEST_POLICIES_DIR}"

# Test verbose mode
echo "Testing verbose mode..."
$CLI_COMMAND --path "${TEST_POLICIES_DIR}/valid.tf" --verbose

# Test custom pattern
echo "Testing custom pattern..."
$CLI_COMMAND --path "${TEST_POLICIES_DIR}/valid.tf" --pattern "Allow.*"

cat > "${TEST_POLICIES_DIR}/invalid.tf" << 'EOL'
resource "oci_identity_policy" "invalid_policy" {
  statements = [
    "AllowBadSyntax manage",
    "Allow groupDevelopers to use instances in compartment dev",
    "Admitgroup ServiceAdmins of tenancy 123 to manage instances in tenancy",
    "DefinetenancyAcceptor as ocid1",
    "Endorsegroup NetworkAdmins to manage something in tenancy"
  ]
}
EOL

# Test invalid file (should fail)
echo "Testing invalid file handling..."
if OUTPUT=$(policy-validator --path "${TEST_POLICIES_DIR}/invalid.tf" 2>&1); then
    echo -e "${RED}Error: Invalid policy validation should have failed${NC}"
    exit 1
else
    if echo "$OUTPUT" | grep -q "Failed to parse policy statement:"; then
        echo -e "${GREEN}Successfully detected invalid policy${NC}"
    else
        echo -e "${RED}Error: Expected policy parsing error message${NC}"
        exit 1
    fi
fi

# Add more invalid test cases
cat > "${TEST_POLICIES_DIR}/invalid-scenarios.tf" << 'EOL'
resource "oci_identity_policy" "invalid_scenarios" {
  statements = [
    "Allow group to manage all-resources in",
    "Allow group Admins manage all-resources tenancy",
    "Allow to manage all-resources in tenancy",
    "Define as ocid1.tenancy.oc1",
    "Endorse to manage virtual-network-family",
    "Admit of tenancy to manage instances",
    "Allow group where request.user.name",
    "Allow group Admins to manage all-resources where",
    "Allow group Admins to manage all-resources in tenancy where request.user.groups ="
  ]
}
EOL

# Test each invalid scenario
echo "Testing invalid policy scenarios..."
if $CLI_COMMAND --path "${TEST_POLICIES_DIR}/invalid-scenarios.tf" > /dev/null 2>&1; then
    echo -e "${RED}Error: Invalid policy scenarios should have failed${NC}"
    exit 1
else
    echo -e "${GREEN}Successfully detected invalid policy scenarios${NC}"
fi

echo -e "${GREEN}All tests completed successfully!${NC}"

# Store full path to CLI before changing directories
CLI_COMMAND=$(realpath "$CLI_COMMAND")
echo "Full CLI path: $CLI_COMMAND"

# Create temp directory for test
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

echo "Testing CLI installation in $TEST_DIR"

# Initialize test package.json
npm init -y

# Install the package locally
npm install file:$(dirname "$0")/..

# Create test Terraform file
cat > "${TEST_POLICIES_DIR}/test.tf" << 'EOL'
resource "oci_identity_policy" "test_policy" {
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group Developers to use instances in compartment dev"
  ]
}
EOL

# Run validation on test file
echo "Testing policy validation..."
# Use the globally linked command instead of trying to find it in node_modules
$CLI_COMMAND --path "${TEST_POLICIES_DIR}/test.tf"

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ CLI test passed"
    rm -rf "$TEST_DIR"
    exit 0
else
    echo "❌ CLI test failed"
    rm -rf "$TEST_DIR"
    exit 1
fi