import { CharStreams, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4';
import { Logger } from '../types';
import { PolicyValidator, ValidationCheck, ValidationReport, ValidationIssue } from './PolicyValidator';
import PolicyLexer from '../generated/PolicyLexer';
import PolicyParser from '../generated/PolicyParser';

/**
 * Validates OCI policy statements for syntactical correctness according to OCI IAM policy grammar
 */
export class OciSyntaxValidator implements PolicyValidator {
  private logger?: Logger;
  private static readonly CHECK_ID = 'OCI-SYNTAX-1';

  private syntaxChecks: ValidationCheck[] = [
    {
      id: OciSyntaxValidator.CHECK_ID,
      name: 'OCI Policy Syntax',
      description: 'Ensures OCI IAM policy statements follow the correct syntax'
    }
  ];
  
  constructor(logger?: Logger) {
    this.logger = logger;
  }

  /**
   * Private helper to log messages with validator name prefix
   */
  private log = {
    debug: (message: string) => this.logger?.debug(`${this.name()}: ${message}`),
    info: (message: string) => this.logger?.info(`${this.name()}: ${message}`),
    warn: (message: string) => this.logger?.warn(`${this.name()}: ${message}`),
    error: (message: string) => this.logger?.error(`${this.name()}: ${message}`)
  };
  
  name(): string {
    return 'OCI Syntax Validator';
  }
  
  description(): string {
    return 'Validates OCI IAM policy statements for syntactical correctness';
  }
  
  getChecks(): ValidationCheck[] {
    return this.syntaxChecks;
  }
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    this.log.debug(`Validating ${statements.length} policy statements for syntax correctness`);
    
    if (statements.length === 0) {
      this.log.info(`No policy statements to validate`);
      return [];
    }
    
    const issues: ValidationIssue[] = [];
    
    for (const statement of statements) {
      if (!statement || typeof statement !== 'string') continue;
      const trimmedStatement = statement.trim();
      if (!trimmedStatement) continue;
      
      try {
        const inputStream = CharStreams.fromString(trimmedStatement);
        const lexer = new PolicyLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new PolicyParser(tokenStream);
        
        // Use error handling strategy
        parser.removeErrorListeners();
        parser.addErrorListener({
          syntaxError: (
            recognizer: Recognizer<Token>,
            offendingSymbol: Token | undefined,
            line: number,
            charPositionInLine: number,
            msg: string,
            e: RecognitionException | undefined
          ): void => {
            // Reproduce the original detailed error logging format
            this.log.error('Failed to parse policy statement:');
            this.log.error(`Statement: "${trimmedStatement}"`);
            this.log.error(`Position: ${' '.repeat(charPositionInLine+2)}^ ${msg}`);
            
            issues.push({
              checkId: OciSyntaxValidator.CHECK_ID,
              statement: trimmedStatement,
              message: `Syntax error at position ${charPositionInLine}: ${msg}`,
              recommendation: 'Review OCI IAM policy syntax documentation and correct the statement',
              severity: 'error'
            });
          }
        });
        
        // Attempt to parse the policy
        parser.policy();
      } catch (error) {
        this.log.debug(`Exception while parsing statement: ${trimmedStatement}`);
        this.log.debug(`Error: ${error}`);
        
        // Log the error in the same format as syntax errors
        this.log.error('Failed to parse policy statement:');
        this.log.error(`Statement: "${trimmedStatement}"`);
        this.log.error(`Position: ^ ${error instanceof Error ? error.message : String(error)}`);
        
        issues.push({
          checkId: OciSyntaxValidator.CHECK_ID,
          statement: trimmedStatement,
          message: `Failed to parse policy: ${error instanceof Error ? error.message : String(error)}`,
          recommendation: 'Review OCI IAM policy syntax documentation and correct the statement',
          severity: 'error'
        });
      }
    }
    
    // Create validation report
    const report: ValidationReport = {
      checkId: OciSyntaxValidator.CHECK_ID,
      name: 'OCI Policy Syntax',
      description: 'Ensures OCI IAM policy statements follow the correct syntax',
      passed: issues.length === 0,
      issues: issues
    };
    
    return [report];
  }
}