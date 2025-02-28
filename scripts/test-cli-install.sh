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

echo "Installing dependencies..."
npm ci || {
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
}

echo "Building package..."
npm run build --verbose || {
    echo -e "${RED}Build failed${NC}"
    exit 1
}

echo "Creating test directory..."
mkdir -p "$TEST_DIR/policies"
cd "$TEST_DIR"

# Rest of test script
echo "Installing package globally..."
npm link "$ORIGINAL_DIR" || {
    echo -e "${RED}Failed to link package${NC}"
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

# Test CLI
echo "Testing CLI..."
policy-validator --path ./policies/test.tf || {
    echo -e "${RED}CLI validation failed${NC}"
    exit 1
}

echo -e "${GREEN}All tests passed!${NC}"

echo "Testing CLI installation..."

# Set up test directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Create a policy file for testing
mkdir -p ./policies
cat > ./policies/test-policy.tf << EOF
resource "oci_identity_policy" "policy_example" {
  compartment_id = var.tenancy_id
  description = "Policy for example"
  name = "policy-example"
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group Developers to use instances in compartment dev"
  ]
}
EOF

# Install the package locally
echo "Installing package from local directory..."
npm install -g ../

# Test the CLI
echo "Running validation..."
if ! RESULT=$(policy-validation-action validate ./policies/test-policy.tf); then
    echo "❌ Validation failed unexpectedly"
    exit 1
fi

# Verify JSON output
echo "$RESULT" | jq . > /dev/null 2>&1 || {
    echo "❌ Output is not valid JSON:"
    echo "$RESULT"
    exit 1
}

echo "$RESULT" | jq -e '.[0].isValid == true' > /dev/null || {
    echo "❌ Policy should be valid but was reported as invalid"
    echo "$RESULT"
    exit 1
}

# Create invalid policy
cat > ./policies/invalid-policy.tf << EOF
resource "oci_identity_policy" "invalid_policy" {
  compartment_id = var.tenancy_id
  description = "Invalid policy"
  name = "policy-invalid"
  statements = [
    "Allow BadSyntax manage"
  ]
}
EOF

# Test with invalid policy - should fail but provide JSON output
if RESULT=$(policy-validation-action validate ./policies/invalid-policy.tf); then
    # Check if the JSON indicates failure
    if ! echo "$RESULT" | jq -e '.[0].isValid == false' > /dev/null; then
        echo "❌ Invalid policy was reported as valid"
        echo "$RESULT"
        exit 1
    fi
else
    # Command failed but we should still have JSON output
    RESULT=$(policy-validation-action validate ./policies/invalid-policy.tf 2>&1 || true)
    if ! echo "$RESULT" | jq . > /dev/null 2>&1; then
        echo "❌ Failed output is not valid JSON:"
        echo "$RESULT"
        exit 1
    fi
fi

# Test with files option
RESULT=$(policy-validation-action validate . --files test-policy.tf 2>&1 || true)
if ! echo "$RESULT" | jq . > /dev/null 2>&1; then
    echo "❌ Failed output with --files option is not valid JSON:"
    echo "$RESULT"
    exit 1
fi

echo "✅ CLI tests passed!"
cd -
rm -rf "$TEST_DIR"