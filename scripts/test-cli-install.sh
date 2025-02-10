#!/bin/bash

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