# OCI Policy Validation Tool

This tool validates OCI IAM policy statements ensuring that the policies adhere to the correct syntax. It supports multiple CI platforms and provides detailed error messages to help quickly identify and fix syntax issues.

<!-- Consider adding a Table of Contents for easier navigation -->
## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [CLI](#cli)
  - [CLI Options](#cli-options)
  - [Environment Variables](#environment-variables)
  - [Example with Environment Variables](#example-with-environment-variables)
  - [Default Regex Pattern](#default-regex-pattern)
  - [CLI Output Format](#cli-output-format)
- [Usage in CI Platforms](#usage-in-ci-platforms)
  - [GitHub Actions](#github-actions)
  - [GitLab CI example](#gitlab-ci-example)
  - [BitBucket Pipelines example](#bitbucket-pipelines-example)
  - [Error Messages](#error-messages)
- [Configuration](#configuration)
- [Policy Extractors](#policy-extractors)
  - [Available Extractors](#available-extractors)
  - [Regex Policy Extractor Policy Statement Pattern](#regex-policy-extractor-policy-statement-pattern)
- [OCI Core Landing Zone IAM Policy Module Support](#oci-core-landing-zone-iam-policy-module-support)
- [Validators Subsystem](#validators-subsystem)
  - [PolicyValidator Interface](#policyvalidator-interface)
  - [Validation Components](#validation-components)
  - [Available Validators](#available-validators)
  - [OciCisBenchmarkValidator](#ocicisbenchmarkvalidator)
    - [CIS Benchmark Checks](#cis-benchmark-checks)
    - [Validation Process](#validation-process-for-cis)
- [Jest Testing Configuration](#jest-testing-configuration)
- [ANTLR Parser](#antlr-parser)
  - [Grammar Definition](#grammar-definition)
  - [Parser Generation](#parser-generation)
  - [Validation Process](#validation-process)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [CLI Installation Testing](#cli-installation-testing)
  - [Test Structure](#test-structure)
  - [Test Fixtures](#test-fixtures)
  - [CI Test Workflow](#ci-test-workflow)
  - [Coverage Requirements](#coverage-requirements)
- [Development](#development)
  - [Testing Local Installation](#testing-local-installation)
- [Development Workflow](#development-workflow)
  - [Creating a Feature Branch](#creating-a-feature-branch)
  - [Merging into Development via Pull Request](#merging-into-development-via-pull-request)
  - [Preparing for a Production Release](#preparing-for-a-production-release)
  - [Summary of Branching Strategy](#summary-of-branching-strategy)
- [Version Bumping](#version-bumping)
- [Release Process & Versioning](#release-process--versioning)
  - [Workflow Behavior](#workflow-behavior)
  - [Creating a Release](#creating-a-release)
- [License](#license)

## Features

- Validates OCI policy statements in Terraform HCL files.
- Supports OCI Core Landing Zone IAM Policy Module
- Supports multiple OCI policy expression types:
  - Allow, Define, Endorse, and Admit statements.
- Cross-platform support (GitHub Actions, CLI for GitLab CI  & BitBucket Pipelines).
- Handles HCL variable interpolation (${var.name}) in policy statements.
- Colored CLI output with verbose mode.
- Recursive directory scanning.
- Configurable policy extractors for extracting IAM policies from various file types.
- Although Terraform is the primary target, the tool works with any text-based file.

## Prerequisites

- Node.js 18 or higher.

## CLI 

The CLI tool provides validation for OCI policy statements:

```bash
# Install globally (latest version)
npm install -g @gtrevorrow/policy-validation-action

# Install a specific version
npm install -g @gtrevorrow/policy-validation-action@0.2.7

# Install the latest beta version
npm install -g @gtrevorrow/policy-validation-action@beta

# Or install locally in your project
npm install --save-dev @gtrevorrow/policy-validation-action

# Validate with detailed output
policy-validation-action validate ./policies --verbose

# Use custom pattern for policy extraction
policy-validation-action validate ./policies --pattern "statements\\s*=\\s*\\[(.*?)\\]"

# Specify extractor type
policy-validation-action validate ./policies --extractor regex

# Validate specific files
policy-validation-action validate ./policies --files "file1.tf,file2.tf" --verbose

# Exit on error (default: true)
policy-validation-action validate ./policies --exit-on-error false
```

### Running the CLI Directly from the GitHub Repository

You can also source and execute the CLI directly from the GitHub repository without installing it via npm. This is useful for testing or using the latest version of the CLI.

```bash
# Clone the repository
git clone https://github.com/gtrevorrow/policy-validation-action.git

# Navigate to the project directory
cd policy-validation-action

# Install dependencies
npm ci

# Build the CLI
npm run build

# Run the CLI
node dist/index.js validate ./policies --verbose
```

This approach allows you to use the CLI directly from the source code without publishing or installing it globally.

### CLI Options

| Option                | Alias | Description                                                         | Default |
|-----------------------|-------|---------------------------------------------------------------------|---------|
| `path`                |       | Path to a file or directory containing Terraform files              | `.`     |
| `--verbose`           | `-v`  | Enable verbose output                                               | `false` |
| `--pattern`           | `-p`  | Custom regex pattern for policy extraction                          | `none`  |
| `--extractor`         | `-e`  | Policy extractor type (`regex` or `hcl`)                            | `regex` |
| `--files`             |       | Comma-separated list of specific files to process                  | `none`  |
| `--exit-on-error`     |       | Exit with non-zero status if validation fails                       | `true`  |
| `--extension-filter`  |       | Filter files by extension (.tf)                                     | `false` |

### Environment Variables

CLI options can also be set via environment variables. These are useful in CI/CD pipelines where options are passed dynamically.

| Environment Variable           | Corresponding CLI Option  | Description                                  |
|--------------------------------|--------------------------|----------------------------------------------|
| `POLICY_PATH`                  | `path`                   | Path to policy file or directory             |
| `POLICY_VERBOSE`               | `--verbose`              | Enable verbose output                        |
| `POLICY_EXTRACTOR`             | `--extractor`            | Policy extractor type (`regex` or `hcl`)     |
| `POLICY_PATTERN`               | `--pattern`              | Custom regex pattern for policy extraction   |
| `POLICY_FILES`                 | `--files`                | Comma-separated list of specific files       |
| `POLICY_EXIT_ON_ERROR`         | `--exit-on-error`        | Exit with non-zero status if validation fails|
| `POLICY_EXTENSION_FILTER`      | `--extension-filter`     | Filter files by extension (.tf)              |

### Example with Environment Variables

```bash
export POLICY_PATH=./policies
export POLICY_VERBOSE=true
export POLICY_EXTRACTOR=regex
export POLICY_PATTERN="statements\\s*=\\s*\\[(.*?)\\]"
export POLICY_FILES="file1.tf,file2.tf"
export POLICY_EXIT_ON_ERROR=true

policy-validation-action validate
```

### Default Regex Pattern

The default regex pattern for the `regex` extractor is:

```regex
statements\s*=\s*\[(.*?)\]
```
This pattern captures everything between the square brackets, including policy statements, newlines, comments, and variable interpolations.

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

### GitLab CI example

```yaml
validate_policies:
  image: node:latest
  script:
    - npm install -g @gtrevorrow/policy-validation-action # Install the tool globally
    # Set environment variables
    - export POLICY_PATH=./terraform
    - export POLICY_VERBOSE=true
    - export POLICY_EXTRACTOR=regex
    - export POLICY_EXIT_ON_ERROR=true
    # Run policy validation
    - policy-validation-action validate
```

### BitBucket Pipelines example

```yaml
image: node:18

pipelines:
  default:
    - step:
        name: Validate Policies
        script:
          - npm install -g @gtrevorrow/policy-validation-action # Install the tool globally
          # Set environment variables
          - export POLICY_PATH=./terraform
          - export POLICY_VERBOSE=true
          - export POLICY_EXTRACTOR=regex
          - export POLICY_EXIT_ON_ERROR=true
          # Run policy validation
          - policy-validation-action validate
```

### Error Messages

When a policy statement is invalid, the action provides detailed error messages including:
- The invalid statement
- The position of the error
- Expected syntax

Example error output:
```text
Failed to parse policy statement:
Statement: "Allow BadSyntax manage"
Position:       ^ mismatched input 'BadSyntax' expecting {ANYUSER, RESOURCE, DYNAMICGROUP, GROUP, SERVICE}
```

## Configuration

## Policy Extractors

The tool supports pluggable policy extractors for different file formats:

### Available Extractors

- `regex` (default): Uses regular expressions to extract policies from HCL.
- `json`: Planned feature for extracting policies from JSON format.

### Regex Policy Extractor Policy Statement Pattern 

The `regex` extractor pattern can be customized using environment variables as described above:

If no pattern is specified, the action will use a default pattern that handles:
- Multiline statements
- Quoted strings (both single and double quotes)
- Variable interpolation ${var.name}
- Nested structures
- Comments

**Important Considerations for the Regex Pattern:**

*   **Capturing Group:** The regex pattern *must* include a capturing group (using parentheses `()`) that isolates the portion of the text containing the policy statements. For example, in the default pattern:
    ```regex
    statements\s*=\s*\[\s*((?:[^[]*?(?:"(?:[^"\\]|\\.)*"|\$\{(?:[^{}]|\{[^{}]*\})*\})?)*)\s*\]
    ```
    The capturing group isolates the content inside square brackets (`[...]`).

*   **Handling Newlines and Whitespace:** The pattern should handle newlines and varying amounts of whitespace within the policy statements block. The default pattern uses the `s` flag (dot matches newlines) and `\s*` to match optional whitespace.

*   **Comments and Other Syntax:** While the regex pattern itself does not handle comments, the `DefaultExtractionStrategy` removes comments (e.g., `#` or `//`) during preprocessing. Ensure that your pattern focuses on extracting valid statements and relies on preprocessing to handle comments.

*   **Matching the Entire Block:** The regex should match the entire block of policy statements. For example:
    ```terraform
    statements = [
        "Allow group Administrators to manage all-resources in tenancy",
        "Allow group Developers to use instances in compartment dev"
    ]
    ```
    The default pattern captures everything between the square brackets, including newlines and interpolations like `${var.name}`.

**Example:**

## Terraform Policy Extraction

Given the following Terraform code:
```terraform
resource "oci_identity_policy" "test" {
    statements = [
        "Allow group Administrators to manage all-resources in tenancy",
        "Allow group NetworkAdmins to manage virtual-network-family in tenancy foo",
        # This is a comment
        "Allow group Developers to use instances in compartment dev",
        "${var.policy_statement}",
    ]
}
```

As discussed above regex pattern should captures everything between the square brackets ( in the example), including policy statements, newlines, comments, and variable interpolations. The captured group is then passed to the DefaultExtractionStrategy.ts for processing.

**Processing Steps:**
1. **Split into lines:**  
   Splits the captured group into individual lines.
2. **Remove comments:**  
   Removes any lines starting with `#`.
3. **Trim whitespace:**  
   Removes leading and trailing spaces.
4. **Split by commas:**  
   Breaks lines into separate policy statements.
5. **Remove quotes:**  
   Strips surrounding quotes from each statement.
6. **Handle escaped quotes:**  
   Processes any escaped quotes.
7. **Filter empty strings:**  
   Discards any empty elements.

*Illustrative Example:*

Captured string:
```terraform
"Allow group Administrators to manage all-resources in tenancy",
"Allow group NetworkAdmins to manage virtual-network-family in tenancy foo",
# This is a comment
"Allow group Developers to use instances in compartment dev",
"${var.policy_statement}",
```

Processing details:
- **Split into lines:**
```text
"Allow group Administrators to manage all-resources in tenancy",
"Allow group NetworkAdmins to manage virtual-network-family in tenancy foo",
# This is a comment
"Allow group Developers to use instances in compartment dev",
"${var.policy_statement}",
```
- **Remove comments and trim:**
```text
"Allow group Administrators to manage all-resources in tenancy",
"Allow group NetworkAdmins to manage virtual-network-family in tenancy foo",
"Allow group Developers to use instances in compartment dev",
"${var.policy_statement}",
```
- **Split by commas, trim, and remove quotes:**
```text
Allow group Administrators to manage all-resources in tenancy
Allow group NetworkAdmins to manage virtual-network-family in tenancy foo
Allow group Developers to use instances in compartment dev
${var.policy_statement}
```

The final result becomes the following array:
```json
[
  "Allow group Administrators to manage all-resources in tenancy",
  "Allow group NetworkAdmins to manage virtual-network-family in tenancy foo",
  "Allow group Developers to use instances in compartment dev",
  "${var.policy_statement}"
]
```

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

Test fixtures are located in `src/__tests__/fixtures/` and includes files to test the policy validation using some real world examples of OCI IAM policies embedded in Terraform file. 

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

## Development Workflow

### Creating a Feature Branch
1. Ensure you are on the `development` branch:
   ```bash
   git checkout development
   git pull origin development
   ```
2. Create a new feature branch:
   ```bash
   git checkout -b feature/<feature-name>
   ```
3. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: <brief description of the feature>"
   ```
4. Push your feature branch to the remote repository:
   ```bash
   git push origin feature/<feature-name>
   ```

### Merging into Development via Pull Request
1. Open a pull request (PR) from your feature branch into the `development` branch.
2. Ensure the following checks are completed before merging:
   - All tests pass (e.g., `npm test`, `npm run test:cli`).  - Code review is approved by at least one other team member.
   - CI pipelines (e.g., GitHub Actions) pass successfully.
3. Once approved, merge the PR into the `development` branch:
   - Optionally , use the "Squash and Merge" option to keep the commit history clean.

### Preparing for a Production Release
1. Ensure the `development` branch is up-to-date:
   ```bash
   git checkout development
   git pull origin development
   ```
2. Run all tests locally to verify the code:
   ```bash
   npm test
   npm run test:cli
   ```
3. Open a pull request from `development` into `main`:
   - The workflow will detect the `-devel` tag (e.g., `v1.0.0-devel`) and handle retagging and publishing automatically.
   - The pull request should be reviewed and approved by at least one other team member.
   - CI pipelines (e.g., GitHub Actions) should pass successfully.

4. Merge the pull request into `main`:
   - This will trigger the workflow to:
     - Retag the `-devel` tag to a production tag (e.g., `v1.0.0`).
     - Publish the production package to NPM.
     - Create a GitHub release.

5. Verify the release:
   - Check the NPM registry for the production package.
   - Check the GitHub repository for the release.

### Summary of Branching Strategy
- **Feature Branches**: For new features or bug fixes (`feature/<feature-name>`).
- **Development Branch**: For integrating and testing features before production.
- **Main Branch**: For production-ready code and releases.

## Version Bumping

Versions are automatically determined from commit messages using conventional commits. The following commit types are supported:

| Commit Type          | Description                                             | Version Bump |
|----------------------|---------------------------------------------------------|--------------|
| `feat:`              | A new feature                                           | MINOR        |
| `fix:`               | A bug fix                                               | PATCH        |
| `docs:`              | Documentation only changes                              | No bump      |
| `chore:`             | Maintenance tasks                                       | No bump      |
| `style:`             | Code style changes (e.g., formatting)                   | No bump      |
| `refactor:`          | Code refactoring without changing functionality         | No bump      |
| `perf:`              | Performance improvements                                | No bump      |
| `test:`              | Adding or updating tests                                | No bump      |

#### Breaking Changes
A **major version bump** occurs when the `BREAKING CHANGE` keyword is included in the body of a commit message. This can be applied to any commit type.

Example commit messages:
```bash
# Minor bump
feat: add support for JSON policy extraction

# Patch bump
fix: resolve issue with variable interpolation in policies

# Major bump due to breaking change
feat: migrate to new parser API

BREAKING CHANGE: The new parser API is not backward compatible with the previous version.
```

## ANTLR Parser

This project uses ANTLR (ANother Tool for Language Recognition) to parse and validate OCI policy statements. ANTLR is a powerful parser generator that allows us to define a grammar for the OCI policy language and automatically generate a parser that can check if a given policy statement conforms to that grammar.

### Grammar Definition

The grammar for the OCI policy language is defined in the `src/generated/Policy.g4` file. This file specifies the syntax rules for OCI policy statements, including the keywords, operators, and data types that are allowed.

### Parser Generation

The ANTLR parser is generated automatically from the `Policy.g4` file using the ANTLR tool. The generated parser code is located in the `src/generated` directory.

### Validation Process

When the policy validation tool is run, it uses the ANTLR parser to check each policy statement against the grammar. If a statement does not conform to the grammar, the parser will generate an error message indicating the location and type of syntax error. These error messages are then displayed to the user to help them identify and fix the invalid policy statement.

## Jest Testing Configuration

This project uses Jest for testing. The Jest configuration is maintained in a single file to avoid conflicts:

- **Configuration File**: `jest.config.js` in the root directory
- **Setup File**: `jest.setup.js` for global test setup

**Important Notes:**
- Do not configure Jest in both `package.json` and `jest.config.js` as this will cause conflicts
- All Jest configuration should be in `jest.config.js`
- Test files should follow the naming convention `*.test.ts`

### Key Jest Configuration Options

```js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/generated/**"
  ],
  testMatch: [
    "**/__tests__/**/*.test.ts"
  ]
}
```

### Troubleshooting Common Jest Issues

- **Multiple Configuration Files**: If you encounter "Multiple configurations found" errors, ensure Jest is only configured in `jest.config.js` and not in `package.json`.
- **Test Files Not Found**: Ensure test files follow the naming pattern in `testMatch` (e.g., `*.test.ts`).
- **TypeScript Errors**: The preset `ts-jest` handles TypeScript compilation during tests.

## Release Process & Versioning

This project follows [Semantic Versioning](https://semver.org/) with automated version management. The release workflow is designed to handle both development and production releases seamlessly.

### Workflow Behavior

#### Pushing to `development`:
1. **Test Package Publishing**:
   - Publishes a test package to NPM with the `beta` tag.
   - No version bumping or tagging occurs on the `development` branch.

#### Pushing to `main`:
1. **Version Bump and Tagging**:
   - Automatically bumps the version using `standard-version` based on commit messages.
   - Creates a Git tag for the new version (e.g., `v1.0.0`).
2. **Production Package Publishing**:
   - Publishes the package to NPM as a production version.
3. **GitHub Release Creation**:
   - Creates a GitHub release using the new tag and the `CHANGELOG.md` file as the release notes.

### Creating a Release

1. Ensure tests pass:
   ```bash
   npm test
   npm run test:cli
   ```

2. Open a pull request from your feature branch into the `development` branch:
   - This will trigger the workflow to publish a test package with the `beta` tag.
   - The pull request should be reviewed and approved by at least one other team member.
   - CI pipelines (e.g., GitHub Actions) should pass successfully.

3. Open a pull request from `development` into `main`:
   - The workflow will handle version bumping, tagging, and publishing automatically.
   - The pull request should be reviewed and approved by at least one other team member.
   - CI pipelines (e.g., GitHub Actions) should pass successfully.

4. Merge the pull request into `main`:
   - This will trigger the workflow to:
     - Bump the version and create a Git tag.
     - Publish the production package to NPM.
     - Create a GitHub release.

5. Verify the release:
   - Check the NPM registry for the production package.
   - Check the GitHub repository for the release.

### Summary of Branching Strategy
- **Feature Branches**: For new features or bug fixes (`feature/<feature-name>`).
- **Development Branch**: For integrating and testing features before production.
- **Main Branch**: For production-ready code and releases.

## Validators Subsystem

The policy validation tool includes a flexible validators subsystem that checks OCI policy statements against various compliance frameworks and best practices. The subsystem is designed to be extensible, allowing for new validators to be added as needed.

### PolicyValidator Interface

The validators subsystem is built around the `PolicyValidator` interface, which defines the contract for all validators:

```typescript
export interface PolicyValidator {
  /**
   * Returns the name of this validator
   */
  name(): string;
  
  /**
   * Returns the description of this validator
   */
  description(): string;
  
  /**
   * Returns all validation checks this validator can perform
   */
  getChecks(): ValidationCheck[];
  
  /**
   * Validates a list of policy statements
   * @param statements The policy statements to validate
   * @returns A list of validation reports
   */
  validate(statements: string[]): Promise<ValidationReport[]>;
}
```

### Validation Components

The validators subsystem uses several key interfaces to structure the validation process:

1. **ValidationCheck**: Defines a specific check or rule to validate against
   ```typescript
   interface ValidationCheck {
     id: string;         // Unique identifier for the check
     name: string;       // Display name for the check
     description: string; // Description of what the check validates
   }
   ```

2. **ValidationIssue**: Represents a specific issue found during validation
   ```typescript
   interface ValidationIssue {
     checkId: string;     // ID of the check that identified the issue
     statement: string;   // The policy statement with the issue
     message: string;     // Description of the issue
     recommendation?: string; // Suggested fix
     severity: 'info' | 'warning' | 'error'; // Issue severity level
   }
   ```

3. **ValidationReport**: A comprehensive report for a specific check
   ```typescript
   interface ValidationReport {
     checkId: string;     // ID of the check
     name: string;        // Name of the check
     description: string; // Description of the check
     passed: boolean;     // Whether the check passed
     issues: ValidationIssue[]; // List of issues if the check failed
   }
   ```

### Available Validators

The validators subsystem includes the following validators:

- **OciSyntaxValidator**: Validates the syntax of OCI policy statements according to the grammar rules
- **OciCisBenchmarkValidator**: Validates policies against the CIS Benchmark for Oracle Cloud Infrastructure
- **ValidationPipeline**: A pipeline that can run multiple validators in sequence

### OciSyntaxValidator

The `OciSyntaxValidator` is responsible for validating the syntax of OCI policy statements according to the grammar rules defined in the ANTLR parser. It provides detailed error messages with position indicators to help users quickly identify and fix syntax issues.

#### Syntax Validation Process

The OciSyntaxValidator follows these steps for validation:

1. **Parse each policy statement**:
   - Uses the ANTLR-generated parser to analyze each policy statement
   - Identifies any syntax errors according to the OCI policy grammar

2. **Detailed Error Reporting**:
   - Provides exact position information for each error
   - Generates visual position indicators (^ symbol) pointing to the exact location of syntax errors
   - Includes descriptive error messages explaining what was expected at the error location

3. **Example Error Output**:
   ```
   Failed to parse policy statement:
   Statement: "Allow Administrators_without_group to manage all-resources in tenancy"
   Position:       ^ mismatched input 'Administrators_without_group' expecting {ANYUSER, RESOURCE, DYNAMICGROUP, GROUP, SERVICE}
   ```

4. **Usage in Code**:
   ```typescript
   import { OciSyntaxValidator } from '@gtrevorrow/policy-validation-action';
   
   // Create a validator instance
   const validator = new OciSyntaxValidator();
   
   // Define policy statements to validate
   const policyStatements = [
     "Allow group Administrators to manage all-resources in tenancy",
     "Allow BadSyntax manage all-resources in tenancy"  // Invalid syntax
   ];
   
   // Validate the policies
   const results = await validator.validate(policyStatements);
   
   // Process the validation reports
   results.forEach(report => {
     if (!report.passed) {
       console.log(`Invalid syntax in policy: ${report.issues[0].statement}`);
       console.log(`Error: ${report.issues[0].message}`);
     }
   });
   ```

### OciCisBenchmarkValidator

The `OciCisBenchmarkValidator` is specialized for validating OCI IAM policies against the CIS (Center for Internet Security) Benchmark version 2.0 controls.

#### CIS Benchmark Checks

The validator implements six key CIS benchmark checks:

1. **CIS-OCI-1.1: Service-Level Admins**
   - *Description*: Ensures service level admins are created to manage resources of particular services
   - *Critical Services*: Compute, Database, Storage, Network
   - *Validation Logic*: Checks for service-specific admin policies for each critical service

2. **CIS-OCI-1.2: Least Privilege**
   - *Description*: Ensures permissions on all resources are given only to groups that need them
   - *Validation Logic*: Flags "manage all-resources" policies without appropriate conditions as overly permissive

3. **CIS-OCI-1.3: Admin Group Restrictions**
   - *Description*: Ensures IAM administrators cannot update the tenancy Administrators group
   - *Validation Logic*: Checks for "where target.group.name != 'Administrators'" conditions in group management policies

4. **CIS-OCI-1.5: Compartment-level Admins**
   - *Description*: Ensures compartment level admins are used to manage resources in compartments
   - *Validation Logic*: Verifies the existence of compartment-scoped admin policies

5. **CIS-OCI-1.13: MFA Enforcement**
   - *Description*: Ensures multi-factor authentication is enforced for users with console access
   - *Validation Logic*: Checks for "where request.user.mfachallenged == 'true'" conditions in security policies

6. **CIS-OCI-5.2: Network Security Groups**
   - *Description*: Ensures security lists/NSGs are properly configured to restrict access
   - *Validation Logic*: Verifies that network security group policies include appropriate "where" conditions

#### Validation Process for CIS

The validation process in OciCisBenchmarkValidator follows these steps:

1. **Parsing & Analysis**:
   - Initializes an `OciCisListener` to collect policy attributes
   - Uses the ANTLR parser to parse each policy statement
   - Walks the parse tree to identify policy characteristics

2. **Check Execution**:
   - For each CIS check, analyzes the policy characteristics
   - Determines if the policy statements meet the requirements
   - Generates a `ValidationReport` with `passed` status and any issues

3. **Issue Reporting**:
   - For failed checks, provides specific guidance on what's missing
   - Includes recommendations for remediation
   - Assigns appropriate severity levels to issues

4. **Error Handling**:
   - Gracefully handles parsing errors
   - Logs issues for debugging
   - Provides clear error messages for syntax problems

### Using Validators in Code

Validators can be used directly in your code:

```typescript
import { OciCisBenchmarkValidator } from '@gtrevorrow/policy-validation-action';

// Create a validator instance
const validator = new OciCisBenchmarkValidator();

// Define policy statements to validate
const policyStatements = [
  "Allow group Administrators to manage all-resources in tenancy",
  "Allow group NetworkAdmins to manage virtual-network-family in tenancy"
];

// Validate the policies
const reports = await validator.validate(policyStatements);

// Process the validation reports
reports.forEach(report => {
  console.log(`Check: ${report.name} - ${report.passed ? 'PASSED' : 'FAILED'}`);
  if (!report.passed) {
    report.issues.forEach(issue => {
      console.log(`- Issue: ${issue.message}`);
      console.log(`  Recommendation: ${issue.recommendation}`);
    });
  }
});
```

### Extending with Custom Validators

You can create custom validators by implementing the `PolicyValidator` interface. This allows you to define your own validation rules and checks:

```typescript
import { PolicyValidator, ValidationCheck, ValidationReport } from '@gtrevorrow/policy-validation-action';

export class CustomValidator implements PolicyValidator {
  name(): string {
    return 'Custom Validator';
  }
  
  description(): string {
    return 'Custom validation for organization-specific requirements';
  }
  
  getChecks(): ValidationCheck[] {
    return [
      {
        id: 'CUSTOM-1',
        name: 'Custom Check',
        description: 'Organization-specific policy check'
      }
    ];
  }
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    // Implement your custom validation logic here
    // ...
    
    return reports;
  }
}
```

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
