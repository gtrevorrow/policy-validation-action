# OCI Policy Validation Tool

<!-- Consider adding a Table of Contents for easier navigation -->
## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage in CI Platforms](#usage-in-ci-platforms)
- [CLI](#cli)
- [Configuration](#configuration)
- [Policy Extractors](#policy-extractors)
- [Error Messages](#error-messages)
- [Testing](#testing)
- [Development](#development)
- [Release Process & Versioning](#release-process--versioning)
- [License](#license)

## Features

- Validates OCI policy statements in Terraform files.
- Supports multiple OCI policy expression types:
  - Allow, Define, Endorse, and Admit statements.
- Cross-platform support (GitHub Actions, GitLab CI, BitBucket Pipelines, CLI).
- Handles HCL variable interpolation (${var.name}) in policy statements.
- Colored CLI output with verbose mode.
- Recursive directory scanning.
- Configurable policy extractors for extracting IAM policies from various file types.
- Although Terraform is the primary focus, the tool works with any text-based file.

## Prerequisites

- Node.js 16 or higher.
- For CI/CD usage, access to GitHub Actions, GitLab CI, or BitBucket Pipelines.
- Terraform files containing OCI policy statements.

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

#### Github Action Inputs

| Name                | Description                                                          | Required | Default |
|---------------------|----------------------------------------------------------------------|----------|---------|
| `path`              | Path to policy file or directory                                     | No       | `.`     |
| `extractor`         | Type of policy extractor to use (regex, json)                        | No       | `regex` |
| `extractorPattern`  | Custom pattern for the policy extractor                              | No       | -       |
| `exitOnError`       | Exit immediately if policy validation fails                          | No       | `true`  |

#### Github Action Outputs

| Name                  | Description                                                                        |
|-----------------------|------------------------------------------------------------------------------------|
| `policy_expressions`  | List of all validated policy expressions (Allow, Define, Endorse, Admit)           |

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

## CLI 

The CLI tool provides validation for OCI policy statements:

```bash
# Install globally
npm install -g policy-validation-action

# Validate with detailed output
policy-validator --path ./policies --verbose

# Use custom pattern for policy extraction
policy-validator --path ./policies --pattern "statements\s*=\s*\[(.*?)\]"

# Specify extractor type
policy-validator --path ./policies --extractor regex

# Show help
policy-validator --help
```

### CLI Options

| Option           | Alias | Description                                                         | Default |
|------------------|-------|---------------------------------------------------------------------|---------|
| `--path`         | `-p`  | Path to policy file or directory                                    | `.`     |
| `--verbose`      | `-v`  | Enable verbose output                                               | false   |
| `--extractor`    |       | Policy extractor type (regex)                                       | `regex` |
| `--pattern`      |       | Custom regex pattern for policy extraction                          | System default |
| `--exitOnError`  |       | Exit immediately if validation fails                                | `true`  |
| `--version`      |       | Show version number                                                 | n/a     |
| `--help`         |       | Show help                                                           | n/a     |

### CLI Output Format

The CLI produces JSON-formatted output containing an array of validation results. Each result provides details for a specific file and has the following structure:
```json
[
  {
    "file": "path/to/file.tf",
    "isValid": boolean,
    "statements": [ "policy statement 1", "policy statement 2", ... ],
    "errors": [
      {
        "statement": "failed statement",
        "position": number,
        "message": "error message"
      }
    ]
  }
]
```
- If all policies are valid, `isValid` will be `true` and the `errors` array will be empty.
- If any policy fails validation, `isValid` will be `false` and the `errors` array will contain detailed error objects.

#### Successful Output Example:
```json
[
  {
    "file": "./terraform/example.tf",
    "isValid": true,
    "statements": [
      "Allow group Administrators to manage all-resources in tenancy"
    ],
    "errors": []
  }
]
```

#### Unsuccessful Output Example:
```json
[
  {
    "file": "./terraform/bad_example.tf",
    "isValid": false,
    "statements": [
      "Allow BadSyntax manage"
    ],
    "errors": [
      {
        "statement": "Allow BadSyntax manage",
        "position": 6,
        "message": "mismatched input 'BadSyntax' expecting {ANYUSER, RESOURCE, DYNAMICGROUP, GROUP, SERVICE}"
      }
    ]
  }
]
```

## Configuration

### Policy Statement Pattern

The tool uses a regular expression to extract policy statements from Terraform files. This pattern can be customized for each supported CI platform using environment variables:

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

### OCI Core Landing Zone IAM Policy Module Support

This tool supports the OCI Core Landing Zone IAM policy module.  When using this module, ensure that the `path` in your CI configuration points to the directory containing the Terraform files generated by the module.  The default `regex` extractor should work without modification, as it is designed to find policy statements within Terraform files.

For example, if you have a directory structure like this:
```
.
├── terraform
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
```
You would set the `path` to `./terraform` in your CI configuration.

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

The `test-cli-install.sh` script verifies the CLI functionality by:

1. Building and Installing
   - Builds the package from source
   - Links package globally
   - Verifies command availability

2. Basic Validation Tests
   - Creates test policy files
   - Validates policy syntax
   - Tests command line parameters
   - Verifies JSON output
   - Checks error handling

Example test policy:
```hcl
resource "oci_identity_policy" "test" {
    statements = [
        "Allow group Administrators to manage all-resources in tenancy"
    ]
}
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

### CI Test Workflow

The GitHub Actions workflow (`.github/workflows/test.yml`), GitLab CI configuration (`.gitlab-ci.yml`), and BitBucket Pipelines file (`bitbucket-pipelines.yml`) all execute policy validation during their pipelines to ensure cross-platform consistency.

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

Versions are automatically determined from commit messages using conventional commits:

| Commit Type          | Description                                             | Version Bump |
|----------------------|---------------------------------------------------------|--------------|
| `feat:`              | A new feature                                           | MINOR        |
| `fix:`               | A bug fix                                               | PATCH        |
| `docs:`              | Documentation only changes                              | No bump      |
| `chore:`             | Maintenance tasks                                       | No bump      |
| `BREAKING CHANGE:`   | Breaking API changes (in commit body)                   | MAJOR        |

Example commit messages:
```bash
# Patch bump
fix: correct policy parsing error

# Minor bump
feat: add new JSON extractor

# Major bump
feat: migrate to new parser API

BREAKING CHANGE: new parser API is not backwards compatible
```

### Creating a Release

1. Ensure tests pass:
   ```bash
   npm test
   npm run test:cli
   ```

2. Create release:
   ```bash
   npm run release
   ```

3. Push the release:
   ```bash
   git push --follow-tags origin main
   ```

4. After successful release:
   ```bash
   git checkout main
   git merge --no-ff development
   git push origin main
   ```

5. Return to development:
   ```bash
   git checkout development
   ```

The release workflow will automatically:
- Update CHANGELOG.md based on commit messages
- Bump version in package.json based on conventional commits
- Create git tag
- Build distribution files
- Create GitHub release
- Publish to npm (not yet implemented)

### Release Workflow

The release process is integrated into CI pipelines:

- GitHub Actions: Automated tests and npm publishing on tags
- GitLab CI: Version validation and artifact generation
- BitBucket Pipelines: Automated npm publishing via pipe

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
