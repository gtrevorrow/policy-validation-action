#!/usr/bin/env bash
# Test script for validator configuration in CLI

echo "Creating test directory..."
TEST_DIR=$(mktemp -d)
echo "Test directory: $TEST_DIR"

# Create policy files for testing
cat << EOF > "$TEST_DIR/policy1.tf"
resource "oci_identity_policy" "test_policy" {
  name = "test_policy"
  description = "Test policy"
  statements = [
    "Allow group Administrators to manage all-resources in tenancy"
  ]
}
EOF

cat << EOF > "$TEST_DIR/policy2.tf"
resource "oci_identity_policy" "test_policy_2" {
  name = "test_policy_2"
  description = "Test policy 2"
  statements = [
    "Allow group NetworkAdmins to manage virtual-network-family in tenancy"
  ]
}
EOF

echo "Testing with default validator configuration..."
node ./lib/cli.js validate "$TEST_DIR"

echo "Testing with local validators disabled..."
POLICY_VALIDATORS_LOCAL=false node ./lib/cli.js validate "$TEST_DIR"

echo "Testing with global validators disabled..."
POLICY_VALIDATORS_GLOBAL=false node ./lib/cli.js validate "$TEST_DIR"

echo "Testing with CIS benchmark enabled..."
node ./lib/cli.js validate "$TEST_DIR" --cis-benchmark

echo "Testing with all validators disabled..."
POLICY_VALIDATORS_LOCAL=false POLICY_VALIDATORS_GLOBAL=false node ./lib/cli.js validate "$TEST_DIR"

echo "Cleaning up test directory..."
rm -rf "$TEST_DIR"
