import { PolicyListener } from '../generated/PolicyListener';

export interface ReferenceLookupResult {
  statement: string;
  name: string;
  isHcl: boolean;
}

/**
 * ANTLR listener that extracts group references from policy statements.
 */
export class ReferenceLookupListener implements PolicyListener {
  private results: ReferenceLookupResult[] = [];

  constructor(private statement: string) {}

  // -- Listener methods --

  exitGroupName(ctx: any): void {
    const name = ctx?.text;
    if (!name) return;
    this.results.push({
      statement: this.statement,
      name,
      isHcl: name.includes('${'),
    });
  }

  exitGroupID(ctx: any): void {
    const name = ctx?.text;
    if (!name) return;
    this.results.push({
      statement: this.statement,
      name,
      isHcl: name.includes('${'),
    });
  }

  getResults(): ReferenceLookupResult[] {
    return this.results;
  }

  // -- Required interface stubs --
  visitTerminal(node: any): void {}
  visitErrorNode(node: any): void {}
  enterEveryRule(node: any): void {}
  exitEveryRule(node: any): void {}
  enterPolicy(ctx: any): void {}
  exitPolicy(ctx: any): void {}
  enterAllowExpression(ctx: any): void {}
  exitAllowExpression(ctx: any): void {}
  enterDenyExpression(ctx: any): void {}
  exitDenyExpression(ctx: any): void {}
  enterEndorseExpression(ctx: any): void {}
  exitEndorseExpression(ctx: any): void {}
  enterDefineExpression(ctx: any): void {}
  exitDefineExpression(ctx: any): void {}
  enterAdmitExpression(ctx: any): void {}
  exitAdmitExpression(ctx: any): void {}
  enterEndorseVerb(ctx: any): void {}
  exitEndorseVerb(ctx: any): void {}
  enterVerb(ctx: any): void {}
  exitVerb(ctx: any): void {}
  enterPermissionList(ctx: any): void {}
  exitPermissionList(ctx: any): void {}
  enterScope(ctx: any): void {}
  exitScope(ctx: any): void {}
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
  enterResourceSubjectId(ctx: any): void {}
  exitResourceSubjectId(ctx: any): void {}
  enterServiceSubjectId(ctx: any): void {}
  exitServiceSubjectId(ctx: any): void {}
  enterGroupID(ctx: any): void {}
  enterDynamicGroupSubject(ctx: any): void {}
  exitDynamicGroupSubject(ctx: any): void {}
  enterTenancySubject(ctx: any): void {}
  exitTenancySubject(ctx: any): void {}
  enterDefinedSubject(ctx: any): void {}
  exitDefinedSubject(ctx: any): void {}
  enterDefined(ctx: any): void {}
  exitDefined(ctx: any): void {}
  enterResource(ctx: any): void {}
  exitResource(ctx: any): void {}
  enterCondition(ctx: any): void {}
  exitCondition(ctx: any): void {}
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
}
