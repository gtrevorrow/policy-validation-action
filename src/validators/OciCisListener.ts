import { PolicyListener } from '../generated/PolicyListener';
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
  private currentVerb: string = '';
  private currentScope: string = '';
  private currentResourceHasAllResources: boolean = false;
  private logger?: Logger;

  // Implementing missing methods required by PolicyListener interface
  visitTerminal(node: any): void { }
  visitErrorNode(node: any): void { }
  enterEveryRule(node: any): void { }
  exitEveryRule(node: any): void { }

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
    this.currentVerb = '';
    this.currentScope = '';
    this.currentResourceHasAllResources = false;
  }

  exitVerb(ctx: any): void {
    this.currentVerb = ctx?.text?.toLowerCase() || '';
  }

  exitResource(ctx: any): void {
    const resource = ctx?.text?.toLowerCase();
    this.currentResourceHasAllResources = !!(resource && resource.includes('all-resources'));

    // Check for network security group admin policies (require explicit manage verb)
    if (
      resource &&
      resource.includes('network-security-groups') &&
      this.currentVerb === 'manage'
    ) {
      this.restrictNsgPolicies.push(this.currentStatement);
    }

    // Check for specific service-related admin policies (only for manage operations)
    if (resource && this.currentVerb === 'manage') {
      this.getServiceFromResource(resource).forEach(service => {
        this.foundServiceAdminServices.add(service);
      });
    }
  }

  exitCondition(ctx: any): void {
    const condition = ctx?.text?.toLowerCase();

    // Check for MFA condition (support various MFA field names and true/!=false patterns)
    if (condition) {
      const mfaPatterns = [
        /request\.user\.mfa\w*\s*=\s*['"]?true['"]?/, // equals true
        /request\.user\.mfa\w*\s*!=\s*['"]?false['"]?/, // not equal false
      ];
      if (mfaPatterns.some(pattern => pattern.test(condition))) {
        this.mfaPolicies.push(this.currentStatement);
      }
    }

    // Check for admin restriction conditions (policies that protect admin groups)
    if (condition && condition.includes('target.group.name') && condition.includes('administrators')) {
      if (this.isAdminExclusionCondition(condition)) {
        this.adminRestrictionPolicies.push(this.currentStatement);
      }
    }
  }

  exitScope(ctx: any): void {
    this.currentScope = ctx?.text?.toLowerCase() || '';

    // Check for overly permissive policies (manage all-resources in tenancy)
    if (this.currentResourceHasAllResources && this.currentVerb === 'manage' && this.currentScope === 'tenancy') {
      this.overlyPermissivePolicies.push(this.currentStatement);
    }

    // Check for compartment-level admin policies (should manage all-resources in compartment)
    if (this.currentScope.includes('compartment') &&
      this.currentStatement.toLowerCase().includes('manage all-resources')) {
      this.compartmentAdminPolicies.push(this.currentStatement);
    }
  }

  // Implement other required methods from PolicyListener with empty bodies
  exitPolicy(ctx: any): void { }
  enterAllowExpression(ctx: any): void { }
  exitAllowExpression(ctx: any): void { }
  enterEndorseExpression(ctx: any): void { }
  exitEndorseExpression(ctx: any): void { }
  enterDefineExpression(ctx: any): void { }
  exitDefineExpression(ctx: any): void { }
  enterAdmitExpression(ctx: any): void { }
  exitAdmitExpression(ctx: any): void { }
  enterEndorseVerb(ctx: any): void { }
  exitEndorseVerb(ctx: any): void { }
  enterVerb(ctx: any): void { }
  enterPermissionList(ctx: any): void { }
  exitPermissionList(ctx: any): void { }
  enterScope(ctx: any): void { }
  enterEndorseScope(ctx: any): void { }
  exitEndorseScope(ctx: any): void { }
  enterSubject(ctx: any): void { }
  exitSubject(ctx: any): void { }
  enterGroupSubject(ctx: any): void { }
  exitGroupSubject(ctx: any): void { }
  enterResourceSubject(ctx: any): void { }
  exitResourceSubject(ctx: any): void { }
  enterServiceSubject(ctx: any): void { }
  exitServiceSubject(ctx: any): void { }
  enterGroupName(ctx: any): void { }
  exitGroupName(ctx: any): void {
    const groupName = ctx?.text;
    if (groupName && groupName.includes('${')) {
      this.logger?.debug(`Found HCL variable in group name for statement: ${this.currentStatement}`);
      this.policiesWithHclVariablesInGroup.push(this.currentStatement);
    }
  }
  enterResourceSubjectId(ctx: any): void { }
  exitResourceSubjectId(ctx: any): void { }
  enterServiceSubjectId(ctx: any): void { }
  exitServiceSubjectId(ctx: any): void { }
  enterGroupID(ctx: any): void { }
  exitGroupID(ctx: any): void { }
  enterDynamicGroupSubject(ctx: any): void { }
  exitDynamicGroupSubject(ctx: any): void { }
  enterTenancySubject(ctx: any): void { }
  exitTenancySubject(ctx: any): void { }
  enterDefinedSubject(ctx: any): void { }
  exitDefinedSubject(ctx: any): void { }
  enterDefined(ctx: any): void { }
  exitDefined(ctx: any): void { }
  enterResource(ctx: any): void { }
  enterCondition(ctx: any): void { }
  enterComparison(ctx: any): void { }
  exitComparison(ctx: any): void { }
  enterVariable(ctx: any): void { }
  exitVariable(ctx: any): void { }
  enterOperator(ctx: any): void { }
  exitOperator(ctx: any): void { }
  enterValue(ctx: any): void { }
  exitValue(ctx: any): void { }
  enterValueList(ctx: any): void { }
  exitValueList(ctx: any): void { }
  enterTimeWindow(ctx: any): void { }
  exitTimeWindow(ctx: any): void { }
  enterComparisonList(ctx: any): void { }
  exitComparisonList(ctx: any): void { }
  enterLogicalCombine(ctx: any): void { }
  exitLogicalCombine(ctx: any): void { }
  enterPatternMatch(ctx: any): void { }
  exitPatternMatch(ctx: any): void { }

  private isAdminExclusionCondition(condition: string): boolean {
    const normalized = condition.toLowerCase();
    if (!normalized.includes('target.group.name')) {
      return false;
    }

    const exclusionPatterns = [
      /target\.group\.name\s*!\s*=\s*['"]?administrators['"]?/, // "!=" or spaced "! ="
      /target\.group\.name\s+not\s+in\s*\([^)]*administrators[^)]*\)/, // not in list containing administrators
    ];

    return exclusionPatterns.some(pattern => pattern.test(normalized));
  }

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
