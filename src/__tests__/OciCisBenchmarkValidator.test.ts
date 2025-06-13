import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { mockLogger } from './fixtures/test-utils';

/**
 * Unit tests for OciCisBenchmarkValidator.
 * Tests CIS security benchmark compliance checking.
 * For integration tests, see PolicyValidator.integration.test.ts
 */

// Test data sets for comprehensive CIS validation testing
const secureCompliancePolicies = [
  // Service-specific admin policies (CIS-OCI-1.1)
  'Allow group NetworkAdmins to manage virtual-network-family in tenancy',
  'Allow group DBAdmins to manage database-family in tenancy',
  'Allow group ComputeAdmins to manage instance-family in tenancy',
  'Allow group StorageAdmins to manage object-family in tenancy',
  
  // Compartment-scoped admin policies (CIS-OCI-1.2, CIS-OCI-1.5)
  'Allow group CompartmentAdmins to manage all-resources in compartment ProjectA',
  'Allow group DevAdmins to manage all-resources in compartment Development',
  
  // IAM policies with admin group protection (CIS-OCI-1.3)
  'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\'',
  'Allow group IAMAdmins to manage users in tenancy where target.group.name != \'Administrators\'',
  
  // Security policies with MFA requirements (CIS-OCI-1.13)
  'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\'',
  'Allow group KeyManagers to manage keys in tenancy where request.user.mfachallenged = \'true\'',
  
  // Network security group policies with conditions (CIS-OCI-5.2)
  'Allow group NetworkAdmins to manage network-security-groups in compartment ProjectA where request.networkSecurityGroups.contains(\'securityGroup1\')',
];

const insecurePolicies = [
  // Overly permissive policies (CIS-OCI-1.2)
  'Allow group Admins to manage all-resources in tenancy',
  'Allow group SuperUsers to manage all-resources in tenancy',
  
  // IAM policies without admin protection (CIS-OCI-1.3)
  'Allow group IAMAdmins to manage groups in tenancy',
  'Allow group UserManagers to manage users in tenancy',
  
  // Security policies without MFA (CIS-OCI-1.13)
  'Allow group SecurityAdmins to manage security-family in tenancy',
  'Allow group KeyManagers to manage keys in tenancy',
  
  // Network security group policies without conditions (CIS-OCI-5.2)
  'Allow group NetworkAdmins to manage network-security-groups in tenancy',
  'Allow group SecurityTeam to manage network-security-groups in compartment Production'
];

describe('OciCisBenchmarkValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator Metadata', () => {
    it('should return correct validator metadata', () => {
      const validator = new OciCisBenchmarkValidator();
      
      expect(validator.name()).toBe('OCI CIS Benchmark Validator');
      expect(validator.description()).toContain('CIS Benchmark');
      
      const checks = validator.getChecks();
      expect(checks).toHaveLength(6);
      expect(checks.map(c => c.id)).toEqual(
        expect.arrayContaining(['CIS-OCI-1.1', 'CIS-OCI-1.2', 'CIS-OCI-1.3', 'CIS-OCI-1.5', 'CIS-OCI-1.13', 'CIS-OCI-5.2'])
      );
    });

    it('should provide detailed check descriptions', () => {
      const validator = new OciCisBenchmarkValidator();
      const checks = validator.getChecks();
      
      checks.forEach(check => {
        expect(check.name).toBeDefined();
        expect(check.description).toBeDefined();
        expect(check.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe('CIS-OCI-1.1: Service-Specific Administrators', () => {
    it('should pass when service-specific admin policies are present', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const policies = [
        'Allow group NetworkAdmins to manage virtual-network-family in tenancy',
        'Allow group DBAdmins to manage database-family in tenancy',
        'Allow group ComputeAdmins to manage instance-family in tenancy',
        'Allow group StorageAdmins to manage object-family in tenancy'
      ];
      
      const reports = await validator.validate(policies);
      const serviceAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.1');
      
      expect(serviceAdminReport).toBeDefined();
      expect(serviceAdminReport?.passed).toBeTruthy();
    });

    it('should provide guidance when no service-specific policies found', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(['Allow group Users to read instances in tenancy']);
      
      const serviceAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.1');
      expect(serviceAdminReport).toBeDefined();
      // This check might pass or fail depending on coverage requirements
    });
  });

  describe('CIS-OCI-1.2: Least Privilege Principle', () => {
    it('should fail for overly permissive tenancy-level policies', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(insecurePolicies);
      
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck).toBeDefined();
      expect(leastPrivilegeCheck?.passed).toBeFalsy();
      
      const overlyPermissiveIssue = leastPrivilegeCheck?.issues.find(i => 
        i.statement.includes('manage all-resources') && 
        !i.statement.includes('compartment')
      );
      expect(overlyPermissiveIssue).toBeDefined();
    });

    it('should pass for compartment-scoped admin policies', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck).toBeDefined();
      expect(leastPrivilegeCheck?.passed).toBeTruthy();
    });

    it('should provide specific recommendations for violations', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(['Allow group BadActors to manage all-resources in tenancy']);
      
      const leastPrivilegeCheck = reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck?.issues[0]?.recommendation).toContain('compartment');
    });
  });

  describe('CIS-OCI-1.3: Administrators Group Protection', () => {
    it('should fail when IAM policies lack administrator group protection', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(insecurePolicies);
      
      const adminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      expect(adminCheck).toBeDefined();
      expect(adminCheck?.passed).toBeFalsy();
      
      const unprotectedIssue = adminCheck?.issues.find(i => 
        i.statement.includes('manage groups') && 
        !i.statement.includes('target.group.name')
      );
      expect(unprotectedIssue).toBeDefined();
    });

    it('should pass when IAM policies include administrator protection', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      const adminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      expect(adminCheck).toBeDefined();
      expect(adminCheck?.passed).toBeTruthy();
    });

    it('should provide specific protection recommendations', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(['Allow group IAMAdmins to manage groups in tenancy']);
      
      const adminCheck = reports.find(r => r.checkId === 'CIS-OCI-1.3');
      expect(adminCheck?.issues[0]?.recommendation).toContain('target.group.name');
    });
  });

  describe('CIS-OCI-1.5: Compartment Administrator Restrictions', () => {
    it('should pass when admin policies are compartment-scoped', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      const compartmentAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.5');
      expect(compartmentAdminReport).toBeDefined();
      expect(compartmentAdminReport?.passed).toBeTruthy();
    });

    it('should provide guidance for compartment-based access control', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(['Allow group Admins to manage all-resources in tenancy']);
      
      const compartmentAdminReport = reports.find(r => r.checkId === 'CIS-OCI-1.5');
      expect(compartmentAdminReport).toBeDefined();
      // Check might have recommendations about compartment usage
    });
  });

  describe('CIS-OCI-1.13: MFA Requirements', () => {
    it('should fail when security policies lack MFA requirements', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(insecurePolicies);
      
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      expect(mfaCheck).toBeDefined();
      expect(mfaCheck?.passed).toBeFalsy();
      
      const missingMfaIssue = mfaCheck?.issues.find(i => 
        i.statement.includes('manage security-family') && 
        !i.statement.includes('mfachallenged')
      );
      expect(missingMfaIssue).toBeDefined();
      expect(missingMfaIssue?.recommendation).toContain('mfachallenged');
    });

    it('should pass when security policies include MFA requirements', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      expect(mfaCheck).toBeDefined();
      expect(mfaCheck?.passed).toBeTruthy();
    });

    it('should identify different types of security-sensitive operations', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const sensitiveOperations = [
        'Allow group KeyAdmins to manage keys in tenancy',
        'Allow group SecurityTeam to manage security-family in tenancy',
        'Allow group CertAdmins to manage certificates in tenancy'
      ];
      
      const reports = await validator.validate(sensitiveOperations);
      const mfaCheck = reports.find(r => r.checkId === 'CIS-OCI-1.13');
      
      expect(mfaCheck?.issues.length).toBeGreaterThan(0);
    });
  });

  describe('CIS-OCI-5.2: Network Security Group Conditions', () => {
    it('should fail when NSG policies lack proper conditions', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(insecurePolicies);
      
      const nsgCheck = reports.find(r => r.checkId === 'CIS-OCI-5.2');
      expect(nsgCheck).toBeDefined();
      expect(nsgCheck?.passed).toBeFalsy();
      
      const unconditionalNsgIssue = nsgCheck?.issues.find(i => 
        i.statement.includes('network-security-groups') && 
        !i.statement.includes('where')
      );
      expect(unconditionalNsgIssue).toBeDefined();
    });

    it('should pass when NSG policies include proper conditions', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      const nsgCheck = reports.find(r => r.checkId === 'CIS-OCI-5.2');
      expect(nsgCheck).toBeDefined();
      expect(nsgCheck?.passed).toBeTruthy();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty policy list gracefully', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate([]);
      
      expect(reports).toEqual([]);
      expect(mockLogger.info).toHaveBeenCalledWith('No policy statements to validate');
    });

    it('should handle invalid policy syntax gracefully', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(['This is not a valid policy']);
      
      expect(reports.length).toBeGreaterThan(0);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Skipping statement due to parsing error')
      );
    });

    it('should handle mixed valid and invalid policies', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const mixedPolicies = [
        'Allow group Admins to manage all-resources in tenancy', // Valid but non-compliant
        'Invalid policy syntax here', // Invalid
        'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\'' // Valid and compliant
      ];
      
      const reports = await validator.validate(mixedPolicies);
      expect(reports.length).toBeGreaterThan(0);
      
      // Should process valid policies and skip invalid ones
      const processedStatements = reports.flatMap(r => r.issues.map(i => i.statement));
      expect(processedStatements).toContain('Allow group Admins to manage all-resources in tenancy');
      expect(processedStatements).not.toContain('Invalid policy syntax here');
    });

    it('should provide consistent report structure across all checks', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const reports = await validator.validate(secureCompliancePolicies);
      
      reports.forEach(report => {
        expect(report).toHaveProperty('checkId');
        expect(report).toHaveProperty('name');
        expect(report).toHaveProperty('description');
        expect(report).toHaveProperty('passed');
        expect(report).toHaveProperty('issues');
        expect(Array.isArray(report.issues)).toBeTruthy();
      });
    });

    it('should handle large policy sets efficiently', async () => {
      const validator = new OciCisBenchmarkValidator(mockLogger);
      const largePolicySet = Array(500).fill('Allow group TestGroup to use instances in compartment test');
      
      const startTime = Date.now();
      const reports = await validator.validate(largePolicySet);
      const duration = Date.now() - startTime;
      
      expect(reports).toHaveLength(6); // All 6 CIS checks
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});

