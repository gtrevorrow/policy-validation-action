import { OciSyntaxValidator } from '../validators/OciSyntaxValidator';
import { Logger } from '../types';

// Sample policy statements for testing
const validPolicies = [
  'Allow group Administrators to manage all-resources in tenancy',
  'Allow group Developers to use instances in compartment dev',
  'Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa',
  'Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo',
  'Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy',
  'Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups in (\'SecurityAdmins\')'
];

const invalidPolicies = [
  'Allow Administrators_without_group to manage all-resources in tenancy', // Missing 'group' keyword
  'Alloww group Developers to use instances in compartment dev', // Misspelled 'Allow'
  'Allow group to manage all-resources in', // Missing target/scope
  'Define tenancy', // Incomplete definition
  'Allow group Administrators too manage all-resources in tenancy' // 'too' instead of 'to'
];

// Mock logger for testing
const testLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('OciSyntaxValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should validate well-formed policy statements without errors', async () => {
    const validator = new OciSyntaxValidator(testLogger);
    const reports = await validator.validate(validPolicies);
    
    // Should have one syntax check
    expect(reports).toHaveLength(1);
    
    // Check should pass
    expect(reports[0].passed).toBeTruthy();
    expect(reports[0].issues).toHaveLength(0);
  });
  
  test('should detect invalid policy statements with specific error messages', async () => {
    const validator = new OciSyntaxValidator(testLogger);
    const reports = await validator.validate(invalidPolicies);
    
    // Should have one syntax check
    expect(reports).toHaveLength(1);
    
    // Check should fail
    expect(reports[0].passed).toBeFalsy();
    
    // Should have errors for each invalid policy
    expect(reports[0].issues.length).toBeGreaterThan(0);
    
    // Verify error messages contain useful info
    reports[0].issues.forEach(issue => {
      // Check that message contains either "Syntax error" or "Failed to parse"
      const messageContainsSyntaxError = issue.message.includes('Syntax error');
      const messageContainsFailedToParse = issue.message.includes('Failed to parse');
      expect(messageContainsSyntaxError || messageContainsFailedToParse).toBeTruthy();
      
      expect(issue.severity).toBe('error');
      expect(issue.recommendation).toBeDefined();
    });
    
    // Verify logging format maintained the original style
    expect(testLogger.error).toHaveBeenCalledWith('Failed to parse policy statement:');
    expect(testLogger.error).toHaveBeenCalledWith(expect.stringMatching(/Statement: ".*"/));
    expect(testLogger.error).toHaveBeenCalledWith(expect.stringMatching(/Position: .*\^.*/));
  });
  
  test('should handle empty statement list', async () => {
    const validator = new OciSyntaxValidator(testLogger);
    const reports = await validator.validate([]);
    
    // Should return empty array for no statements
    expect(reports).toEqual([]);
    expect(testLogger.info).toHaveBeenCalledWith('No policy statements to validate');
  });
  
  test('should handle empty or whitespace-only statements', async () => {
    const validator = new OciSyntaxValidator(testLogger);
    const reports = await validator.validate(['', '   ', '\n\t']);
    
    // Should ignore empty statements and pass
    expect(reports).toHaveLength(1);
    expect(reports[0].passed).toBeTruthy();
  });
  
  test('should handle mix of valid and invalid statements', async () => {
    const validator = new OciSyntaxValidator(testLogger);
    const mixedPolicies = [...validPolicies.slice(0, 2), ...invalidPolicies.slice(0, 2)];
    const reports = await validator.validate(mixedPolicies);
    
    // Should have one syntax check
    expect(reports).toHaveLength(1);
    
    // Check should fail due to invalid policies
    expect(reports[0].passed).toBeFalsy();
    
    // Should have issues only for invalid statements (2 in this case)
    expect(reports[0].issues.length).toBeGreaterThan(0);
    expect(reports[0].issues.length).toBeLessThan(mixedPolicies.length);
  });
  
  test('should return validator metadata correctly', () => {
    const validator = new OciSyntaxValidator();
    
    expect(validator.name()).toBe('OCI Syntax Validator');
    expect(validator.description()).toContain('syntactical correctness');
    
    const checks = validator.getChecks();
    expect(checks).toHaveLength(1);
    expect(checks[0].id).toBe('OCI-SYNTAX-1');
  });
});