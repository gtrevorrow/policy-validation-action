import { PolicyListener } from '../generated/PolicyListener';

export interface ScopeInfo {
    kind: 'tenancy' | 'compartment';
    target?: string; // Name or OCID
    raw: string;
}

export interface PolicySemantics {
    originalStatement: string;
    type: string; // ALLOW, DENY, etc.
    scopes: ScopeInfo[];
    verb?: string;
    resource?: string;
    services: string[]; // derived from resource
}

export class SemanticPolicyListener implements PolicyListener {
    public semantics: PolicySemantics[] = [];

    private currentSemantics: Partial<PolicySemantics> = {};
    private currentStatementString: string = '';
    private currentIndex: number = 0;

    constructor(private statements: string[]) { }

    // -- Listener Methods --

    enterPolicy(ctx: any): void {
        if (this.currentIndex < this.statements.length) {
            this.currentStatementString = this.statements[this.currentIndex];
            this.currentIndex++;
        }
    }

    enterAllowExpression(ctx: any): void { this.startStatement('ALLOW', ctx); }
    enterDenyExpression(ctx: any): void { this.startStatement('DENY', ctx); }
    enterEndorseExpression(ctx: any): void { this.startStatement('ENDORSE', ctx); }
    enterAdmitExpression(ctx: any): void { this.startStatement('ADMIT', ctx); }
    enterDefineExpression(ctx: any): void { this.startStatement('DEFINE', ctx); }

    exitAllowExpression(ctx: any): void { this.endStatement(); }
    exitDenyExpression(ctx: any): void { this.endStatement(); }
    exitEndorseExpression(ctx: any): void { this.endStatement(); }
    exitAdmitExpression(ctx: any): void { this.endStatement(); }
    exitDefineExpression(ctx: any): void { this.endStatement(); }

    enterScope(ctx: any): void {
        const text = ctx.text;
        const lower = text.toLowerCase();
        let kind: 'tenancy' | 'compartment' = 'tenancy';
        let target: string | undefined;

        if (lower.includes('compartment')) {
            kind = 'compartment';
            // ctx.getText() in ANTLR4 often combines tokens without spaces.
            // e.g. "compartmentMyComp" or "compartmentidMyComp"
            // We strip the prefix "compartment" and optional "id"
            let clean = text.substring("compartment".length);
            if (clean.toLowerCase().startsWith('id')) {
                clean = clean.substring(2);
            }

            // Handle "Parent:Child" syntax -> take Child
            // If spaces were preserved: "Parent : Child" -> "Parent:Child" (no spaces in clean if getText() strips)
            // or "Parent : Child" -> "Parent:Child"
            const lastPart = clean.split(':').pop() || clean;
            target = lastPart;
        }

        if (!this.currentSemantics.scopes) this.currentSemantics.scopes = [];
        this.currentSemantics.scopes.push({ kind, target, raw: text });
    }

    exitVerb(ctx: any): void {
        this.currentSemantics.verb = ctx.text.toLowerCase();
    }

    exitResource(ctx: any): void {
        const res = ctx.text.toLowerCase();
        this.currentSemantics.resource = res;
    }

    // -- Helpers --

    private startStatement(type: string, ctx: any) {
        this.currentSemantics = {
            type,
            originalStatement: this.currentStatementString || ctx.text, // Use tracked statement if available, else fallback to parsed text
            scopes: [],
            services: []
        };
    }

    private endStatement() {
        if (this.currentSemantics.type) {
            this.semantics.push(this.currentSemantics as PolicySemantics);
        }
        this.currentSemantics = {};
    }

    // Stub other methods
    visitTerminal(node: any): void { }
    visitErrorNode(node: any): void { }
    enterEveryRule(node: any): void { }
    exitEveryRule(node: any): void { }
    enterEndorseVerb(ctx: any): void { }
    exitEndorseVerb(ctx: any): void { }
    enterPermissionList(ctx: any): void { }
    exitPermissionList(ctx: any): void { }
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
    exitGroupName(ctx: any): void { }
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
    exitCondition(ctx: any): void { }
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
    exitPolicy(ctx: any): void { }
}
