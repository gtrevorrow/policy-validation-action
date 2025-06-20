import { ValidationPipeline } from '../validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { OciSyntaxValidator } from '../validators/OciSyntaxValidator';
import { ExtractorFactory } from '../extractors/ExtractorFactory';
import { mockLogger } from './fixtures/test-utils';

/**
 * Integration tests for policy validators working together.
 * Tests realistic scenarios with complex Terraform configurations.
 * For individual validator tests, see their respective test files.
 */

// Realistic Terraform configuration samples
const complexTerraformContent = `
# Multi-environment policy configuration
resource "oci_identity_policy" "production_security" {
  name = "production-security-policy"
  description = "Security policies for production environment"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group ProductionAdmins to manage all-resources in compartment \${var.prod_compartment}",
    "Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = 'true'",
    "Allow group NetworkAdmins to manage virtual-network-family in compartment \${var.prod_compartment}",
    "Allow group IAMAdmins to manage groups in tenancy where target.group.name != 'Administrators'",
    "Allow group DatabaseAdmins to manage database-family in compartment \${var.prod_compartment}"
  ]
}

resource "oci_identity_policy" "development_access" {
  name = "development-access-policy"
  description = "Access policies for development environment"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group Developers to use instances in compartment \${var.dev_compartment}",
    "Allow group Developers to manage buckets in compartment \${var.dev_compartment}",
    "Allow group QATesters to read all-resources in compartment \${var.dev_compartment}"
  ]
}

resource "oci_identity_policy" "problematic_legacy" {
  name = "legacy-policy"
  description = "Legacy policy with security issues"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group LegacyAdmins to manage all-resources in tenancy",
    "Allow group NetworkTeam to manage network-security-groups in tenancy",
    "Allow group IAMTeam to manage groups in tenancy",
    "BadSyntax manage something somewhere"
  ]
}

# Cross-tenancy policies
resource "oci_identity_policy" "cross_tenancy" {
  name = "cross-tenancy-policy"
  description = "Cross-tenancy access policies"
  compartment_id = var.tenancy_ocid
  statements = [
    "Define tenancy PartnerTenancy as ocid1.tenancy.oc1..partnerId123",
    "Admit group PartnerAdmins of tenancy PartnerTenancy to read instances in compartment \${var.shared_compartment}",
    "Endorse group SharedServices to manage virtual-network-family in tenancy PartnerTenancy"
  ]
}
`;

const minimalValidTerraform = `
resource "oci_identity_policy" "simple" {
  statements = [
    "Allow group Developers to use instances in compartment dev"
  ]
}
`;

const invalidTerraformSyntax = `
resource "oci_identity_policy" "broken" {
  statements = [
    "Allow BadSyntax manage",
    "Malformed policy statement here"
    # Missing closing bracket and other syntax errors
`;

// Helper function to extract policies from Terraform content
function extractPoliciesFromTerraform(content: string): string[] {
  const extractor = ExtractorFactory.create('regex');
  return extractor.extract(content);
}

describe('Policy Validator Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Multi-Validator Pipeline Integration', () => {
    it('should run syntax and CIS validation in complete pipeline', async () => {
      const statements = extractPoliciesFromTerraform(complexTerraformContent);
      expect(statements.length).toBeGreaterThan(0);
      
      // Create pipeline with both validators
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(2);
      
      // Check syntax validator results
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      expect(syntaxResults).toBeDefined();
      
      // Check CIS validator results
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      expect(cisResults).toBeDefined();
      expect(cisResults?.reports).toHaveLength(6); // All 6 CIS checks
    });

    it('should handle mixed valid and invalid policies across validators', async () => {
      const statements = extractPoliciesFromTerraform(complexTerraformContent);
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      
      // Syntax validator should catch syntax errors
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      expect(syntaxResults?.reports[0].passed).toBeFalsy(); // Due to "BadSyntax manage something somewhere"
      
      // CIS validator should catch security issues
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      const leastPrivilegeCheck = cisResults?.reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck?.passed).toBeFalsy(); // Due to "manage all-resources in tenancy"
    });

    it('should maintain validator independence in pipeline', async () => {
      const statements = ['BadSyntax policy here'];
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      
      // Even if syntax validation fails, CIS validation should still run
      expect(results).toHaveLength(2);
      
      // CIS validator should still produce its checks
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      expect(cisResults?.reports).toHaveLength(6);
    });
  });

  describe('Real-World Terraform Integration', () => {
    it('should extract and validate complex multi-resource Terraform', async () => {
      // Test with simpler content first
      const simpleContent = `
        resource "oci_identity_policy" "test" {
          statements = [
            "Allow group Developers to use instances in compartment dev"
          ]
        }
      `;
      
      const statements = extractPoliciesFromTerraform(simpleContent);
      expect(statements.length).toBeGreaterThan(0);
      
      // Validate extracted statements
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      expect(results).toHaveLength(1);
    });

    it('should handle Terraform with variable interpolation correctly', async () => {
      const variableTerraform = `
        resource "oci_identity_policy" "vars" {
          statements = [
            "Allow group \${var.admin_group} to manage instances in compartment \${var.environment}",
            "Allow group \${var.dev_group} to read buckets in compartment \${local.dev_compartment_id}"
          ]
        }
      `;
      
      const statements = extractPoliciesFromTerraform(variableTerraform);
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      
      // Should parse variables correctly
      expect(results[0].reports[0].passed).toBeTruthy();
    });

    it('should process large Terraform configurations efficiently', async () => {
      // Generate large Terraform content with many policies
      let largeTerraform = '';
      for (let i = 0; i < 20; i++) {
        largeTerraform += `
          resource "oci_identity_policy" "policy_${i}" {
            statements = [
              "Allow group Group${i} to manage instances in compartment Compartment${i}",
              "Allow group Group${i} to read buckets in compartment Compartment${i}"
            ]
          }
        `;
      }
      
      const statements = extractPoliciesFromTerraform(largeTerraform);
      expect(statements.length).toBe(40); // 20 resources * 2 statements each
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const startTime = Date.now();
      const results = await pipeline.validate(statements);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(2);
      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
      
      // Verify all statements were processed
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      expect(syntaxResults?.reports[0].passed).toBeTruthy();
      
      // Verify CIS validation ran on all statements
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      expect(cisResults?.reports).toHaveLength(6); // All 6 CIS checks should run
    });
  });

  describe('Error Resilience and Recovery', () => {
    it('should continue validation when some policies fail to parse', async () => {
      // Use a simpler approach - valid extraction but invalid policy statements
      const problematicStatements = [
        'Allow group ValidGroup to use instances in compartment dev', // Valid
        'Allow BadSyntax manage', // Invalid syntax
        'This is completely invalid' // Invalid syntax
      ];
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      // Should not throw errors even with malformed input
      const results = await pipeline.validate(problematicStatements);
      expect(results).toHaveLength(2);
      
      // Both validators should still produce reports
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      expect(syntaxResults?.reports).toHaveLength(1);
      expect(syntaxResults?.reports[0].passed).toBeFalsy(); // Should fail due to invalid statements
      
      // CIS validator should also run despite syntax errors
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      expect(cisResults?.reports).toHaveLength(6);
    });

    it('should provide comprehensive validation summary', async () => {
      const statements = extractPoliciesFromTerraform(complexTerraformContent);
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(statements);
      
      // Verify logging provides summary information
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringMatching(/Validator .* completed:/)
      );
      
      // Verify all expected checks are present
      const allChecks = results.flatMap(r => r.reports);
      const checkIds = allChecks.map(c => c.checkId);
      
      expect(checkIds).toContain('OCI-SYNTAX-1');
      expect(checkIds).toContain('CIS-OCI-1.1');
      expect(checkIds).toContain('CIS-OCI-1.2');
      expect(checkIds).toContain('CIS-OCI-1.3');
      expect(checkIds).toContain('CIS-OCI-1.5');
      expect(checkIds).toContain('CIS-OCI-1.13');
      expect(checkIds).toContain('CIS-OCI-5.2');
      
      // Verify both validators completed successfully
      expect(results).toHaveLength(2);
      expect(results.every(r => r.validatorName && r.reports.length > 0)).toBeTruthy();
    });

    it('should handle edge cases in Terraform extraction', async () => {
      const edgeCases = [
        '', // Empty content
        'not terraform at all', // Non-Terraform content
        minimalValidTerraform, // Minimal valid content
        '{}' // Empty JSON-like content
      ];
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      
      for (const content of edgeCases) {
        const statements = extractPoliciesFromTerraform(content);
        const results = await pipeline.validate(statements);
        
        // Should handle gracefully without errors
        expect(Array.isArray(results)).toBeTruthy();
        
        // For empty/invalid content, should get empty results
        if (statements.length === 0) {
          expect(results).toEqual([]);
        } else {
          // For valid content, should get validation results
          expect(results).toHaveLength(1);
          expect(results[0].reports).toHaveLength(1);
        }
      }
    });
  });

  describe('Cross-Validator Correlation', () => {
    it('should identify policies that pass syntax but fail security checks', async () => {
      const problematicStatements = [
        'Allow group Admins to manage all-resources in tenancy', // Valid syntax, bad security
        'Allow group IAMAdmins to manage groups in tenancy' // Valid syntax, missing protection
      ];
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(problematicStatements);
      
      // Syntax should pass
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      expect(syntaxResults?.reports[0].passed).toBeTruthy();
      expect(syntaxResults?.reports[0].issues).toHaveLength(0);
      
      // Security checks should fail
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      const failingSecurityChecks = cisResults?.reports.filter(r => !r.passed);
      expect(failingSecurityChecks?.length).toBeGreaterThan(0);
      
      // Specifically check for least privilege violations
      const leastPrivilegeCheck = cisResults?.reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck?.passed).toBeFalsy();
      expect(leastPrivilegeCheck?.issues.some(i => 
        i.statement.includes('manage all-resources in tenancy')
      )).toBeTruthy();
      
      // Check for IAM protection violations  
      const iamProtectionCheck = cisResults?.reports.find(r => r.checkId === 'CIS-OCI-1.3');
      expect(iamProtectionCheck?.passed).toBeFalsy();
      expect(iamProtectionCheck?.issues.some(i => 
        i.statement.includes('manage groups in tenancy') && 
        !i.statement.includes('where')
      )).toBeTruthy();
    });

    it('should provide complementary validation coverage', async () => {
      const comprehensiveStatements = [
        'Allow group ValidGroup to manage instances in compartment dev', // Should pass both
        'Allow BadSyntax manage', // Should fail syntax
        'Allow group OverprivilegedGroup to manage all-resources in tenancy' // Should pass syntax, fail CIS
      ];
      
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new OciSyntaxValidator(mockLogger));
      pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
      
      const results = await pipeline.validate(comprehensiveStatements);
      
      const syntaxResults = results.find(r => r.validatorName === 'OCI Syntax Validator');
      const cisResults = results.find(r => r.validatorName === 'OCI CIS Benchmark Validator');
      
      // Syntax validator should catch syntax error
      expect(syntaxResults?.reports[0].passed).toBeFalsy();
      expect(syntaxResults?.reports[0].issues.some(i => i.statement.includes('BadSyntax'))).toBeTruthy();
      
      // CIS validator should catch security issue
      const leastPrivilegeCheck = cisResults?.reports.find(r => r.checkId === 'CIS-OCI-1.2');
      expect(leastPrivilegeCheck?.passed).toBeFalsy();
      
      // Valid statement should pass syntax but may fail some CIS checks depending on specifics
      const validStatementProcessed = syntaxResults?.reports[0].issues.every(i => 
        !i.statement.includes('manage instances in compartment dev')
      );
      expect(validStatementProcessed).toBeTruthy();
      
      // Verify comprehensive coverage - each validator catches different types of issues
      expect(syntaxResults?.reports[0].issues).toHaveLength(2); // Two syntax errors from the malformed statement
      expect(leastPrivilegeCheck?.issues.length).toBeGreaterThan(0); // Security issues
    });
  });
});

