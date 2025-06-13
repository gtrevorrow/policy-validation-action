import { ValidationPipeline } from '../validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { Logger } from '../types';
import { mockLogger } from './fixtures/test-utils';

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

// Extract statements from Terraform content
function extractPolicyStatements(content: string): string[] {
  const statementsRegex = /statements\s*=\s*\[\s*((?:[^[\]]*?(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\${(?:[^{}]|{[^{}]*})*})?)*)]/gs;
  const matches = Array.from(content.matchAll(statementsRegex));
  
  if (!matches || matches.length === 0) {
    return [];
  }
  
  const allStatements: string[] = [];
  
  for (const match of matches) {
    if (match[1]) {
      // Extract individual statements by splitting on commas, respecting quotes
      const statementBlock = match[1];
      let inQuote = false;
      let quoteChar = '';
      let current = '';
      
      for (let i = 0; i < statementBlock.length; i++) {
        const char = statementBlock[i];
        
        if ((char === '"' || char === "'") && (i === 0 || statementBlock[i-1] !== '\\')) {
          if (!inQuote) {
            inQuote = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuote = false;
          }
        }
        
        if (char === ',' && !inQuote) {
          // End of statement
          const trimmedStatement = current.trim();
          if (trimmedStatement) {
            // Remove surrounding quotes
            const statement = trimmedStatement.replace(/^["']|["']$/g, '');
            allStatements.push(statement);
          }
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last statement
      if (current.trim()) {
        const statement = current.trim().replace(/^["']|["']$/g, '');
        allStatements.push(statement);
      }
    }
  }
  
  return allStatements;
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
    const pipeline = new ValidationPipeline(mockLogger);
    pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
    
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
  
  test('should handle full validation pipeline flow', async () => {
    const statements = extractPolicyStatements(sampleTerraformContent);
    
    // Create validation pipeline
    const pipeline = new ValidationPipeline(mockLogger);
    pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
    
    // Run validation
    const results = await pipeline.validate(statements);
    
    // Check logging of results summary
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/Validator .* completed:/)
    );
    
    // Verify we got reports for all expected checks
    const reports = results[0].reports;
    const checkIds = reports.map(r => r.checkId);
    
    expect(checkIds).toContain('CIS-OCI-1.1');
    expect(checkIds).toContain('CIS-OCI-1.2');
    expect(checkIds).toContain('CIS-OCI-1.3');
    expect(checkIds).toContain('CIS-OCI-1.5');
    expect(checkIds).toContain('CIS-OCI-1.13');
    expect(checkIds).toContain('CIS-OCI-5.2');
  });
});
