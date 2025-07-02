import PolicyListener from '../generated/PolicyListener';
import { Logger } from '../types';

export interface CisListenerResults {
  foundServiceAdminServices: Set<string>;
  adminRestrictionPolicies: string[];
  mfaPolicies: string[];
  restrictNsgPolicies: string[];
  compartmentAdminPolicies: string[];
  overlyPermissivePolicies: string[];
  policiesWithHclVariablesInGroup: string[];
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
  private foundServiceAdminServices = new Set<string>();
  private adminRestrictionPolicies: string[] = [];
  private mfaPolicies: string[] = [];
  private restrictNsgPolicies: string[] = [];
  private compartmentAdminPolicies: string[] = [];
  private overlyPermissivePolicies: string[] = [];
  private policiesWithHclVariablesInGroup: string[] = [];
  
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
    // CIS-OCI-1.2 analysis is performed in exitResource() method
  }
  
  exitResource(ctx: any): void {
    const resource = ctx?.getText()?.toLowerCase();
    
    // Check for network security group specific policies
    if (resource && resource.includes('network-security-groups')) {
      this.restrictNsgPolicies.push(this.currentStatement);
    }
    
    // Check for overly permissive policies (manage all-resources in tenancy)
    if (resource && resource.includes('all-resources') && 
        this.currentStatement.toLowerCase().includes('manage') &&
        this.currentStatement.toLowerCase().includes('in tenancy')) {
      this.overlyPermissivePolicies.push(this.currentStatement);
    }
    
    // Check for specific service-related admin policies (only for manage operations)
    if (resource && this.currentStatement.toLowerCase().includes('manage')) {
      this.getServiceFromResource(resource).forEach(service => {
        this.foundServiceAdminServices.add(service);
      });
    }
  }
  
  exitCondition(ctx: any): void {
    const condition = ctx?.getText()?.toLowerCase();
    
    // Check for MFA condition
    if (condition && condition.includes('request.user.mfachallenged')) {
      this.mfaPolicies.push(this.currentStatement);
    }
    
    // Check for admin restriction conditions (policies that protect admin groups)
    if (condition && condition.includes('target.group.name') && condition.includes('administrators')) {
      this.adminRestrictionPolicies.push(this.currentStatement);
    }
  }

  exitScope(ctx: any): void {
    const scope = ctx?.getText()?.toLowerCase();
    
    // Check for compartment-level admin policies (should manage all-resources in compartment)
    if (scope && scope.includes('compartment') && 
        this.currentStatement.toLowerCase().includes('manage all-resources')) {
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
  exitGroupName(ctx: any): void {
    const groupName = ctx?.getText();
    if (groupName && groupName.includes('${')) {
      this.logger?.debug(`Found HCL variable in group name for statement: ${this.currentStatement}`);
      this.policiesWithHclVariablesInGroup.push(this.currentStatement);
    }
  }
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
   * Extracts key service names from a resource string.
   */
  private getServiceFromResource(resource: string): string[] {
    const services: string[] = [];
    const criticalServices: Record<string, string[]> = {
      compute: ['compute', 'instance'],
      database: ['database', 'autonomous-database'],
      storage: ['storage', 'object', 'volume', 'file-system'],
      network: ['network', 'virtual-network', 'load-balancer', 'dns']
    };

    for (const [service, keywords] of Object.entries(criticalServices)) {
      if (keywords.some(keyword => resource.includes(keyword))) {
        services.push(service);
      }
    }
    return services;
  }

  /**
   * Get all collected results
   */
  getResults(): CisListenerResults {
    return {
      foundServiceAdminServices: this.foundServiceAdminServices,
      adminRestrictionPolicies: this.adminRestrictionPolicies,
      mfaPolicies: this.mfaPolicies,
      restrictNsgPolicies: this.restrictNsgPolicies,
      compartmentAdminPolicies: this.compartmentAdminPolicies,
      overlyPermissivePolicies: this.overlyPermissivePolicies,
      policiesWithHclVariablesInGroup: this.policiesWithHclVariablesInGroup
    };
  }
}
