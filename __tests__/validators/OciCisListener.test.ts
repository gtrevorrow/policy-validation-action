import { OciCisListener } from '../../src/validators/OciCisListener';
import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import PolicyLexer from '../../src/generated/PolicyLexer';
import PolicyParser from '../../src/generated/PolicyParser';

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
  
  // ...existing code...
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