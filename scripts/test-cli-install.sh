#!/usr/bin/env bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Store original directory
ORIGINAL_DIR=$(pwd)
TEST_DIR=$(mktemp -d)

cleanup() {
    echo "Cleaning up..."
    cd "$ORIGINAL_DIR"
    rm -rf "$TEST_DIR"
}

trap cleanup EXIT

echo "Checking Node.js environment..."
node -v
npm -v

echo "Creating test directory..."
mkdir -p "$TEST_DIR/policies"
cd "$TEST_DIR"

# Install the latest beta version of the CLI from npmjs
echo "Installing latest beta version of CLI from npmjs..."
npm install -g @gtrevorrow/policy-validation-action@beta || {
    echo -e "${RED}Failed to install CLI from npmjs${NC}"
    exit 1
}

# Basic test file
cat > policies/test.tf << 'EOL'
resource "oci_identity_policy" "test" {
    statements = [
        "Allow group Administrators to manage all-resources in tenancy"
    ]
}
EOL

# Test CLI - Fixed command to use 'validate' subcommand
echo "Testing CLI..."
policy-validation-action validate ./policies/test.tf || {
    echo -e "${RED}CLI validation failed${NC}"
    exit 1
}

echo -e "${GREEN}Basic CLI test passed!${NC}"

# Set up additional test policies
cat > policies/valid.tf << EOF
resource "oci_identity_policy" "test_policy" {
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group Developers to use instances in compartment dev",
    "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
    "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
    "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy"
  ]
}
EOF

cat > policies/invalid.tf << EOF
resource "oci_identity_policy" "invalid_policy" {
  statements = [
    "Allow BadSyntax manage",
    "Allow groupDevelopers to use instances in compartment dev",
    "Admit group ServiceAdmins of 123 to manage instances in tenancy"
  ]
}
EOF

cat > policies/with-vars.tf << EOF
resource "oci_identity_policy" "test_policy_vars" {
  statements = [
    "Allow group \${var.admin_group} to manage all-resources in tenancy",
    "Define tenancy \${var.tenant_name} as \${var.tenant_ocid}",
    "Allow any-user to use instances in compartment \${var.public_compartment} where request.time BETWEEN \${var.start_time} AND \${var.end_time}"
  ]
}
EOF

# Helper function to extract JSON from output
extract_json() {
    local output="$1"
    echo "$output" | grep -E '^\{.*\}$|^\[.*\]$' | tail -n1
}

# Test valid policy
echo "Running validator on valid policy..."
if ! OUTPUT=$(policy-validation-action validate ./policies/valid.tf 2>&1); then
    echo -e "${RED}Validation of valid policy failed unexpectedly${NC}"
    echo "$OUTPUT"
    exit 1
fi

JSON_RESULT=$(extract_json "$OUTPUT")
if [ -z "$JSON_RESULT" ] || ! echo "$JSON_RESULT" | jq . > /dev/null 2>&1; then
    echo -e "${RED}Valid policy test failed: Invalid JSON output${NC}"
    echo "$OUTPUT"
    exit 1
fi

if ! echo "$JSON_RESULT" | jq -e '.[0].isValid == true' > /dev/null; then
    echo -e "${RED}Valid policy was reported as invalid${NC}"
    echo "$JSON_RESULT"
    exit 1
fi
echo -e "${GREEN}Valid policy validation passed${NC}"

# Test invalid policy
echo "Running validator on invalid policy..."
OUTPUT=$(policy-validation-action validate ./policies/invalid.tf 2>&1 || true)

JSON_RESULT=$(extract_json "$OUTPUT")
if [ -z "$JSON_RESULT" ] || ! echo "$JSON_RESULT" | jq . > /dev/null 2>&1; then
    echo -e "${RED}Invalid policy test failed: Invalid JSON output${NC}"
    echo "$OUTPUT"
    exit 1
fi

if ! echo "$JSON_RESULT" | jq -e '.[0].isValid == false' > /dev/null; then
    echo -e "${RED}Invalid policy was not reported as invalid${NC}"
    echo "$JSON_RESULT"
    exit 1
fi
echo -e "${GREEN}Invalid policy correctly identified${NC}"

# Test variable interpolation
echo "Running validator on policy with variables..."
if ! OUTPUT=$(policy-validation-action validate ./policies/with-vars.tf 2>&1); then
    echo -e "${RED}Validation of policy with variables failed unexpectedly${NC}"
    echo "$OUTPUT"
    exit 1
fi

JSON_RESULT=$(extract_json "$OUTPUT")
if [ -z "$JSON_RESULT" ] || ! echo "$JSON_RESULT" | jq . > /dev/null 2>&1; then
    echo -e "${RED}Variable interpolation test failed: Invalid JSON output${NC}"
    echo "$OUTPUT"
    exit 1
fi

if ! echo "$JSON_RESULT" | jq -e '.[0].isValid == true' > /dev/null; then
    echo -e "${RED}Policy with variables was reported as invalid${NC}"
    echo "$JSON_RESULT"
    exit 1
fi
echo -e "${GREEN}Variable interpolation test passed${NC}"

# Test with specific files option
echo "Testing --files option..."
OUTPUT=$(policy-validation-action validate ./policies --files valid.tf 2>&1 || true)

JSON_RESULT=$(extract_json "$OUTPUT")
if [ -z "$JSON_RESULT" ] || ! echo "$JSON_RESULT" | jq . > /dev/null 2>&1; then
    echo -e "${RED}Files option test failed: Invalid JSON output${NC}"
    echo "$OUTPUT"
    exit 1
fi
echo -e "${GREEN}Files option test passed${NC}"

# Test nonexistent file
echo "Running validator with nonexistent file..."
OUTPUT=$(policy-validation-action validate ./policies/nonexistent.tf 2>&1 || true)

JSON_RESULT=$(extract_json "$OUTPUT")
if [ -z "$JSON_RESULT" ] || ! echo "$JSON_RESULT" | jq . > /dev/null 2>&1; then
    echo -e "${RED}Nonexistent file test failed: Invalid JSON output${NC}"
    echo "$OUTPUT"
    exit 1
fi

if ! echo "$JSON_RESULT" | jq -e '.error' > /dev/null 2>&1; then
    echo -e "${RED}Nonexistent file test failed: Missing expected error format${NC}"
    echo "$JSON_RESULT"
    exit 1
fi
echo -e "${GREEN}Nonexistent file correctly failed with error message${NC}"

echo -e "${GREEN}✅ All tests passed!${NC}"
cd -
rm -rf "$TEST_DIR"