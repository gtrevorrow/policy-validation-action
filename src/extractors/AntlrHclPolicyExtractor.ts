import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { TerraformLexer } from '../generated/TerraformLexer';
import { TerraformParser, ResourceContext, ArgumentContext, ExpressionContext } from '../generated/TerraformParser';
import { TerraformVisitor } from '../generated/TerraformVisitor';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { PolicyExtractor } from './PolicyExtractor';

/**
 * Visitor to extract policy statements from Terraform HCL AST
 */
class PolicyStatementVisitor extends AbstractParseTreeVisitor<string[]> implements TerraformVisitor<string[]> {
    protected defaultResult(): string[] {
        return [];
    }

    aggregateResult(aggregate: string[], nextResult: string[]): string[] {
        return [...aggregate, ...nextResult];
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
                }
            } else {
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
