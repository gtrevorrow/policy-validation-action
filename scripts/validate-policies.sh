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
    -p, --path PATH     Directory or file to scan (default: current directory)
    -e, --extractor    Extractor type to use (default: regex)
    -r, --pattern      Custom regex pattern for extraction
    -v, --verbose      Enable verbose output
    -h, --help         Show this help message

Examples:
    validate-policies ./terraform/policies
    validate-policies -v -p ./terraform/main.tf
    validate-policies -p ./policies -r "statements\\s*=\\s*\\[(.*?)\\]"
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--path)
            SCAN_PATH="$2"
            shift 2
            ;;
        -e|--extractor)
            EXTRACTOR="$2"
            shift 2
            ;;
        -r|--pattern)
            PATTERN="$2"
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
CMD="policy-validator --path ${SCAN_PATH:-$DEFAULT_PATH} --extractor $EXTRACTOR"
[[ -n "$PATTERN" ]] && CMD="$CMD --pattern '$PATTERN'"
[[ $VERBOSE -eq 1 ]] && CMD="$CMD --verbose"

# Execute
eval $CMD
exit_code=$?

exit $exit_code
