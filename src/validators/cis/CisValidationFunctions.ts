import { ValidationOptions, ValidationReport, ValidationIssue } from '../../types';
import { CisListenerResults } from '../OciCisListener';
import { calculateValidationStatus, shouldPass } from '../PolicyValidator';

/**
 * Creates a ValidationReport for a given CIS check.
 */
function createReport(checkId: string, name: string, description: string, issues: ValidationIssue[], options: ValidationOptions): ValidationReport {
  const status = calculateValidationStatus(issues);
  const passed = shouldPass(status, options.treatWarningsAsFailures ?? false);
  return { checkId, name, description, passed, status, issues };
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
    'CIS-OCI-1.1',
    'Service-Level Admins',
    'Ensure service level admins are created to manage resources of particular service',
    issues,
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
    'CIS-OCI-1.2',
    'Tenancy Administrator Group Restriction',
    'Ensure permissions on all resources are given only to the tenancy administrator group',
    issues,
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
    'CIS-OCI-1.3',
    'Admin Group Restrictions',
    'Ensure IAM administrators cannot update tenancy Administrators group',
    issues,
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
    'CIS-OCI-1.5',
    'Compartment-level Admins',
    'Ensure compartment level admins are used to manage resources in compartments',
    issues,
    options
  );
}
