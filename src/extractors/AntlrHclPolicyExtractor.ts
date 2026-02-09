import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { TerraformLexer } from '../generated/TerraformLexer';
import { TerraformParser, ResourceContext, ArgumentContext, ExpressionContext, File_Context, VariableContext, IdentifierContext, LocalContext, IdentifierchainContext, IndexContext, List_Context, Map_Context, SectionContext, ValContext } from '../generated/TerraformParser';
import { TerraformVisitor } from '../generated/TerraformVisitor';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { PolicyExtractor } from './PolicyExtractor';

/**
 * Visitor to extract policy statements from Terraform HCL AST.
 *
 * Semantics:
 * - Collects variable defaults and locals defined in the same file.
 * - Extracts `statements` arguments anywhere in the file, not only policy resources.
 * - Resolves `var.*` / `local.*` references with static traversals (attribute and literal index).
 * - Ignores dynamic traversals (e.g., `count.index`) and non-literal expressions.
 * - Normalizes heredocs with any delimiter and returns trimmed strings.
 */
class PolicyStatementVisitor extends AbstractParseTreeVisitor<string[]> implements TerraformVisitor<string[]> {
    private variableDefaults: Map<string, ExpressionContext> = new Map();
    private localValues: Map<string, ExpressionContext> = new Map();

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
            } else if (child instanceof LocalContext) {
                this.extractLocalValue(child);
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
        for (let i = 0; i < body.childCount; i++) {
            const child = body.getChild(i);
            if (child instanceof ArgumentContext) {
                const argName = child.identifier().text;
                if (argName === 'default') {
                    this.variableDefaults.set(varName, child.expression());
                }
            }
        }
    }

    private extractLocalValue(ctx: LocalContext) {
        // Locals block contains multiple arguments: locals { name1 = val1, name2 = val2 }
        // The structure is local -> blockbody -> argument*
        const body = ctx.blockbody();
        for (let i = 0; i < body.childCount; i++) {
            const child = body.getChild(i);
            if (child instanceof ArgumentContext) {
                const localName = child.identifier().text;
                this.localValues.set(localName, child.expression());
            }
        }
    }

    visitResource(ctx: ResourceContext): string[] {
        return this.visitChildren(ctx);
    }

    visitArgument(ctx: ArgumentContext): string[] {
        const identifier = ctx.identifier().text;
        if (identifier === 'statements') {
            const expression = ctx.expression();
            return this.extractStatementsFromExpression(expression);
        }
        return this.visitChildren(ctx);
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
                    const normalized = this.normalizeStringLiteral(node.text);
                    results.push(normalized.trim());
                }

            } else {
                // If it's an interior node, check if it's an identifier referencing a variable
                if (node instanceof IdentifierContext) {
                    const resolved = this.resolveIdentifierReference(node);
                    if (resolved.handled) {
                        results.push(...resolved.values);
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

    private normalizeStringLiteral(text: string): string {
        if (text.startsWith('"') && text.endsWith('"')) {
            return text.substring(1, text.length - 1);
        }

        if (text.startsWith('<<')) {
            const match = text.match(/^<<-?([A-Za-z0-9_-]+)\n?/);
            if (match) {
                const delimiter = match[1];
                let body = text.slice(match[0].length);
                const endRegex = new RegExp(`\\n?\\s*${delimiter}\\s*$`);
                body = body.replace(endRegex, '');
                return body;
            }
        }

        return text;
    }

    private resolveIdentifierReference(ctx: IdentifierContext): { handled: boolean; values: string[] } {
        const reference = this.parseIdentifierReference(ctx);
        if (!reference) {
            return { handled: false, values: [] };
        }

        if (reference.root !== 'var' && reference.root !== 'local') {
            return { handled: false, values: [] };
        }

        const store = reference.root === 'var' ? this.variableDefaults : this.localValues;
        const expression = store.get(reference.base);
        if (!expression) {
            return { handled: true, values: [] };
        }

        if (reference.dynamic) {
            return { handled: true, values: [] };
        }

        const value = this.evaluateLiteralExpression(expression);
        if (reference.path.length === 0) {
            return { handled: true, values: this.valueToStrings(value) };
        }

        const resolved = this.resolvePath(value, reference.path);
        return { handled: true, values: this.valueToStrings(resolved) };
    }

    private parseIdentifierReference(ctx: IdentifierContext): { root: string | null; base: string; path: Array<string | number>; dynamic: boolean } | null {
        const children = ctx.children ?? [];
        let root: string | null = null;

        if (children.length >= 3) {
            const firstText = children[0].text;
            if (firstText === 'var' || firstText === 'local' || firstText === 'data' || firstText === 'module') {
                root = firstText;
            }
        }

        const chainContext = ctx.identifierchain();
        const chain = this.collectIdentifierChain(chainContext);
        if (!chain || chain.segments.length === 0) {
            return null;
        }

        const base = chain.segments[0];
        if (typeof base !== 'string') {
            return null;
        }

        return {
            root,
            base,
            path: chain.segments.slice(1),
            dynamic: chain.dynamic,
        };
    }

    // Flattens a traversal like `local.policy_map["main"]` into segments ["policy_map", "main"].
    // Dynamic indices (e.g. `local.list[count.index]`) set `dynamic=true` so resolution is skipped.
    private collectIdentifierChain(ctx: IdentifierchainContext): { segments: Array<string | number>; dynamic: boolean } {
        const segments: Array<string | number> = [];
        let dynamic = false;

        if (ctx.IDENTIFIER()) {
            segments.push(ctx.IDENTIFIER()!.text);
        } else if (ctx.IN()) {
            segments.push(ctx.IN()!.text);
        } else if (ctx.VARIABLE()) {
            segments.push(ctx.VARIABLE()!.text);
        } else if (ctx.PROVIDER()) {
            segments.push(ctx.PROVIDER()!.text);
        } else if (ctx.STAR()) {
            dynamic = true;
            segments.push('*');
        } else if (ctx.inline_index()) {
            const indexText = ctx.inline_index()!.NATURAL_NUMBER().text;
            segments.push(Number(indexText));
        }

        if (ctx.index()) {
            const indexValue = this.evaluateIndex(ctx.index()!);
            if (indexValue === undefined) {
                dynamic = true;
            } else {
                segments.push(indexValue);
            }
        }

        const children = ctx.identifierchain();
        for (const child of children) {
            const result = this.collectIdentifierChain(child);
            if (result.dynamic) {
                dynamic = true;
            }
            segments.push(...result.segments);
        }

        return { segments, dynamic };
    }

    private evaluateIndex(ctx: IndexContext): string | number | undefined {
        const expression = ctx.expression();
        const value = this.evaluateLiteralExpression(expression);
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return undefined;
    }

    private evaluateLiteralExpression(ctx: ExpressionContext | undefined): LiteralValue | undefined {
        if (!ctx) {
            return undefined;
        }

        const section = ctx.section();
        if (section) {
            return this.evaluateSection(section);
        }

        if (ctx.LPAREN() && ctx.expression().length === 1) {
            return this.evaluateLiteralExpression(ctx.expression(0));
        }

        return undefined;
    }

    private evaluateSection(ctx: SectionContext): LiteralValue | undefined {
        if (ctx.list_()) {
            return this.evaluateList(ctx.list_()!);
        }
        if (ctx.map_()) {
            return this.evaluateMap(ctx.map_()!);
        }
        if (ctx.val()) {
            return this.evaluateVal(ctx.val()!);
        }
        return undefined;
    }

    private evaluateList(ctx: List_Context): LiteralValue[] | undefined {
        const expressions = ctx.expression();
        if (!expressions || expressions.length === 0) {
            return [];
        }

        const items: LiteralValue[] = [];
        for (const expression of expressions) {
            const value = this.evaluateLiteralExpression(expression);
            if (value === undefined) {
                return undefined;
            }
            items.push(value);
        }

        return items;
    }

    private evaluateMap(ctx: Map_Context): Record<string, LiteralValue> | undefined {
        const argumentsList = ctx.argument();
        const map: Record<string, LiteralValue> = {};
        for (const argument of argumentsList) {
            const key = argument.identifier().text;
            const value = this.evaluateLiteralExpression(argument.expression());
            if (value === undefined) {
                return undefined;
            }
            map[key] = value;
        }

        return map;
    }

    private evaluateVal(ctx: ValContext): LiteralValue | undefined {
        const stringContext = ctx.string();
        if (stringContext) {
            return this.normalizeStringLiteral(stringContext.text);
        }

        const numberContext = ctx.signed_number();
        if (numberContext) {
            const value = Number(numberContext.text);
            return Number.isNaN(value) ? undefined : value;
        }

        if (ctx.NULL_()) {
            return null;
        }

        if (ctx.BOOL()) {
            return ctx.BOOL()!.text === 'true';
        }

        return undefined;
    }

    private resolvePath(value: LiteralValue | undefined, path: Array<string | number>): LiteralValue | undefined {
        let current = value;
        for (const segment of path) {
            if (current === undefined || current === null) {
                return undefined;
            }

            if (typeof segment === 'number') {
                if (!Array.isArray(current)) {
                    return undefined;
                }
                current = current[segment];
            } else {
                if (Array.isArray(current) || typeof current !== 'object') {
                    return undefined;
                }
                current = (current as Record<string, LiteralValue>)[segment];
            }
        }

        return current;
    }

    private valueToStrings(value: LiteralValue | undefined): string[] {
        if (value === undefined || value === null) {
            return [];
        }

        if (typeof value === 'string') {
            return [value];
        }

        if (Array.isArray(value)) {
            return value.flatMap((item) => this.valueToStrings(item));
        }

        if (typeof value === 'object') {
            return Object.values(value).flatMap((item) => this.valueToStrings(item));
        }

        return [];
    }
}

type LiteralValue = string | number | boolean | null | LiteralArray | LiteralObject;
interface LiteralArray extends Array<LiteralValue> {}
interface LiteralObject {
    [key: string]: LiteralValue;
}

export class AntlrHclPolicyExtractor implements PolicyExtractor {
    extract(text: string): string[] {
        if (!text || text.trim() === '') {
            return [];
        }

        try {
            const normalizedText = this.normalizeHeredocs(text);
            const inputStream = CharStreams.fromString(normalizedText);
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

    private normalizeHeredocs(text: string): string {
        const lines = text.split(/\n/);
        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/<<-?([A-Za-z0-9_-]+)/);
            if (!match) {
                continue;
            }

            const delimiter = match[1];
            lines[i] = lines[i].replace(match[0], match[0].replace(delimiter, 'EOF'));

            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].trim() === delimiter) {
                    lines[j] = lines[j].replace(delimiter, 'EOF');
                    i = j;
                    break;
                }
            }
        }

        return lines.join('\n');
    }

    name(): string {
        return 'antlr-hcl';
    }
}
