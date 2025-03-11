#!/bin/bash

# Default values
DEFAULT_PATH="."
EXTRACTOR="regex"
VERBOSE=0

# Help message
usage() {
    cat << EOF
Usage: validate-policies [OPTIONS] [PATH]

Validate OCI policy statements in Terraform files.

Options:
    -p, --pattern PATTERN  Custom regex pattern for extraction
    -e, --extractor TYPE   Extractor type to use (default: regex)
    -f, --files FILES      Comma-separated list of specific files to process
    -v, --verbose          Enable verbose output
    -h, --help             Show this help message

Examples:
    validate-policies ./terraform/policies
    validate-policies -v ./terraform/main.tf
    validate-policies ./policies -p "statements\\s*=\\s*\\[(.*?)\\]"
    validate-policies ./terraform -f "main.tf,policies.tf"
EOF
}

# Parse arguments
COMMAND_ARGS=()
FILES=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--pattern)
            PATTERN="$2"
            shift 2
            ;;
        -e|--extractor)
            EXTRACTOR="$2"
            shift 2
            ;;
        -f|--files)
            FILES="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=1
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            SCAN_PATH="$1"
            shift
            ;;
    esac
done

# Build command
CMD="policy-validation-action validate ${SCAN_PATH:-$DEFAULT_PATH}"
[[ -n "$PATTERN" ]] && CMD="$CMD -p '$PATTERN'"
[[ -n "$EXTRACTOR" ]] && CMD="$CMD -e $EXTRACTOR"
[[ -n "$FILES" ]] && CMD="$CMD --files '$FILES'"
[[ $VERBOSE -eq 1 ]] && CMD="$CMD -v"

echo "Executing: $CMD"
# Execute
eval $CMD
exit_code=$?

exit $exit_code
