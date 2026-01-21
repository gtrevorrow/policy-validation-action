import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { PolicyValidator, ValidationCheck, ValidationReport, ValidationIssue, ValidationOptions, calculateValidationStatus, shouldPassWithValidatorConfig } from './PolicyValidator';
import { Logger } from '../types';
import { ValidationContext } from './context/ValidationContext';
import { SemanticPolicyListener, PolicySemantics } from './SemanticPolicyListener';
import { PolicyLexer } from '../generated/PolicyLexer';
import { PolicyParser } from '../generated/PolicyParser';

export class SemanticValidator implements PolicyValidator {
    private logger?: Logger;
    private context?: ValidationContext;

    public static readonly CHECKS: ValidationCheck[] = [
        { id: 'SEM-INVALID_SCOPE', name: 'Invalid Scope', description: 'Scope validation failed or compartment not found' },
        { id: 'SEM-HIERARCHY_MISMATCH', name: 'Hierarchy Mismatch', description: 'Attachment point not found in hierarchy or scope is not a descendant' },
        { id: 'SEM-DENY_DEPTH', name: 'Deny Depth', description: 'DENY policies must be attached near the root' },
        { id: 'SEM-OVER_PERMISSIONED', name: 'Over Permissioned', description: 'Broad permissions granted without conditions' }
    ];

    constructor(context?: ValidationContext, logger?: Logger) {
        this.context = context;
        this.logger = logger;
    }

    name(): string { return 'Semantic Validator'; }
    description(): string { return 'Validates policy semantics against organizational hierarchy'; }
    getChecks(): ValidationCheck[] { return SemanticValidator.CHECKS; }

    async validate(statements: string[], options: ValidationOptions = {}): Promise<ValidationReport[]> {
        if (!this.context) {
            this.logger?.debug('Scanning context not provided, skipping SemanticValidator');
            return [];
        }

        const issues: ValidationIssue[] = [];
        // Extract attachment point from options (pragmatic cast) or assume root if untyped
        const attachmentPoint = (options as any).attachmentPoint;

        if (!attachmentPoint && options.validatorConfig?.runGlobalValidators) {
            // If running globally without specific attachment, we might skip hierarchy checks 
            // or warn about missing context.
            this.logger?.debug('No attachment point provided for semantic validation.');
        }

        // Parse all statements
        const semantics = this.parseStatements(statements);

        for (const semantic of semantics) {
            // Rule 1: Invalid Scope (Compartment Existence)
            for (const scope of semantic.scopes) {
                if (scope.kind === 'compartment' && scope.target) {
                    // Check if resolved HCL variable? We can't valid hcl vars against hierarchy
                    if (!scope.target.includes('${')) {
                        const compartment = this.context.getCompartment(scope.target);
                        if (!compartment) {
                            issues.push(this.createIssue('SEM-INVALID_SCOPE', semantic.originalStatement,
                                `Compartment scope '${scope.target}' not found in hierarchy`, 'error'));
                        } else if (attachmentPoint) {
                            // Rule 2: Hierarchy Mismatch (Subtree)
                            // If scope target is not a descendant of attachment point
                            // Check if attachment point exists
                            const attachNode = this.context.getCompartment(attachmentPoint);
                            if (attachNode) {
                                // Check if scope.target is descendant of attachmentPoint
                                // Logic: isAncestor(attachmentPoint, scope.target)
                                const isDescendant = this.context.isAncestor(attachmentPoint, compartment.ocid) || attachmentPoint === compartment.ocid;
                                if (!isDescendant) {
                                    issues.push(this.createIssue('SEM-HIERARCHY_MISMATCH', semantic.originalStatement,
                                        `Scope '${scope.target}' is not under attachment point '${attachmentPoint}'`, 'error'));
                                }
                            } else {
                                // Attachment point itself is invalid - usually caught elsewhere but good to be safe
                                // issues.push(this.createIssue('SEM-HIERARCHY_MISMATCH', semantic.originalStatement, `Attachment point '${attachmentPoint}' specific in context not found`, 'error'));
                            }
                        }
                    }
                }
            }

            // Rule 3: Deny Depth
            if (semantic.type === 'DENY' && attachmentPoint) {
                const ancestry = this.context.getAncestry(attachmentPoint);
                // Root depth = 1 (just root), Level 1 = 2 nodes.
                // policy_rules.py limit was max_deny_depth = 2 (so root and 1 level down?)
                // Actually it checked len(path_to_root) > max_deny_depth + 1
                if (ancestry.length > 3) { // 2 + 1
                    issues.push(this.createIssue('SEM-DENY_DEPTH', semantic.originalStatement,
                        `DENY policy attached too deep (depth ${ancestry.length}). Must be close to root.`, 'error'));
                }
            }

            // Rule 4: Over Permissioned (Heuristic)
            if (semantic.type === 'ALLOW' && semantic.verb === 'manage' && semantic.resource &&
                (semantic.resource.includes('all-resources') || semantic.resource.includes('all-resources-in-tenancy'))) {
                // If no conditions (conditions parsing is complex, listener stubbed it?)
                // Check if semantic has conditions? Listener doesn't extract conditions yet but we can check string
                if (!semantic.originalStatement.toLowerCase().includes('where')) {
                    issues.push(this.createIssue('SEM-OVER_PERMISSIONED', semantic.originalStatement,
                        `Broad permission 'manage ${semantic.resource}' without conditions.`, 'warning'));
                }
            }
        }

        const { passed, status, issues: finalIssues } = shouldPassWithValidatorConfig(issues, this.name(), options);

        return [{
            checkId: 'SEMANTIC-1',
            name: this.name(),
            description: this.description(),
            passed,
            status,
            issues: finalIssues
        }];
    }

    private parseStatements(statements: string[]): PolicySemantics[] {
        const listener = new SemanticPolicyListener(statements);
        const walker = new ParseTreeWalker();

        for (const statement of statements) {
            try {
                const chars = CharStreams.fromString(statement);
                const lexer = new PolicyLexer(chars);
                const tokens = new CommonTokenStream(lexer);
                const parser = new PolicyParser(tokens);
                parser.removeErrorListeners();
                const tree = parser.policy();
                // console.log('Parsed Tree:', tree.toStringTree(parser));
                walker.walk(listener, tree);
            } catch (e) {
                // Ignore parse errors here, SyntaxValidator handles them
            }
        }
        return listener.semantics;
    }

    private createIssue(checkId: string, statement: string, message: string, severity: 'error' | 'warning' | 'info'): ValidationIssue {
        return {
            checkId,
            statement,
            message,
            severity,
            recommendation: 'Adjust semantic scope or attachment.'
        };
    }
}
