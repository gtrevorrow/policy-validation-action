import PolicyListener from '../generated/PolicyListener';
import { Logger } from '../types';

export interface CisListenerResults {
  serviceAdminPolicies: string[];
  overlyPermissivePolicies: string[];
  adminRestrictionPolicies: string[];
  mfaPolicies: string[];
  restrictNsgPolicies: string[];
  compartmentAdminPolicies: string[];
}

/**
 * ANTLR listener that validates OCI policy statements against CIS benchmark controls
 */
export class OciCisListener implements PolicyListener {
  private statements: string[];
  private currentStatement: string = '';
  private currentIndex: number = 0;
  private logger?: Logger;

  // Implementing missing methods required by PolicyListener interface
  visitTerminal(node: any): void {}
  visitErrorNode(node: any): void {}
  enterEveryRule(node: any): void {}
  exitEveryRule(node: any): void {}
  
  // Results storage
  private serviceAdminPolicies: string[] = [];
  private overlyPermissivePolicies: string[] = [];
  private adminRestrictionPolicies: string[] = [];
  private mfaPolicies: string[] = [];
  private restrictNsgPolicies: string[] = [];
  private compartmentAdminPolicies: string[] = [];
  
  constructor(statements: string[], logger?: Logger) {
    this.statements = statements;
    this.logger = logger;
  }

  enterPolicy(ctx: any): void {
    if (this.currentIndex < this.statements.length) {
      this.currentStatement = this.statements[this.currentIndex];
      this.currentIndex++;
    }
  }
  
  exitVerb(ctx: any): void {
    const verb = ctx?.getText()?.toLowerCase();
    if (verb === 'manage') {
      this.checkOverlyPermissivePolicies();
    }
  }
  
  exitResource(ctx: any): void {
    const resource = ctx?.getText()?.toLowerCase();
    
    // Check for network security group specific policies
    if (resource && resource.includes('network-security-groups')) {
      this.restrictNsgPolicies.push(this.currentStatement);
    }
    
    // Check for specific service-related admin policies
    if (resource) {
      if (this.isServiceSpecificResource(resource)) {
        this.serviceAdminPolicies.push(this.currentStatement);
      }
    }
  }
  
  exitCondition(ctx: any): void {
    const condition = ctx?.getText()?.toLowerCase();
    
    // Check for MFA condition
    if (condition && condition.includes('request.user.mfachallenged')) {
      this.mfaPolicies.push(this.currentStatement);
    }
    
    // Check for admin restriction condition
    if (condition && (condition.includes('target.group.name!=') || condition.includes('target.group.name !='))) {
      if (condition.includes('administrators')) {
        this.adminRestrictionPolicies.push(this.currentStatement);
      }
    }
  }

  exitScope(ctx: any): void {
    const scope = ctx?.getText()?.toLowerCase();
    
    // Check for compartment-level admin policies
    if (scope && scope.includes('compartment')) {
      this.compartmentAdminPolicies.push(this.currentStatement);
    }
  }
  
  // Implement other required methods from PolicyListener with empty bodies
  exitPolicy(ctx: any): void {}
  enterAllowExpression(ctx: any): void {}
  exitAllowExpression(ctx: any): void {}
  enterEndorseExpression(ctx: any): void {}
  exitEndorseExpression(ctx: any): void {}
  enterDefineExpression(ctx: any): void {}
  exitDefineExpression(ctx: any): void {}
  enterAdmitExpression(ctx: any): void {}
  exitAdmitExpression(ctx: any): void {}
  enterEndorseVerb(ctx: any): void {}
  exitEndorseVerb(ctx: any): void {}
  enterVerb(ctx: any): void {}
  enterPermissionList(ctx: any): void {}
  exitPermissionList(ctx: any): void {}
  enterScope(ctx: any): void {}
  enterEndorseScope(ctx: any): void {}
  exitEndorseScope(ctx: any): void {}
  enterSubject(ctx: any): void {}
  exitSubject(ctx: any): void {}
  enterGroupSubject(ctx: any): void {}
  exitGroupSubject(ctx: any): void {}
  enterResourceSubject(ctx: any): void {}
  exitResourceSubject(ctx: any): void {}
  enterServiceSubject(ctx: any): void {}
  exitServiceSubject(ctx: any): void {}
  enterGroupName(ctx: any): void {}
  exitGroupName(ctx: any): void {}
  enterResourceSubjectId(ctx: any): void {}
  exitResourceSubjectId(ctx: any): void {}
  enterServiceSubjectId(ctx: any): void {}
  exitServiceSubjectId(ctx: any): void {}
  enterGroupID(ctx: any): void {}
  exitGroupID(ctx: any): void {}
  enterDynamicGroupSubject(ctx: any): void {}
  exitDynamicGroupSubject(ctx: any): void {}
  enterTenancySubject(ctx: any): void {}
  exitTenancySubject(ctx: any): void {}
  enterDefinedSubject(ctx: any): void {}
  exitDefinedSubject(ctx: any): void {}
  enterDefined(ctx: any): void {}
  exitDefined(ctx: any): void {}
  enterResource(ctx: any): void {}
  enterCondition(ctx: any): void {}
  enterComparison(ctx: any): void {}
  exitComparison(ctx: any): void {}
  enterVariable(ctx: any): void {}
  exitVariable(ctx: any): void {}
  enterOperator(ctx: any): void {}
  exitOperator(ctx: any): void {}
  enterValue(ctx: any): void {}
  exitValue(ctx: any): void {}
  enterValueList(ctx: any): void {}
  exitValueList(ctx: any): void {}
  enterTimeWindow(ctx: any): void {}
  exitTimeWindow(ctx: any): void {}
  enterComparisonList(ctx: any): void {}
  exitComparisonList(ctx: any): void {}
  enterLogicalCombine(ctx: any): void {}
  exitLogicalCombine(ctx: any): void {}
  enterPatternMatch(ctx: any): void {}
  exitPatternMatch(ctx: any): void {}
  
  /**
   * Checks if the current statement has overly permissive permissions
   */
  private checkOverlyPermissivePolicies(): void {
    const statement = this.currentStatement.toLowerCase();
    
    // Check for overly permissive permissions
    if (statement.includes('manage all-resources') && !statement.includes('where') && !statement.includes('compartment')) {
      this.overlyPermissivePolicies.push(this.currentStatement);
    }
  }
  
  /**
   * Check if the resource is specific to a particular OCI service
   */
  private isServiceSpecificResource(resource: string): boolean {
    const criticalServices = [
      'compute', 'database', 'object', 'storage', 
      'network', 'vcn', 'file-system', 'instances', 
      'autonomous-database', 'vault', 'keys', 'volumes'
    ];
    
    return criticalServices.some(service => resource.includes(service));
  }
  
  /**
   * Get all collected results
   */
  getResults(): CisListenerResults {
    return {
      serviceAdminPolicies: this.serviceAdminPolicies,
      overlyPermissivePolicies: this.overlyPermissivePolicies,
      adminRestrictionPolicies: this.adminRestrictionPolicies,
      mfaPolicies: this.mfaPolicies,
      restrictNsgPolicies: this.restrictNsgPolicies,
      compartmentAdminPolicies: this.compartmentAdminPolicies
    };
  }
}
