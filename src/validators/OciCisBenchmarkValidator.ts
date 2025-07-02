import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import { Logger } from '../types';
import { 
  PolicyValidator, 
  ValidationCheck, 
  ValidationReport, 
  ValidationOptions
} from './PolicyValidator';
import PolicyLexer from '../generated/PolicyLexer';
import PolicyParser from '../generated/PolicyParser';
import { OciCisListener, CisListenerResults } from './OciCisListener';
import {
  validateServiceLevelAdmins,
  validateTenancyAdminRestriction,
  validateAdminGroupRestrictions,
  validateCompartmentLevelAdmins,
  validateMfaEnforcement,
  validateNsgRestrictions
} from './cis/CisValidationFunctions';

/**
 * Validates OCI policies against CIS Benchmark v2 controls
 */
export class OciCisBenchmarkValidator implements PolicyValidator {
  private logger?: Logger;
  
  private cisChecks: ValidationCheck[] = [
    {
      id: 'CIS-OCI-1.1',
      name: 'Service-Level Admins',
      description: 'Ensure service level admins are created to manage resources of particular service'
    },
    {
      id: 'CIS-OCI-1.2',
      name: 'Tenancy Administrator Group Restriction',
      description: 'Ensure permissions on all resources are given only to the tenancy administrator group'
    },
    {
      id: 'CIS-OCI-1.3',
      name: 'Admin Group Restrictions',
      description: 'Ensure IAM administrators cannot update tenancy Administrators group'
    },
    {
      id: 'CIS-OCI-1.5',
      name: 'Compartment-level Admins',
      description: 'Ensure compartment level admins are used to manage resources in compartments'
    },
    {
      id: 'CIS-OCI-1.13',
      name: 'MFA Enforcement',
      description: 'Ensure multi-factor authentication is enforced for all users with console access'
    },
    {
      id: 'CIS-OCI-5.2',
      name: 'Network Security Groups',
      description: 'Ensure security lists/NSGs are properly configured to restrict access'
    }
  ];
  
  constructor(logger?: Logger) {
    this.logger = logger;
  }
  
  name(): string {
    return 'OCI CIS Benchmark Validator';
  }
  
  description(): string {
    return 'Validates OCI IAM policies against CIS Benchmark v2.0 controls';
  }
  
  getChecks(): ValidationCheck[] {
    return this.cisChecks;
  }
  
  async validate(statements: string[], options: ValidationOptions = {}): Promise<ValidationReport[]> {
    this.logger?.debug(`Validating ${statements.length} policy statements against OCI CIS Benchmark`);
    
    if (statements.length === 0) {
      this.logger?.info('No policy statements to validate');
      return [];
    }
    
    try {
      // Parse statements and collect findings
      const results = this.analyzePolicy(statements);
      
      // Generate validation reports for each CIS check
      const reports: ValidationReport[] = [
        validateServiceLevelAdmins(results, options),
        validateTenancyAdminRestriction(statements, results, options),
        validateAdminGroupRestrictions(statements, results, options),
        validateCompartmentLevelAdmins(results, options),
        validateMfaEnforcement(statements, results, options),
        validateNsgRestrictions(statements, results, options)
      ];
      
      return reports;
      
    } catch (error) {
      this.logger?.error(`Error validating policies: ${error}`);
      
      // Return an error report
      return [{
        checkId: 'CIS-OCI-ERROR',
        name: 'Validation Error',
        description: 'An error occurred during validation',
        passed: false,
        status: 'fail',
        issues: [{
          checkId: 'CIS-OCI-ERROR',
          statement: '',
          message: `Validation error: ${error}`,
          recommendation: 'Check policy syntax and try again',
          severity: 'error'
        }]
      }];
    }
  }
  
  /**
   * Analyzes policies using ANTLR parser and listener
   */
  private analyzePolicy(statements: string[]): CisListenerResults {
    const listener = new OciCisListener(statements, this.logger);
    const walker = new ParseTreeWalker();
    
    // Process each statement through ANTLR parser
    for (const statement of statements) {
      try {
        const trimmedStatement = statement.trim();
        if (!trimmedStatement) continue;
        
        const inputStream = CharStreams.fromString(trimmedStatement);
        const lexer = new PolicyLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new PolicyParser(tokenStream);
        
        // Use error handling strategy
        parser.removeErrorListeners();
        parser.addErrorListener({
          syntaxError: (recognizer: any, offendingSymbol: any, line: number, column: number, msg: string) => {
            this.logger?.debug(`Parser warning (${line}:${column}): ${msg} in statement: "${trimmedStatement}"`);
            this.logger?.debug(`Skipping statement due to parsing error: ${statement}`);
          }
        });
        
        // Parse and walk the tree
        const tree = parser.policy();
        walker.walk(listener, tree);
      } catch (error) {
        this.logger?.debug(`Skipping statement due to parsing error: ${statement}`);
        this.logger?.debug(`Error: ${error}`);
      }
    }
    
    // Get the analysis results
    return listener.getResults();
  }
}

