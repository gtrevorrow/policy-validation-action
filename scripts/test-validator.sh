#!/bin/bash

set -e

# Colors for output
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure test-cli-install.sh has been run first
if ! command -v policy-validator &> /dev/null; then
    echo "policy-validator not found. Please run test-cli-install.sh first"
    exit 1
fi

echo -e "${BLUE}Running policy-validator examples:${NC}"

# Example policy statements with different scenarios
policy-validator --help

echo -e "\n${BLUE}1. Validate with custom pattern:${NC}"
policy-validator --path ./src/__tests__/fixtures --pattern "statements\\s*=\\s*\\[(.*?)\\]"

echo -e "\n${BLUE}2. Validate with verbose output:${NC}"
policy-validator --path ./src/__tests__/fixtures --verbose

echo -e "\n${BLUE}3. Validate using specific extractor:${NC}"
policy-validator --path ./src/__tests__/fixtures --extractor regex

echo -e "\n${BLUE}All examples completed.${NC}"
