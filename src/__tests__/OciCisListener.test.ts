import { OciCisListener } from '../validators/OciCisListener';
import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import PolicyLexer from '../generated/PolicyLexer';
import PolicyParser from '../generated/PolicyParser';

describe('OciCisListener', () => {
  test('should identify service admin policies', () => {
    const statements = [
      'Allow group NetworkAdmins to manage virtual-network-family in tenancy',
      'Allow group StorageAdmins to manage object-family in tenancy'
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.serviceAdminPolicies).toHaveLength(2);
    expect(results.serviceAdminPolicies.some(p => p.includes('NetworkAdmins'))).toBeTruthy();
  });
  
  test('should identify overly permissive policies', () => {
    const statements = [
      'Allow group Admins to manage all-resources in tenancy',
      'Allow group NetworkAdmins to manage network-family in tenancy'
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.overlyPermissivePolicies).toHaveLength(1);
    expect(results.overlyPermissivePolicies[0]).toContain('all-resources');
  });
  
  test('should identify admin restriction policies', () => {
    const statements = [
      'Allow group IAMAdmins to manage groups in tenancy',
      'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\''
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.adminRestrictionPolicies).toHaveLength(1);
    expect(results.adminRestrictionPolicies[0]).toContain('target.group.name');
  });
  
  test('should identify MFA policies', () => {
    const statements = [
      'Allow group SecurityAdmins to manage security-family in tenancy',
      'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\''
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.mfaPolicies).toHaveLength(1);
    expect(results.mfaPolicies[0]).toContain('mfachallenged');
  });
  
  test('should identify network security group policies', () => {
    const statements = [
      'Allow group NetworkAdmins to manage network-security-groups in tenancy',
      'Allow group NetworkAdmins to manage network-security-groups in tenancy where request.networkSecurityGroups.contains(\'securityGroup1\')'
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.restrictNsgPolicies).toHaveLength(2);
    expect(results.restrictNsgPolicies.some(p => p.includes('network-security-groups'))).toBeTruthy();
  });
  
  test('should identify compartment-specific admin policies', () => {
    const statements = [
      'Allow group ProjectAdmins to manage all-resources in compartment ProjectA',
      'Allow group Admins to manage all-resources in tenancy'
    ];
    
    const listener = new OciCisListener(statements);
    processStatements(statements, listener);
    
    const results = listener.getResults();
    expect(results.compartmentAdminPolicies).toHaveLength(1);
    expect(results.compartmentAdminPolicies[0]).toContain('compartment');
  });
});

// Helper function to process statements with the listener
function processStatements(statements: string[], listener: OciCisListener) {
  const walker = new ParseTreeWalker();
  
  for (const statement of statements) {
    const inputStream = CharStreams.fromString(statement.trim());
    const lexer = new PolicyLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new PolicyParser(tokenStream);
    
    parser.removeErrorListeners();
    const tree = parser.policy();
    walker.walk(listener, tree);
  }
}
