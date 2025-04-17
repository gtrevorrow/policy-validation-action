# Development, Build, Test, and Release Guide

This document describes how to build, test, and release the OCI Policy Validation Tool, as well as the project's development workflow.

## Prerequisites

- Node.js 18 or higher.

## Building the Project

```bash
npm ci
npm run build
```

## Running Tests

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

Test fixtures are located in `src/__tests__/fixtures/` and include files to test the policy validation using real-world examples of OCI IAM policies embedded in Terraform files.

### CI Test Workflow

The GitHub Actions workflow (`.github/workflows/test.yml`), GitLab CI configuration (`.gitlab-ci.yml`), and BitBucket Pipelines file (`bitbucket-pipelines.yml`) all execute policy validation during their pipelines to ensure cross-platform consistency.

### Coverage Requirements

The test suite aims for:
- Statement coverage: >80%
- Branch coverage: >75%
- Function coverage: >90%

View coverage reports in the `coverage/` directory after running `npm run test:coverage`.

## Development Workflow

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
   - All tests pass (e.g., `npm test`, `npm run test:cli`).
   - Code review is approved by at least one other team member.
   - CI pipelines (e.g., GitHub Actions) pass successfully.
3. Once approved, merge the PR into the `development` branch:
   - Optionally, use the "Squash and Merge" option to keep the commit history clean.

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

## Committing Changes

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which helps automate versioning and changelog generation. To simplify creating compliant commit messages, we use [Commitizen](http://commitizen.github.io/cz-cli/).

**Using Commitizen:**

Instead of `git commit` you can optionally use the following command:

```bash
npm run commit
```

This will launch an interactive prompt that guides you through creating a compliant commit message.

**Commit Message Format:**

Commit messages must follow the Conventional Commits specification. The basic format is:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, etc.

**Signed-off-by Requirement:**

All commits **must** include a `Signed-off-by:` trailer in the commit message footer. This indicates that you agree to the project's contribution guidelines and license (Developer Certificate of Origin).

A Git hook (`prepare-commit-msg`) is configured using Husky to automatically add this trailer based on your Git `user.name` and `user.email` configuration if it's missing. Please ensure your Git user information is correctly set globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Commit Linting:**

A Git hook (`commit-msg`) is configured using Husky and Commitlint to automatically check your commit message against the Conventional Commits specification and the `Signed-off-by:` requirement before the commit is finalized. If the message is non-compliant, the commit will be aborted with an error message explaining the issue.

## Version Bumping

Versions are automatically determined from commit messages using conventional commits, as enforced by Commitizen and Commitlint. The following commit types influence version bumps:

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
