import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import { Logger,ValidationOptions } from '../types';
import { 
  StatementFilteringValidator, 
  ValidationCheck, 
  ValidationReport,
  hasHclVariables,
  calculateValidationStatus,
  shouldPassWithValidatorConfig,
  applyValidatorWarningConfig
} from './PolicyValidator';
import PolicyLexer from '../generated/PolicyLexer';
import PolicyParser from '../generated/PolicyParser';
import { OciCisListener, CisListenerResults } from './OciCisListener';
import {
  validateServiceLevelAdmins,
  validateTenancyAdminRestriction,
  validateAdminGroupRestrictions,
  validateCompartmentLevelAdmins,
} from './cis/CisValidationFunctions';

/**
 * Validates OCI policies against CIS Benchmark v2 controls
 * Only processes statements without HCL variables for accurate parsing
 */
export class OciCisBenchmarkValidator implements StatementFilteringValidator {
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
  
  /**
   * Determines if this validator can handle the given statement
   * Only processes statements without HCL variables for accurate parsing
   */
  canHandle(statement: string): boolean {
    return !hasHclVariables(statement);
  }
  
  public async validate(
    statements: string[],
    options: ValidationOptions = {},
  ): Promise<ValidationReport[]> {
    // Filter to only statements this validator can handle
    const applicableStatements = statements.filter(s => s && this.canHandle(s));

    if (applicableStatements.length === 0) {
      this.logger?.debug('OciCisBenchmarkValidator: No static statements to validate');
      return []; // Nothing for this validator to do.
    }
    
    this.logger?.debug(`Validating ${applicableStatements.length} static policy statements against OCI CIS Benchmark`);
    
    try {
      // Use the ANTLR listener to analyze all applicable statements and gather findings.
      const results = this.analyzePolicy(applicableStatements);
      
      let reports: ValidationReport[] = [
        validateServiceLevelAdmins(results, options),
        validateTenancyAdminRestriction(applicableStatements, results, options),
        validateAdminGroupRestrictions(applicableStatements, results, options),
        validateCompartmentLevelAdmins(results, options),
      ];
      
      // Apply validator-specific warning configuration
      reports = reports.map(report => {
        const adjustedIssues = applyValidatorWarningConfig(report.issues, this.name(), options);
        const adjustedStatus = calculateValidationStatus(adjustedIssues);
        const { passed } = shouldPassWithValidatorConfig(adjustedIssues, this.name(), options);
        
        return {
          ...report,
          issues: adjustedIssues,
          status: adjustedStatus,
          passed: passed
        };
      });
      
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


