import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { Logger } from '../types';

// Sample policy statements for testing
const goodPolicies = [
  'Allow group NetworkAdmins to manage virtual-network-family in tenancy',
  'Allow group DBAdmins to manage database-family in tenancy',
  'Allow group ComputeAdmins to manage instance-family in tenancy',
  'Allow group StorageAdmins to manage object-family in tenancy',
  'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\'',
  'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\'',
  'Allow group CompartmentAdmins to manage all-resources in compartment ProjectA',
  'Allow group NetworkAdmins to manage network-security-groups in compartment ProjectA where request.networkSecurityGroups.contains(\'securityGroup1\')'
];

const badPolicies = [
  'Allow group Admins to manage all-resources in tenancy',
  'Allow group IAMAdmins to manage groups in tenancy',
  'Allow group SecurityAdmins to manage security-family in tenancy',
  'Allow group NetworkAdmins to manage network-security-groups in tenancy'
];

// Mock logger for testing
const testLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('OciCisBenchmarkValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should identify well-configured policies', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(goodPolicies);
    
    // Should have all 6 CIS checks
    expect(reports).toHaveLength(6);
    
    // Check that specific reports pass
    const serviceAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.1');
    const leastPrivilegeReport = reports.find(r => r.checkId === 'CIS-OCI-1.2');
    const adminRestrictionReport = reports.find(r => r.checkId === 'CIS-OCI-1.3');
    const compartmentAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.5');
    const mfaReport = reports.find(r => r.checkId === 'CIS-OCI-1.13');
    const nsgReport = reports.find(r => r.checkId === 'CIS-OCI-5.2');
    
    // We know these should pass with our test data
    expect(leastPrivilegeReport?.passed).toBeTruthy();
    expect(adminRestrictionReport?.passed).toBeTruthy();
    expect(compartmentAdminReport?.passed).toBeTruthy();
    expect(mfaReport?.passed).toBeTruthy();
    expect(nsgReport?.passed).toBeTruthy();
    
    // Service admin check might not pass as our test data may not cover all critical services
    // but we still want to make sure it exists
    expect(serviceAdminReport).toBeDefined();
  });
  
  test('should report issues with overly permissive policies', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(badPolicies);
    
    // Find least privilege check
    const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
    expect(leastPrivilegeCheck).toBeDefined();
    expect(leastPrivilegeCheck?.passed).toBeFalsy();
    expect(leastPrivilegeCheck?.issues).toHaveLength(1);
    expect(leastPrivilegeCheck?.issues[0].statement).toContain('manage all-resources');
  });
  
  test('should report missing MFA requirements', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(badPolicies);
    
    // Find MFA check
    const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
    expect(mfaCheck).toBeDefined();
    expect(mfaCheck?.passed).toBeFalsy();
    expect(mfaCheck?.issues).toHaveLength(1);
    expect(mfaCheck?.issues[0].recommendation).toContain('mfachallenged');
  });
  
  test('should report missing administrators group protection', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(badPolicies);
    
    // Find admin restriction check
    const adminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
    expect(adminCheck).toBeDefined();
    expect(adminCheck?.passed).toBeFalsy();
    expect(adminCheck?.issues).toHaveLength(1);
    expect(adminCheck?.issues[0].recommendation).toContain('target.group.name');
  });
  
  test('should report missing network security group conditions', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(badPolicies);
    
    // Find NSG check
    const nsgCheck = reports.find(r => r.checkId === 'CIS-OCI-5.2');
    expect(nsgCheck).toBeDefined();
    expect(nsgCheck?.passed).toBeFalsy();
    expect(nsgCheck?.issues).toHaveLength(1);
  });
  
  test('should handle empty policy list', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate([]);
    
    expect(reports).toEqual([]);
    expect(testLogger.info).toHaveBeenCalledWith('No policy statements to validate');
  });
  
  test('should handle invalid policy syntax', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(['This is not a valid policy']);
    
    // Should still run and produce reports instead of failing
    expect(reports.length).toBeGreaterThan(0);
    
    // Logger should record debug messages about parsing issues
    expect(testLogger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Skipping statement due to parsing error')
    );
  });
  
  test('should return validator metadata correctly', () => {
    const validator = new OciCisBenchmarkValidator();
    
    expect(validator.name()).toBe('OCI CIS Benchmark Validator');
    expect(validator.description()).toContain('CIS Benchmark');
    
    const checks = validator.getChecks();
    expect(checks).toHaveLength(6);
    expect(checks.map(c => c.id)).toContain('CIS-OCI-1.1');
    expect(checks.map(c => c.id)).toContain('CIS-OCI-1.2');
    expect(checks.map(c => c.id)).toContain('CIS-OCI-1.3');
    expect(checks.map(c => c.id)).toContain('CIS-OCI-1.5');
    expect(checks.map(c => c.id)).toContain('CIS-OCI-1.13');
    expect(checks.map(c => c.id)).toContain('CIS-OCI-5.2');
  });
});
