import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { TerraformLexer } from '../generated/TerraformLexer';
import { TerraformParser, ResourceContext, ArgumentContext, ExpressionContext, File_Context, VariableContext, IdentifierContext } from '../generated/TerraformParser';
import { TerraformVisitor } from '../generated/TerraformVisitor';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { PolicyExtractor } from './PolicyExtractor';

/**
 * Visitor to extract policy statements from Terraform HCL AST
 */
class PolicyStatementVisitor extends AbstractParseTreeVisitor<string[]> implements TerraformVisitor<string[]> {
    private variableDefaults: Map<string, string[]> = new Map();

    protected defaultResult(): string[] {
        return [];
    }

    aggregateResult(aggregate: string[], nextResult: string[]): string[] {
        return [...aggregate, ...nextResult];
    }

    visitFile_(ctx: File_Context): string[] {
        // First pass: collect variable defaults
        // We manually iterate children because we want to populate the map before visiting resources
        for (let i = 0; i < ctx.childCount; i++) {
            const child = ctx.getChild(i);
            // Check if it's a variable block
            // In the parser rule: file_ : (local | module | output | provider | variable | data | resource | terraform)* EOF
            // We can check if the child is a VariableContext by checking its rule index or instanceof

            // However, the visitor pattern usually visits children automatically. 
            // Attempting to "pre-scan" by iterating children manually is one way.
            // Another way is to just visit everything, but Variable blocks appear at top level same as Resource blocks.
            // The order in the file matters if we just rely on standard visitation order.
            // But usually variables are defined before or after resources. 
            // To be safe, we should scan variables first.

            if (child instanceof VariableContext) {
                this.extractVariableDefault(child);
            }
        }

        // Second pass: visit everything else (resources)
        // We use the default implementation or just iterate again
        // Note: calling super.visitChildren(ctx) would re-visit variables which returns [] anyway.
        return this.visitChildren(ctx);
    }

    private extractVariableDefault(ctx: VariableContext) {
        const varName = ctx.name().text.replace(/^"|"$/g, '');
        const body = ctx.blockbody();

        // Find 'default' argument
        // blockbody children are specific contexts, but getChild(i) returns ParseTree
        // We can iterate over argument() contexts if available, but the generated visitor/listener structure 
        // suggests we might need to inspect the body's children.

        // Let's look for arguments named 'default'
        for (let i = 0; i < body.childCount; i++) {
            const child = body.getChild(i);
            if (child instanceof ArgumentContext) {
                const argName = child.identifier().text;
                if (argName === 'default') {
                    const values = this.extractStatementsFromExpression(child.expression());
                    if (values.length > 0) {
                        this.variableDefaults.set(varName, values);
                    }
                }
            }
        }
    }

    visitResource(ctx: ResourceContext): string[] {
        const resourceType = ctx.resourcetype().text.replace(/\"/g, '');
        if (resourceType === 'oci_identity_policy') {
            return this.visitChildren(ctx);
        }
        return [];
    }

    visitArgument(ctx: ArgumentContext): string[] {
        const identifier = ctx.identifier().text;
        if (identifier === 'statements') {
            const expression = ctx.expression();
            return this.extractStatementsFromExpression(expression);
        }
        return [];
    }

    private extractStatementsFromExpression(ctx: ExpressionContext): string[] {
        const results: string[] = [];

        const findStrings = (node: any) => {
            // Check for TerminalNodes (leaves)
            if (node.symbol) {
                const type = node.symbol.type;
                // TerraformLexer.STRING or TerraformLexer.MULTILINESTRING
                // Note: we might need to check the exact type IDs from the generated Lexer
                if (type === TerraformLexer.STRING || type === TerraformLexer.MULTILINESTRING) {
                    let text = node.text;
                    if (text.startsWith('"') && text.endsWith('"')) {
                        text = text.substring(1, text.length - 1);
                    } else if (text.startsWith('<<-EOF') || text.startsWith('<<EOF')) {
                        text = text.replace(/^<<-?EOF\n?/, '').replace(/\n?EOF$/, '');
                    } else if (text.startsWith('<<-EOT') || text.startsWith('<<EOT')) {
                        text = text.replace(/^<<-?EOT\n?/, '').replace(/\n?EOT$/, '');
                    }
                    results.push(text.trim());
                } else if (type === TerraformLexer.IDENTIFIER) {
                    // Check if this is part of a variable reference
                    // ANTLR parse tree for `var.foo` is often:
                    // expression -> ... -> identifier (var) -> . -> identifier (foo)
                    // or identifierchain

                    // However, looking at TerraformParser.g4 (implied):
                    // identifierchain: (VARIABLE | PROVIDER | ... | IDENTIFIER) (DOT index? | DOT identifier)*

                    // The `node` here is a TerminalNode. 
                    // The `visitArgument` passes an `ExpressionContext`.
                    // The recursion `findStrings` goes down to terminals.

                    // If we hit "var", we need to look ahead? No, that's hard in a recursive void function.
                    // Better to handle IdentifierContext or ExpressionContext higher up?
                }
            } else {
                // If it's an interior node, check if it's an identifier referencing a variable
                if (node instanceof IdentifierContext) {
                    const text = node.text;
                    if (text.startsWith('var.')) {
                        const varName = text.substring(4);
                        const defaults = this.variableDefaults.get(varName);
                        if (defaults) {
                            results.push(...defaults);
                        }
                        return; // Don't recurse into children of this identifier
                    }
                }

                for (let i = 0; i < node.childCount; i++) {
                    findStrings(node.getChild(i));
                }
            }
        };

        findStrings(ctx);
        return results;
    }
}

export class AntlrHclPolicyExtractor implements PolicyExtractor {
    extract(text: string): string[] {
        if (!text || text.trim() === '') {
            return [];
        }

        try {
            const inputStream = CharStreams.fromString(text);
            const lexer = new TerraformLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new TerraformParser(tokenStream);

            const tree = parser.file_();
            const visitor = new PolicyStatementVisitor();
            return visitor.visit(tree);
        } catch (error) {
            console.error('Error parsing HCL:', error);
            return [];
        }
    }

    name(): string {
        return 'antlr-hcl';
    }
}
