# OCI IAM Policy Knowledge Base for Agentic Validation

This document provides the ground truth for validating OCI IAM policies against CIS benchmarks. Use these rules and examples to analyze the provided policies.

## OCI IAM Policy Structure

OCI IAM policies are composed of statements that define permissions. There are four main types of statements:

### 1. `Allow` Statements
This is the most common statement type. It grants a subject (like a group) permission to perform actions on resources within a specific location (like a compartment or the entire tenancy).

**Basic Structure:**
`Allow <subject> to <verb> <resource-type> in <location> [where <conditions>]`

-   **Subject**: Who is getting the permission (e.g., `group Administrators`, `dynamic-group InstancePrincipals`).
-   **Verb**: The action allowed (`inspect`, `read`, `use`, `manage`).
-   **Resource-Type**: The type of resource the action applies to (e.g., `all-resources`, `instance-family`, `virtual-network-family`).
-   **Location**: The scope of the permission (`in tenancy`, `in compartment <name>`).
-   **Conditions**: Optional `where` clauses that restrict the permission further (e.g., `where target.group.name != 'Administrators'`).

### 2. `Endorse` Statements
This statement allows a subject in your tenancy to perform actions on resources in a *different* tenancy. It requires a corresponding `Admit` statement in the other tenancy.

**Basic Structure:**
`Endorse <subject> to <verb> <resource-type> in tenancy <other_tenancy_name>`

### 3. `Admit` Statements
This statement works with `Endorse` to grant access to subjects from another tenancy. It "admits" an endorsed group from a specified tenancy to perform actions in your tenancy.

**Basic Structure:**
`Admit <subject> of tenancy <other_tenancy_name> to <verb> <resource-type> in <location>`

### 4. `Define` Statements
This statement creates an alias for a tenancy or compartment OCID, making policies easier to read and manage.

**Basic Structure:**
`Define tenancy <alias> as <ocid>`
`Define compartment <alias> as <ocid>`

---

## Key CIS OCI Foundations Benchmark v2.0 Rules

### 1.1 Service-Level Admins
-   **Objective**: Ensure that administrative duties are delegated to service-specific admin groups rather than using a single, all-powerful group.
-   **What to Look For**: Check if policies exist that grant `manage` permissions on specific service resource families (e.g., `instance-family`, `database-family`, `virtual-network-family`, `object-family`). The absence of such policies for critical services is a finding.
-   **Compliant Example**:
    -   `Allow group NetworkAdmins to manage virtual-network-family in tenancy`
-   **Non-Compliant Finding**:
    -   A lack of policies granting `manage` permissions to service-specific groups for `compute`, `database`, `storage`, or `network` services. This is an informational finding, not a failure.

### 1.2 Tenancy Administrator Group Restriction
-   **Objective**: To ensure that only the designated `Administrators` group has full management rights over the entire tenancy.
-   **What to Look For**: Any policy that grants `manage all-resources in tenancy` to a group *other than* `Administrators`.
-   **Compliant Example**:
    -   `Allow group Administrators to manage all-resources in tenancy`
-   **Non-Compliant Examples**:
    -   `Allow group SuperAdmins to manage all-resources in tenancy` (This is a clear violation).
    -   `Allow group ${var.admin_group_name} to manage all-resources in tenancy` (This is a potential violation. Flag as a 'warning').

### 1.3 Admin Group Restrictions
-   **Objective**: To prevent any group, including other IAM admins, from modifying the membership or permissions of the `Administrators` group.
-   **What to Look For**: Any policy granting `manage groups` or `manage users` that does *not* explicitly exclude the `Administrators` group in a `where` clause.
-   **Compliant Example**:
    -   `Allow group IAMAdmins to manage groups in tenancy where target.group.name != 'Administrators'`
-   **Non-Compliant Example**:
    -   `Allow group IAMAdmins to manage groups in tenancy` (This is a violation because it could be used to modify the `Administrators` group).

### 1.5 Compartment-level Admins
-   **Objective**: To ensure that administrative duties are delegated to compartment-level administrators, following the principle of least privilege.
-   **What to Look For**: The existence of policies that grant `manage all-resources` permissions scoped to a specific compartment. The absence of such policies is an informational finding.
-   **Compliant Example**:
    -   `Allow group AppDevAdmins to manage all-resources in compartment AppDevCompartment`
-   **Non-Compliant Finding**:
    -   A lack of policies creating compartment-specific administrators. This is an informational finding, not a failure.

---

## Handling HCL Variables

When you encounter a policy with an HCL variable (e.g., `${var.group_name}`), follow these steps:
1.  **Infer Intent**: Analyze the variable's name (`admin_group`, `dev_compartment`) to understand its likely purpose.
2.  **Assess Worst-Case Scenario**: If a variable name is generic (e.g., `${var.group}`), assume it could resolve to a value that would violate a rule. For example, a generic group variable in a high-privilege policy should be flagged.
3.  **Flag for Review**: Policies with variables that could lead to a violation should be marked as `passed: false` with a `severity: 'warning'`. The reason should clearly state that the policy requires manual verification.
