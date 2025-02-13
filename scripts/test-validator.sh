#!/bin/bash

set -e

# Colors for output
BLUE='\033[0;34m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Ensure test-cli-install.sh has been run first
if ! command -v policy-validator &> /dev/null; then
    echo "policy-validator not found. Please run test-cli-install.sh first"
    exit 1
fi

echo -e "${BLUE}Running policy-validator examples:${NC}"

# Helper function to check invalid policy output
check_invalid_output() {
    local output="$1"
    
    # Get only stdout lines that look like JSON
    local json_line=$(echo "$output" | grep -E '^\{.*\}$|^\[.*\]$' | tail -n1)
    
    if [ -z "$json_line" ]; then
        echo -e "${RED}Error: No JSON output found${NC}"
        echo -e "${RED}Full output:${NC}"
        echo "$output"
        return 1
    fi

    # Validate JSON structure and content
    if ! echo "$json_line" | jq -e '
        (arrays and all(.[] | .isValid == false and .errors)) or
        (objects and (.error or .isValid == false))
    ' >/dev/null; then
        echo -e "${RED}Error: Invalid JSON structure or content${NC}"
        echo -e "${RED}JSON output:${NC}"
        echo "$json_line" | jq '.'
        return 1
    fi

    echo -e "${GREEN}Invalid policy validation output matches expected format${NC}"
    return 0
}

# Example policy statements with different scenarios
policy-validator --help

echo -e "\n${BLUE}1. Validate with custom pattern:${NC}"
policy-validator --path ./src/__tests__/fixtures/valid.tf --pattern "statements\\s*=\\s*\\[(.*?)\\]"

echo -e "\n${BLUE}2. Validate with verbose output:${NC}"
policy-validator --path ./src/__tests__/fixtures/valid.tf --verbose

echo -e "\n${BLUE}3. Validate using specific extractor:${NC}"
policy-validator --path ./src/__tests__/fixtures/valid.tf --extractor regex

echo -e "\n${BLUE}4. Validate with invalid policy:${NC}"
if OUTPUT=$(policy-validator --path ./src/__tests__/fixtures/invalid.tf 2>&1); then
    echo -e "${RED}Error: Invalid policy validation should have failed${NC}"
    exit 1
else
    echo "Invalid policy validation failed as expected"
    check_invalid_output "$OUTPUT"
fi

echo -e "\n${BLUE}All examples completed.${NC}"
