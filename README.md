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
        continue-on-error: true # Optional: continue pipeline if validation fails

      - name: Check validation results  
        if: ${{ steps.validate.outcome == 'failure' }}
        run: |
          echo "Policy validation failed"
          exit 1
```

### BitBucket Pipelines

```yaml
image: node:16

pipelines:
  default:
    - step:
        name: Validate Policies
        script:
          - npm ci
          - npm run build
          - chmod +x ./lib/cli.js
          - ./lib/cli.js --path ./terraform
        artifacts:
          - dist/**
```

### GitLab CI

```yaml
validate_policies:
  image: node:16
  script:
    - npm ci
    - npm run build
    - chmod +x ./lib/cli.js
    - ./lib/cli.js --path ./terraform
  artifacts:
    reports:
      junit: test-results/test-results.xml
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `path` | Path to policy file or directory | No | `.` |

## Outputs

| Name | Description |
|------|-------------|
| `policy_expressions` | List of all validated policy expressions (Allow, Define, Endorse, Admit) |

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

The CLI tool now supports more options and improved validation reporting:

```bash
# Basic usage
policy-validator --path ./policies

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

## Semantic Versioning & Release Process

This project adheres to [Semantic Versioning](https://semver.org/). To bump the version and generate a changelog, run:
```bash
npm run release
```
Ensure that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format so that the release tool can automatically determine the version bump level.

### Conventional Commit Format

Commit messages should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Type:** Must be one of the following:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
- `chore`: Other changes that don't modify src or test files.
- `revert`: Reverts a previous commit.

**Scope (optional):** A scope can be provided to a commit’s type, to provide additional contextual information.

**Description:** A brief description of the change.

**Body (optional):** More detailed explanation of the commit, if necessary.

**Footer (optional):** Can contain information about breaking changes or issue references.  A breaking change should be indicated with `BREAKING CHANGE:` followed by a description.

### Examples

```
feat: Add policy validation feature

This commit introduces the core policy validation logic.

BREAKING CHANGE: The policy validation API has changed.
```

```
fix(cli): Resolve CLI installation issue

Fixes the "No such file or directory" error during CLI installation.
```

By adhering to this format, `standard-version` can automatically generate a changelog and bump the version number appropriately.

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
