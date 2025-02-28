#!/usr/bin/env bash
set -e

echo "Testing validator functionality..."

# Set up test directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Create test policy files
mkdir -p ./policies

# Valid policy
cat > ./policies/valid.tf << EOF
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

# Invalid policy
cat > ./policies/invalid.tf << EOF
resource "oci_identity_policy" "invalid_policy" {
  statements = [
    "Allow BadSyntax manage",
    "Allow groupDevelopers to use instances in compartment dev",
    "Admit group ServiceAdmins of 123 to manage instances in tenancy"
  ]
}
EOF

# Policy with variables
cat > ./policies/with-vars.tf << EOF
resource "oci_identity_policy" "test_policy_vars" {
  statements = [
    "Allow group \${var.admin_group} to manage all-resources in tenancy",
    "Define tenancy \${var.tenant_name} as \${var.tenant_ocid}",
    "Allow any-user to use instances in compartment \${var.public_compartment} where request.time BETWEEN \${var.start_time} AND \${var.end_time}"
  ]
}
EOF

# Run validator
echo "Running validator on valid policy..."
npm run --silent build

# Test valid policy
if ! RESULT=$(node ../dist/index.js validate ./policies/valid.tf); then
    echo "❌ Validation of valid policy failed unexpectedly"
    exit 1
fi
echo "✅ Valid policy validation passed"

# Test invalid policy - should exit with an error
echo "Running validator on invalid policy..."
if node ../dist/index.js validate ./policies/invalid.tf > /dev/null 2>&1; then
    echo "❌ Validation of invalid policy passed unexpectedly"
    exit 1
else
    echo "✅ Invalid policy correctly failed validation"
    
    # Capture and verify JSON output
    RESULT=$(node ../dist/index.js validate ./policies/invalid.tf 2>&1 || true)
    if ! echo "$RESULT" | jq . > /dev/null 2>&1; then
        echo "❌ Failed output is not valid JSON:"
        echo "$RESULT"
        exit 1
    fi
    echo "✅ Invalid policy returned valid JSON error output"
fi

# Test variable interpolation
echo "Running validator on policy with variables..."
if ! RESULT=$(node ../dist/index.js validate ./policies/with-vars.tf); then
    echo "❌ Validation of policy with variables failed unexpectedly"
    exit 1
fi
echo "✅ Variable interpolation test passed"

# Test with specific files option
echo "Testing --files option..."
if ! RESULT=$(node ../dist/index.js validate . --files valid.tf); then
    echo "❌ Validation with --files option failed unexpectedly"
    exit 1
fi

echo "Running validator with nonexistent file..."
if node ../dist/index.js validate ./policies/nonexistent.tf > /dev/null 2>&1; then
    echo "❌ Validation of nonexistent file passed unexpectedly"
    exit 1
else
    echo "✅ Nonexistent file correctly failed validation"
fi

echo "✅ All validator tests passed!"
cd -
rm -rf "$TEST_DIR"
