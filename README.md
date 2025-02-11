# OCI Policy Validation Tool

A CI/CD tool for validating Oracle Cloud Infrastructure (OCI) policy statements in Terraform configurations. Supports GitHub Actions, GitLab CI, and BitBucket Pipelines.

## Features

- Validates OCI policy statements in Terraform files
- Supports multiple OCI policy expression types:
  - Allow statements
  - Define statements
  - Endorse statements
  - Admit statements
- Cross-platform support (GitHub Actions, GitLab CI, BitBucket Pipelines, CLI)
- Handles HCL variable interpolation (${var.name}) in policy statements
- Colored CLI output with verbose mode
- Recursive directory scanning

## Prerequisites

- Node.js 16 or higher
- For CI/CD usage: Access to GitHub Actions, GitLab CI, or BitBucket Pipelines
- Terraform files containing OCI policy statements

## Installation

```bash
# Install globally from npm registry
npm install -g policy-validation-action

# Or install locally in your project
npm install --save-dev policy-validation-action
```

### Publishing to npm

```bash
# Login to npm
npm login

# Publish package
npm publish
```

## Usage in CI Platforms

### GitHub Actions

```yaml
name: Validate OCI Policies
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate policies
        uses: policy-validation-action@v1
        with:
          path: './terraform'
          extractor: 'regex'  # Optional: defaults to regex
          extractorPattern: 'your-custom-pattern'  # Optional
```

### GitLab CI

```yaml
validate_policies:
  image: node:latest
  script:
    - npm ci
    - npm run build
    # Run Jest tests with reporting
    - npm test
    # Run policy validation
    - node dist/index.js --path ./terraform
  artifacts:
    reports:
      junit: test-results/test-results.xml
    paths:
      - test-results/
    when: always
```

### BitBucket Pipelines

```yaml
image: node:16

definitions:
  steps:
    - step: &validate
        name: Validate
        script:
          - npm ci
          - npm run build
          # Run tests with detailed reporting
          - npm test
          # Validate policies
          - node dist/index.js --path ./terraform
        artifacts:
          reports:
            junit: test-results/test-results.xml
          when: always

pipelines:
  default:
    - step: *validate
```

## Github Action Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `path` | Path to policy file or directory | No | `.` |
| `extractor` | Type of policy extractor to use (regex, json) | No | `regex` |
| `extractorPattern` | Custom pattern for the policy extractor | No | - |

## Github Action Outputs

| Name | Description |
|------|-------------|
| `policy_expressions` | List of all validated policy expressions (Allow, Define, Endorse, Admit) |


## Example Policy Format

```hcl
resource "oci_identity_policy" "example" {
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group Developers to use instances in compartment dev"
  ]
}
```

## Configuration

### Policy Statement Pattern

The action uses a regular expression to extract policy statements from Terraform files. This pattern can be customized for each supported CI platform using environment variables:

If no pattern is specified, the action will use a default pattern that handles:
- Multiline statements
- Quoted strings (both single and double quotes)
- Variable interpolation ${var.name}
- Nested structures
- Comments

## Policy Extractors

The tool supports pluggable policy extractors for different file formats:

### Available Extractors

- `regex` (default): Uses regular expressions to extract policies from HCL
- `json`: (coming soon) Extracts policies from JSON format

### Configuring Extractors

In GitHub Actions:
```yaml
- uses: policy-validation-action@v1
  with:
    path: './terraform'
    extractor: 'regex'
    extractorPattern: 'your-custom-pattern'  # Optional
```

In CLI:
```bash
policy-validator --path ./policies --extractor regex --pattern "your-custom-pattern"
```

## Error Messages

When a policy statement is invalid, the action provides detailed error messages including:
- The invalid statement
- The position of the error
- Expected syntax

Example error output:
```
Failed to parse policy statement:
Statement: "Allow BadSyntax manage"
Position:       ^ mismatched input 'BadSyntax' expecting {ANYUSER, RESOURCE, DYNAMICGROUP, GROUP, SERVICE}
```

## CLI Usage

The CLI tool now supports more options and improved validation reporting:

```bash
# Install globally
npm install -g policy-validation-action

# Validate with detailed output
policy-validator --path ./policies --verbose

# Use custom pattern for policy extraction
policy-validator --path ./policies --pattern "statements\s*=\s*\[(.*?)\]"

# Validate single file
policy-validator --path ./policies/main.tf

# Show help
policy-validator --help
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--path, -p` | Path to policy file or directory | `.` |
| `--verbose, -v` | Enable verbose output | `false` |
| `--pattern` | Custom regex pattern for policy extraction | System default |
| `--version` | Show version number | n/a |
| `--help` | Show help | n/a |

### CLI Exit Codes

- 0: All policies valid
- 1: Invalid policies found
- 2: CLI error (invalid arguments, file not found, etc)

## Testing

The project includes a comprehensive test suite using Jest and CLI installation testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Test CLI installation and functionality
npm run test:cli
```

### CLI Installation Testing

The `test-cli-install.sh` script performs comprehensive CLI testing:

1. Installation Verification
   - Builds and links package locally
   - Verifies global command availability

2. Command Testing
   - `--help`: Verifies help documentation
   - `--version`: Checks version output
   - File validation: Tests single file processing
   - Directory scanning: Tests recursive directory processing
   - Verbose mode: Tests detailed output
   - Custom pattern: Tests pattern matching

3. Policy Validation Testing
   - Valid policy statements
   - Variable interpolation
   - All expression types (Allow, Define, Endorse, Admit)
   - Conditional statements
   - Error handling for invalid syntax

Example test policy types:
```hcl
# Valid basic statements
Allow group Administrators to manage all-resources in tenancy

# Variable interpolation
Allow group ${var.admin_group} to manage all-resources in tenancy

# Conditional statements
Allow any-user to use instances where request.time BETWEEN ${var.start_time} AND ${var.end_time}

# Invalid spacing (fails validation)
AllowBadSyntax manage
```

### Test Structure

- `__tests__/policy-validation.test.ts`: Core validation tests
  - Policy statement extraction
  - Variable interpolation
  - Expression type validation
  - Error handling

### Test Fixtures

Test fixtures are located in `src/__tests__/fixtures/` and include:
- `valid.tf`: Valid policy statements
- `invalid.tf`: Invalid policy syntax
- `valid_vars.tf`: Policies with variable interpolation
- `valid_conditions.tf`: Policies with conditional statements
- `all_expressions.tf`: All supported expression types

### CI Test Workflow

The GitHub Actions workflow (`test.yml`) performs:
1. Policy validation tests
2. Expression type checks
3. Variable interpolation validation
4. Error handling verification
5. Cross-platform compatibility tests

### Coverage Requirements

The test suite aims for:
- Statement coverage: >80%
- Branch coverage: >75%
- Function coverage: >90%

View coverage reports in the `coverage/` directory after running `npm run test:coverage`.

## Development

### Testing Local Installation

Before publishing to npm, test the CLI installation locally:

```bash
# Test CLI installation
npm run test:cli

# This will:
# 1. Link the package globally
# 2. Create test policy files
# 3. Run CLI commands
# 4. Clean up test files
```

## Release Process & Versioning

This project follows [Semantic Versioning](https://semver.org/) with automated version management:

### Version Bumping

Versions are automatically determined from commit messages:
- `feat:` commits trigger MINOR version bump
- `fix:` commits trigger PATCH version bump
- Commits with `BREAKING CHANGE:` in footer trigger MAJOR version bump

### Creating a Release

1. Ensure all changes are committed
2. Run the release command:
   ```bash
   npm run release
   ```
3. This will:
   - Analyze commit messages
   - Bump version accordingly
   - Generate/update CHANGELOG.md
   - Create a git tag
   - Push changes and tag

### Release Workflow

The release process is integrated into CI pipelines:

- GitHub Actions: Automated tests and npm publishing on tags
- GitLab CI: Version validation and artifact generation
- BitBucket Pipelines: Automated npm publishing via pipe

Example workflow:
```bash
# Make your changes
git add .
git commit -m "feat: add new extractor feature

BREAKING CHANGE: new extractor API"

# Create release
npm run release

# Push changes and tags
git push --follow-tags origin main
```

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
