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
npm link
# Make CLI executable - check multiple possible locations
for cli_path in \
    "./lib/cli.js" \
    "./dist/index.js" \
    "$(npm bin)/policy-validator" \
    "$(npm prefix)/lib/cli.js"
do
    if [ -f "$cli_path" ]; then
        chmod +x "$cli_path"
    fi
done

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
policy-validator --help

# Test version command
echo "Testing version command..."
policy-validator --version

# Test single file validation
echo "Testing single file validation..."
policy-validator --path "${TEST_POLICIES_DIR}/valid.tf"

# Test directory scanning
echo "Testing directory scanning..."
policy-validator --path "${TEST_POLICIES_DIR}"

# Test verbose mode
echo "Testing verbose mode..."
policy-validator --path "${TEST_POLICIES_DIR}/valid.tf" --verbose

# Test custom pattern
echo "Testing custom pattern..."
policy-validator --path "${TEST_POLICIES_DIR}/valid.tf" --pattern "Allow.*"

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
if policy-validator --path "${TEST_POLICIES_DIR}/invalid.tf" 2>/dev/null; then
    echo -e "${RED}Error: Invalid policy validation should have failed${NC}"
    exit 1
fi

echo -e "${GREEN}All tests completed successfully!${NC}"