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

Add this to your `.github/workflows/validate-policies.yml`:
```yaml
name: Validate Policies
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate policies
        uses: policy-validation-action@v1.0.0
        with:
          path: './path/to/policies'
```

### BitBucket Pipelines

Add this to your `bitbucket-pipelines.yml`:
```yaml
pipelines:
  default:
    - step:
        name: Validate Policies
        image: node:14
        script:
          - node lib/cli.js --path ./path/to/policies
```

### GitLab CI

Add this to your `.gitlab-ci.yml`:
```yaml
validate_policies:
  image: node:14
  script:
    - node lib/cli.js --path ./path/to/policies
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `path` | Path to policy file or directory | No | `.` |

## Outputs

| Name | Description |
|------|-------------|
| `policy_expressions` | List of all validated policy expressions (Allow, Define, Endorse, Admit) |
| `allow_segments` | List of validated allow statements (backward compatibility) |

## Example

```yaml
name: Validate OCI Policies
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate policies
        uses: policy-validation-action@v1.0.0
        with:
          path: './terraform'
```

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

#### GitHub Actions

```yaml
- uses: ./policy-validation-action
  env:
    POLICY_STATEMENTS_PATTERN: "statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]"
  with:
    path: './policies'
```

#### GitLab CI

```yaml
validate_policies:
  script:
    - export POLICY_STATEMENTS_PATTERN='statements\s*=\s*\[\s*((?:[^[\]]*?(?:"(?:[^"\\]|\\.)*"|'"'"'(?:[^'"'"'\\]|\\.)*'"'"'|\$\{(?:[^{}]|\{[^{}]*\})*\})?)*)\s*\]'
    - npm ci
    - npm run validate
```

#### BitBucket Pipelines

```yaml
pipelines:
  default:
    - step:
        script:
          - export POLICY_STATEMENTS_PATTERN='statements\s*=\s*\[\s*((?:[^[\]]*?(?:"(?:[^"\\]|\\.)*"|'"'"'(?:[^'"'"'\\]|\\.)*'"'"'|\$\{(?:[^{}]|\{[^{}]*\})*\})?)*)\s*\]'
          - npm ci
          - npm run validate
```

If no pattern is specified, the action will use a default pattern that handles:
- Multiline statements
- Quoted strings (both single and double quotes)
- Variable interpolation ${var.name}
- Nested structures
- Comments

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

The tool can be used directly from the command line:

```bash
# Install globally
npm install -g policy-validation-action

# Validate a single file
policy-validator ./path/to/policy.tf

# Validate all .tf files in a directory (recursive)
policy-validator ./path/to/policies/

# Run with verbose output
policy-validator --verbose ./path/to/policies/

# Show help
policy-validator --help
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--verbose, -v` | Enable verbose output | `false` |
| `--path, -p` | Path to policy file or directory | `.` |
| `--pattern` | Custom regex pattern for policy extraction | System default |

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

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
