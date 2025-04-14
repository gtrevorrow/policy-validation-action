import { CharStreams, CommonTokenStream, ParseTreeWalker } from 'antlr4';
import { Logger } from '../types';
import { PolicyValidator, ValidationCheck, ValidationReport, ValidationIssue } from './PolicyValidator';
import PolicyLexer from '../generated/PolicyLexer';
import PolicyParser from '../generated/PolicyParser';
import { OciCisListener } from './OciCisListener';

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
      name: 'Least Privilege',
      description: 'Ensure permissions on all resources are given only to the groups that need them'
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
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    this.logger?.debug(`Validating ${statements.length} policy statements against OCI CIS Benchmark`);
    
    if (statements.length === 0) {
      this.logger?.info('No policy statements to validate');
      return [];
    }
    
    try {
      // Parse statements and collect findings
      const results = this.analyzePolicy(statements);
      
      // Generate validation reports for each CIS check
      const reports: ValidationReport[] = [];
      
      // CIS-OCI-1.1: Service-level admins
      const criticalServices = ['compute', 'database', 'storage', 'network'];
      const foundServiceAdmins = new Set<string>();
      
      // Check if we have admin policies for each critical service
      results.serviceAdminPolicies.forEach((policy: string) => {
        criticalServices.forEach(service => {
          if (policy.toLowerCase().includes(service)) {
            foundServiceAdmins.add(service);
          }
        });
      });
      
      const missingServices = criticalServices.filter(service => !foundServiceAdmins.has(service));
      const serviceAdminsPassed = missingServices.length === 0;
      
      reports.push({
        checkId: 'CIS-OCI-1.1',
        name: 'Service-Level Admins',
        description: 'Ensure service level admins are created to manage resources of particular service',
        passed: serviceAdminsPassed,
        issues: serviceAdminsPassed ? [] : [{
          checkId: 'CIS-OCI-1.1',
          statement: '',
          message: `Missing service-specific admin policies for: ${missingServices.join(', ')}`,
          recommendation: 'Create service-specific admin groups with targeted permissions',
          severity: 'warning'
        }]
      });
      
      // CIS-OCI-1.2: Least privilege
      const leastPrivilegePassed = results.overlyPermissivePolicies.length === 0;
      
      reports.push({
        checkId: 'CIS-OCI-1.2',
        name: 'Least Privilege',
        description: 'Ensure permissions on all resources are given only to the groups that need them',
        passed: leastPrivilegePassed,
        issues: results.overlyPermissivePolicies.map((policy: string) => ({
          checkId: 'CIS-OCI-1.2',
          statement: policy,
          message: 'Overly permissive policy grants "manage all-resources" without conditions',
          recommendation: 'Restrict permissions using specific resource types and add conditions',
          severity: 'error'
        }))
      });
      
      // CIS-OCI-1.3: Admin group restrictions
      const adminPolicies = statements.filter(policy => 
        policy.toLowerCase().includes('manage') && 
        policy.toLowerCase().includes('group'));
      
      const adminRestrictionsMissing = adminPolicies.length > 0 && 
        results.adminRestrictionPolicies.length === 0;
      
      reports.push({
        checkId: 'CIS-OCI-1.3',
        name: 'Admin Group Restrictions',
        description: 'Ensure IAM administrators cannot update tenancy Administrators group',
        passed: !adminRestrictionsMissing,
        issues: adminRestrictionsMissing ? [{
          checkId: 'CIS-OCI-1.3',
          statement: adminPolicies[0],
          message: 'Group management policies do not restrict access to Administrators group',
          recommendation: 'Add "where target.group.name != \'Administrators\'" to group management policies',
          severity: 'error'
        }] : []
      });
      
      // CIS-OCI-1.5: Compartment-level admins
      const compartmentAdminsPassed = results.compartmentAdminPolicies.length > 0;
      
      reports.push({
        checkId: 'CIS-OCI-1.5',
        name: 'Compartment-level Admins',
        description: 'Ensure compartment level admins are used to manage resources in compartments',
        passed: compartmentAdminsPassed,
        issues: compartmentAdminsPassed ? [] : [{
          checkId: 'CIS-OCI-1.5',
          statement: '',
          message: 'No compartment-specific admin policies found',
          recommendation: 'Create policies with "in compartment" scope specification for delegation',
          severity: 'info'
        }]
      });
      
      // CIS-OCI-1.13: MFA enforcement
      const securityPolicies = statements.filter(policy => 
        (policy.toLowerCase().includes('security') || 
         policy.toLowerCase().includes('iam')) && 
        policy.toLowerCase().includes('manage'));
      
      const mfaMissing = securityPolicies.length > 0 && results.mfaPolicies.length === 0;
      
      reports.push({
        checkId: 'CIS-OCI-1.13',
        name: 'MFA Enforcement',
        description: 'Ensure multi-factor authentication is enforced for all users with console access',
        passed: !mfaMissing,
        issues: mfaMissing ? [{
          checkId: 'CIS-OCI-1.13',
          statement: securityPolicies[0] || '',
          message: 'Security-related policies do not enforce MFA',
          recommendation: 'Add "where request.user.mfachallenged == \'true\'" to security policies',
          severity: 'warning'
        }] : []
      });
      
      // CIS-OCI-5.2: Network Security Groups
      const nsgPolicies = statements.filter(policy => 
        policy.toLowerCase().includes('network-security-group'));
      
      const nsgRestrictionsMissing = nsgPolicies.length > 0 && 
        !nsgPolicies.some(policy => policy.toLowerCase().includes('where'));
      
      reports.push({
        checkId: 'CIS-OCI-5.2',
        name: 'Network Security Groups',
        description: 'Ensure security lists/NSGs are properly configured to restrict access',
        passed: !nsgRestrictionsMissing,
        issues: nsgRestrictionsMissing ? [{
          checkId: 'CIS-OCI-5.2',
          statement: nsgPolicies[0] || '',
          message: 'Network security group policies lack proper restrictions',
          recommendation: 'Add conditions to limit access to specific network resources',
          severity: 'warning'
        }] : []
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
  private analyzePolicy(statements: string[]): any {
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
