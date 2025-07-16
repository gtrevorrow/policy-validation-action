import { ValidationCheck, ValidationIssue, ValidationReport, shouldPassWithValidatorConfig } from '../PolicyValidator';
import { CisListenerResults } from '../OciCisListener';
import { ValidationOptions } from '../../types';

/**
 * Creates a ValidationReport for a given CIS check.
 */
export function createReport(
  check: ValidationCheck,
  issues: ValidationIssue[],
  validatorName: string,
  options: ValidationOptions = {}
): ValidationReport {
  const { passed, status, issues: updatedIssues } = shouldPassWithValidatorConfig(
    issues,
    validatorName,
    options
  );

  return {
    checkId: check.id,
    name: check.name,
    description: check.description,
    passed,
    status,
    issues: updatedIssues,
  };
}

/**
 * CIS-OCI-1.1: Validates that service-level admin policies exist for critical services.
 */
export function validateServiceLevelAdmins(results: CisListenerResults, options: ValidationOptions): ValidationReport {
  const criticalServices = ['compute', 'database', 'storage', 'network'];
  const missingServices = criticalServices.filter(service => !results.foundServiceAdminServices.has(service));

  const issues: ValidationIssue[] = missingServices.length > 0 ? [{
    checkId: 'CIS-OCI-1.1',
    statement: '',
    message: `Missing service-specific admin policies for: ${missingServices.join(', ')}`,
    recommendation: 'Create service-specific admin groups with targeted permissions for critical services.',
    severity: 'warning'
  }] : [];

  return createReport(
    {
      id: 'CIS-OCI-1.1',
      name: 'Service-Level Admins',
      description: 'Ensure service level admins are created to manage resources of particular service'
    },
    issues,
    'validateServiceLevelAdmins',
    options
  );
}

/**
 * CIS-OCI-1.2: Validates that only the 'Administrators' group has tenancy-wide manage permissions.
 */
export function validateTenancyAdminRestriction(statements: string[], results: CisListenerResults, options: ValidationOptions): ValidationReport {
  const issues: ValidationIssue[] = [];
  const policiesWithVars = new Set(results.policiesWithHclVariablesInGroup);

  // Handle policies with HCL variables in the group name
  results.overlyPermissivePolicies.forEach(policy => {
    if (policiesWithVars.has(policy)) {
      issues.push({
        checkId: 'CIS-OCI-1.2',
        statement: policy,
        message: 'Policy uses an HCL variable for the group name, which cannot be statically verified.',
        recommendation: 'Manually verify that the group resolved from the variable is the intended tenancy administrator group.',
        severity: 'warning'
      });
    } else if (!/allow\s+group\s+administrators\s+to\s+manage/i.test(policy)) {
      // Handle definite violations (not using 'Administrators' group and no variable)
      issues.push({
        checkId: 'CIS-OCI-1.2',
        statement: policy,
        message: 'Only the "Administrators" group should have tenancy-level "manage all-resources" permissions.',
        recommendation: 'Change to "Allow group Administrators to manage all-resources in tenancy" or restrict to a non-root compartment.',
        severity: 'error'
      });
    }
  });

  return createReport(
    {
      id: 'CIS-OCI-1.2',
      name: 'Tenancy Administrator Group Restriction',
      description: 'Ensure permissions on all resources are given only to the tenancy administrator group'
    },
    issues,
    'validateTenancyAdminRestriction',
    options
  );
}

/**
 * CIS-OCI-1.3: Validates that IAM admin policies protect the 'Administrators' group.
 */
export function validateAdminGroupRestrictions(statements: string[], results: CisListenerResults, options: ValidationOptions): ValidationReport {
  const iamAdminPolicies = statements.filter(p => {
    const lower = p.toLowerCase();
    return lower.includes('manage') && (lower.includes('manage groups') || lower.includes('manage users'));
  });

  const unprotectedAdminPolicies = iamAdminPolicies.filter(p => !results.adminRestrictionPolicies.includes(p));

  const issues: ValidationIssue[] = unprotectedAdminPolicies.map(policy => ({
    checkId: 'CIS-OCI-1.3',
    statement: policy,
    message: 'IAM management policy does not restrict modification of the "Administrators" group.',
    recommendation: 'Add a "where target.group.name != \'Administrators\'" clause to the policy.',
    severity: 'error'
  }));

  return createReport(
    {
      id: 'CIS-OCI-1.3',
      name: 'Admin Group Restrictions',
      description: 'Ensure IAM administrators cannot update tenancy Administrators group'
    },
    issues,
    'validateAdminGroupRestrictions',
    options
  );
}

/**
 * CIS-OCI-1.5: Validates that compartment-level admin policies exist.
 */
export function validateCompartmentLevelAdmins(results: CisListenerResults, options: ValidationOptions): ValidationReport {
  const issues: ValidationIssue[] = results.compartmentAdminPolicies.length === 0 ? [{
    checkId: 'CIS-OCI-1.5',
    statement: '',
    message: 'No compartment-specific admin policies were found.',
    recommendation: 'Create admin policies scoped to specific compartments for delegation of duties.',
    severity: 'info'
  }] : [];

  return createReport(
    {
      id: 'CIS-OCI-1.5',
      name: 'Compartment-level Admins',
      description: 'Ensure compartment level admins are used to manage resources in compartments'
    },
    issues,
    'validateCompartmentLevelAdmins',
    options
  );
} 

