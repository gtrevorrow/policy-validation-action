import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { ValidationReport, ValidationOptions } from '../validators/PolicyValidator';

/**
 * Unit tests for OciCisBenchmarkValidator.
 * These tests focus on the high-level validation logic and report generation for each CIS check.
 * For detailed ANTLR parsing tests, see OciCisListener.test.ts
 */
describe('OciCisBenchmarkValidator', () => {
  let validator: OciCisBenchmarkValidator;

  beforeEach(() => {
    // Mock logger to suppress console output during tests
    const mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    validator = new OciCisBenchmarkValidator(mockLogger);
  });

  describe('Validator Metadata', () => {
    it('should return correct validator metadata', () => {
      expect(validator.name()).toBe('OCI CIS Benchmark Validator');
      expect(validator.description()).toContain('CIS Benchmark v2.0');
    });

    it('should provide detailed check descriptions', () => {
      const checks = validator.getChecks();
      expect(checks.length).toBeGreaterThan(0);
      expect(checks.every(c => c.id && c.name && c.description)).toBeTruthy();
      expect(checks.find(c => c.id === 'CIS-OCI-1.1')).toBeDefined();
    });
  });

  describe('CIS-OCI-1.1: Service-Specific Administrators', () => {
    it('should pass when service-specific admin policies are present', async () => {
      const statements = [
        'Allow group NetworkAdmins to manage virtual-network-family in tenancy',
        'Allow group StorageAdmins to manage object-family in tenancy',
        'Allow group DatabaseAdmins to manage database-family in tenancy',
        'Allow group ComputeAdmins to manage instance-family in tenancy'
      ];
      const reports = await validator.validate(statements);
      const serviceAdminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.1');
      
      expect(serviceAdminCheck).toBeDefined();
      expect(serviceAdminCheck?.passed).toBeTruthy();
      expect(serviceAdminCheck?.status).toBe('pass');
    });

    it('should provide guidance when no service-specific policies found', async () => {
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const reports = await validator.validate(statements);
      const serviceAdminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.1');
      
      expect(serviceAdminCheck).toBeDefined();
      expect(serviceAdminCheck?.status).toBe('pass-with-warnings');
      expect(serviceAdminCheck?.issues).toHaveLength(1);
      expect(serviceAdminCheck?.issues[0].message).toContain('Missing service-specific admin policies');
    });
  });

  describe('CIS-OCI-1.2: Least Privilege Principle', () => {
    it('should fail for overly permissive tenancy-level policies', async () => {
      const statements = ['Allow group BadAdmins to manage all-resources in tenancy'];
      const reports = await validator.validate(statements);
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      
      expect(leastPrivilegeCheck).toBeDefined();
      expect(leastPrivilegeCheck?.passed).toBeFalsy();
      expect(leastPrivilegeCheck?.status).toBe('fail');
    });

    it('should pass for compartment-scoped admin policies', async () => {
      const statements = ['Allow group GoodAdmins to manage all-resources in compartment AppDev'];
      const reports = await validator.validate(statements);
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      
      expect(leastPrivilegeCheck).toBeDefined();
      expect(leastPrivilegeCheck?.passed).toBeTruthy();
      expect(leastPrivilegeCheck?.status).toBe('pass');
    });

    it('should provide specific recommendations for violations', async () => {
      const statements = ['Allow group BadAdmins to manage all-resources in tenancy'];
      const reports = await validator.validate(statements);
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      
      expect(leastPrivilegeCheck?.issues[0].recommendation).toContain('non-root compartment');
    });
  });

  describe('CIS-OCI-1.3: Administrators Group Protection', () => {
    it('should fail when IAM policies lack administrator group protection', async () => {
      const statements = ['Allow group IAMAdmins to manage groups in tenancy'];
      const reports = await validator.validate(statements);
      const adminProtectionCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      
      expect(adminProtectionCheck).toBeDefined();
      expect(adminProtectionCheck?.passed).toBeFalsy();
      expect(adminProtectionCheck?.status).toBe('fail');
    });

    it('should pass when IAM policies include administrator protection', async () => {
      const statements = [
        'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\''
      ];
      const reports = await validator.validate(statements);
      const adminProtectionCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      
      expect(adminProtectionCheck).toBeDefined();
      expect(adminProtectionCheck?.passed).toBeTruthy();
      expect(adminProtectionCheck?.status).toBe('pass');
    });

    it('should provide specific protection recommendations', async () => {
      const statements = ['Allow group IAMAdmins to manage groups in tenancy'];
      const reports = await validator.validate(statements);
      const adminProtectionCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      
      expect(adminProtectionCheck?.issues[0].recommendation).toContain('target.group.name !=');
    });
  });

  describe('CIS-OCI-1.5: Compartment Administrator Restrictions', () => {
    it('should pass when admin policies are compartment-scoped', async () => {
      const statements = ['Allow group AppAdmins to manage all-resources in compartment AppCompartment'];
      const reports = await validator.validate(statements);
      const compartmentAdminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.5');
      
      expect(compartmentAdminCheck).toBeDefined();
      expect(compartmentAdminCheck?.passed).toBeTruthy();
      expect(compartmentAdminCheck?.status).toBe('pass');
    });

    it('should provide guidance for compartment-based access control', async () => {
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const reports = await validator.validate(statements);
      const compartmentAdminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.5');
      
      expect(compartmentAdminCheck).toBeDefined();
      expect(compartmentAdminCheck?.status).toBe('pass'); // This check is informational
      expect(compartmentAdminCheck?.issues[0].severity).toBe('info');
      expect(compartmentAdminCheck?.issues[0].message).toContain('No compartment-specific admin policies');
    });
  });

  describe('CIS-OCI-1.13: MFA Requirements', () => {
    it('should fail when security policies lack MFA requirements', async () => {
      const statements = ['Allow group SecurityAdmins to manage vault-family in tenancy'];
      const options: ValidationOptions = { treatWarningsAsFailures: true };
      const reports = await validator.validate(statements, options);
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      
      expect(mfaCheck).toBeDefined();
      expect(mfaCheck?.passed).toBeFalsy();
      expect(mfaCheck?.status).toBe('pass-with-warnings');
    });

    it('should pass when security policies include MFA requirements', async () => {
      const statements = [
        'Allow group SecurityAdmins to manage vault-family in tenancy where request.user.mfachallenged = \'true\''
      ];
      const reports = await validator.validate(statements);
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      
      expect(mfaCheck).toBeDefined();
      expect(mfaCheck?.passed).toBeTruthy();
      expect(mfaCheck?.status).toBe('pass');
    });

    it('should identify different types of security-sensitive operations', async () => {
      const statements = [
        'Allow group KeyManagers to manage keys in tenancy',
        'Allow group CertManagers to manage certificates in tenancy'
      ];
      const reports = await validator.validate(statements);
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      
      expect(mfaCheck?.issues).toHaveLength(2);
    });
  });

  describe('CIS-OCI-5.2: Network Security Group Conditions', () => {
    it('should fail when NSG policies lack proper conditions', async () => {
      const statements = ['Allow group NetworkAdmins to manage network-security-group in tenancy'];
      const options: ValidationOptions = { treatWarningsAsFailures: true };
      const reports = await validator.validate(statements, options);
      const nsgCheck = reports.find(r => r.checkId === 'CIS-OCI-5.2');
      
      expect(nsgCheck).toBeDefined();
      expect(nsgCheck?.passed).toBeFalsy();
      expect(nsgCheck?.status).toBe('pass-with-warnings');
    });

    it('should pass when NSG policies include proper conditions', async () => {
      const statements = [
        'Allow group NetworkAdmins to manage network-security-group in tenancy where target.compartment.id = \'some-ocid\''
      ];
      const reports = await validator.validate(statements);
      const nsgCheck = reports.find(r => r.checkId === 'CIS-OCI-5.2');
      
      expect(nsgCheck).toBeDefined();
      expect(nsgCheck?.passed).toBeTruthy();
      expect(nsgCheck?.status).toBe('pass');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty policy list gracefully', async () => {
      const reports = await validator.validate([]);
      expect(reports).toEqual([]);
    });

    it('should handle invalid policy syntax gracefully', async () => {
      const statements = ['This is not a valid policy'];
      const reports = await validator.validate(statements);
      // Should not throw an error, and individual checks should run on the empty set of parsed policies
      expect(reports.length).toBeGreaterThan(0);
    });

    it('should handle mixed valid and invalid policies', async () => {
      const statements = [
        'Allow group Admins to manage all-resources in tenancy', // Valid but fails CIS checks
        'This is not a valid policy'
      ];
      const reports = await validator.validate(statements);
      expect(reports.length).toBeGreaterThan(0);
      const serviceAdminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.1');
      expect(serviceAdminCheck?.status).toBe('pass-with-warnings');
    });

    it('should provide consistent report structure across all checks', async () => {
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const reports = await validator.validate(statements);
      
      expect(reports.length).toBe(validator.getChecks().length);
      reports.forEach((report: ValidationReport) => {
        expect(report).toHaveProperty('checkId');
        expect(report).toHaveProperty('name');
        expect(report).toHaveProperty('description');
        expect(report).toHaveProperty('passed');
        expect(report).toHaveProperty('status');
        expect(report).toHaveProperty('issues');
      });
    });

    it('should handle large policy sets efficiently', async () => {
      const statements = Array(500).fill('Allow group TestGroup to use instances in tenancy');
      const startTime = Date.now();
      await validator.validate(statements);
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});

    

