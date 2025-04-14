import { OciCisBenchmarkValidator } from '../../src/validators/OciCisBenchmarkValidator';
import { Logger } from '../../src/types';

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
    
    // All checks should pass
    reports.forEach(report => {
      expect(report.passed).toBeTruthy();
    });
    
    // Should have all 6 CIS checks
    expect(reports).toHaveLength(6);
  });
  
  test('should identify poorly-configured policies', async () => {
    const validator = new OciCisBenchmarkValidator(testLogger);
    const reports = await validator.validate(badPolicies);
    
    // Some checks should fail
    reports.forEach(report => {
      if (report.checkId === 'CIS-OCI-1.1' || report.checkId === 'CIS-OCI-1.2' || report.checkId === 'CIS-OCI-1.3' || report.checkId === 'CIS-OCI-1.13' || report.checkId === 'CIS-OCI-5.2') {
        expect(report.passed).toBeFalsy();
      } else {
        expect(report.passed).toBeTruthy();
      }
    });
    
    // Should have all 6 CIS checks
    expect(reports).toHaveLength(6);
  });
});