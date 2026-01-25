import { CharStreams, CommonTokenStream, Recognizer, Token, RecognitionException } from 'antlr4ts';
import { PolicyLexer } from './src/generated/PolicyLexer';
import { PolicyParser } from './src/generated/PolicyParser';

const statement = "BadSyntax manage something somewhere";
const inputStream = CharStreams.fromString(statement);
const lexer = new PolicyLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new PolicyParser(tokenStream);

parser.removeErrorListeners();
parser.addErrorListener({
    syntaxError: (
        recognizer: Recognizer<Token, any>,
        offendingSymbol: Token | undefined,
        line: number,
        charPositionInLine: number,
        msg: string,
        e: RecognitionException | undefined
    ): void => {
        console.log(`Syntax Error: ${msg} at ${charPositionInLine}`);
    }
});

console.log("Parsing...");
try {
    parser.policy();
    console.log("Parsing complete.");
} catch (e) {
    console.error("Caught error:", e);
}
