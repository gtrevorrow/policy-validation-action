# Policy Validation Action

A GitHub Action to validate Oracle Cloud Infrastructure (OCI) policy statements in Terraform configurations.

## Features

- Scans Terraform files for OCI policy statements
- Validates policy statement syntax
- Supports both single file and directory scanning
- Provides detailed error messages for invalid policies

## Usage

```yaml
- uses: policy-validation-action@v1
  with:
    path: './path/to/policies'  # Directory containing .tf files or path to single .tf file
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `path` | Path to policy file or directory | No | `.` |

## Outputs

| Name | Description |
|------|-------------|
| `allow_segments` | List of validated allow statements found in policies |

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
        uses: policy-validation-action@v1
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

## License

This project is licensed under the Universal Permissive License (UPL) v1.0 - see the [LICENSE](LICENSE) file for details.
