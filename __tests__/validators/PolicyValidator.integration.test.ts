import { ValidationPipeline } from '../../src/validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from '../../src/validators/OciCisBenchmarkValidator';
import { Logger } from '../../src/types';

// Sample TF file content
const sampleTerraformContent = `
resource "oci_identity_policy" "good_policy" {
  name = "good-policy"
  description = "Good policy with proper restrictions"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group NetworkAdmins to manage virtual-network-family in tenancy",
    "Allow group DBAdmins to manage database-family in tenancy",
    "Allow group ComputeAdmins to manage instance-family in tenancy",
    "Allow group StorageAdmins to manage object-family in tenancy",
    "Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = 'true'",
    "Allow group IAMAdmins to manage groups in tenancy where target.group.name != 'Administrators'",
    "Allow group CompartmentAdmins to manage all-resources in compartment ProjectA"
  ]
}

resource "oci_identity_policy" "bad_policy" {
  name = "bad-policy"
  description = "Policy with security issues"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group Admins to manage all-resources in tenancy",
    "Allow group IAMAdmins to manage groups in tenancy",
    "Allow group NetworkAdmins to manage network-security-groups in tenancy"
  ]
}
`;

// Mock logger for testing
const testLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Extract statements from Terraform content
function extractPolicyStatements(content: string): string[] {
  // ...existing code...
}

describe('Policy Validator Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should validate policy statements from Terraform files', async () => {
    // Extract statements from the Terraform content
    const statements = extractPolicyStatements(sampleTerraformContent);
    expect(statements.length).toBeGreaterThan(0);
    
    // Create validation pipeline with OCI CIS validator
    const pipeline = new ValidationPipeline(testLogger);
    pipeline.addValidator(new OciCisBenchmarkValidator(testLogger));
    
    // Run validation
    const results = await pipeline.validate(statements);
    
    // Check that validation ran
    expect(results).toHaveLength(1);
    expect(results[0].validatorName).toBe('OCI CIS Benchmark Validator');
    
    // Check for expected issues
    const failingChecks = results[0].reports.filter(r => !r.passed);
    
    // Should find at least one failing check (we have issues in bad_policy)
    expect(failingChecks.length).toBeGreaterThan(0);
    
    // Check specific issues
    const leastPrivilegeCheck = results[0].reports.find(r => r.checkId === 'CIS-OCI-1.2');
    expect(leastPrivilegeCheck).toBeDefined();
    expect(leastPrivilegeCheck?.passed).toBeFalsy();
    expect(leastPrivilegeCheck?.issues.some(i => 
      i.statement.includes('manage all-resources') && 
      !i.statement.includes('compartment')
    )).toBeTruthy();
  });
  
  // ...existing code...
});