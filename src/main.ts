import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { 
    CharStreams, 
    CommonTokenStream,
    ErrorListener,
    RecognitionException,
    Recognizer,
    CharStream,
    Token,
    Parser,
    Lexer
} from 'antlr4';
import PolicyLexer from './generated/PolicyLexer';
import PolicyParser from './generated/PolicyParser';

// Add custom error listener implementation
class PolicyErrorListener implements ErrorListener<Token> {
    syntaxError(
        recognizer: Recognizer<Token>,
        offendingSymbol: Token | undefined,
        line: number,
        charPositionInLine: number,
        msg: string,
        e: RecognitionException | undefined
    ): void {
        throw new Error(`Line ${line}:${charPositionInLine} - ${msg}`);
    }
}

function extractAllowSegments(text: string): string[] {
    const pattern = /allow\s+(.*?)(?=\s+allow|$)/gi;
    const matches = text.matchAll(pattern);
    return Array.from(matches).map((match) => match[1]);
}

function formatPolicyStatements(segments: string[]): string {
    return segments.map(segment => `Allow ${segment}`).join('\n');
}

async function processFile(filePath: string): Promise<string[]> {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return extractAllowSegments(data);
    } catch (error) {
        core.error(`Error processing ${filePath}: ${error}`);
        return [];
    }
}

async function findTerraformFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await findTerraformFiles(fullPath));
        } else if (entry.name.endsWith('.tf')) {
            files.push(fullPath);
        }
    }
    return files;
}

function parsePolicy(text: string): boolean {
    try {
        const inputStream = CharStreams.fromString(text);
        const lexer = new PolicyLexer(inputStream) as unknown as Lexer;
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new PolicyParser(tokenStream);
        
        parser.removeErrorListeners();
        parser.addErrorListener(new PolicyErrorListener());
        
        const tree = parser.policy();
        return true;
    } catch (error) {
        if (error instanceof Error) {
            core.error(`Policy parsing error: ${error.message}`);
        }
        return false;
    }
}

async function run(): Promise<void> {
    try {
        const scanPath = core.getInput('path') || process.env.GITHUB_WORKSPACE || '.';
        const tfFiles = await findTerraformFiles(scanPath);
        
        if (tfFiles.length === 0) {
            core.warning('No .tf files found');
            return;
        }

        let allSegments: string[] = [];
        for (const file of tfFiles) {
            const segments = await processFile(file);
            allSegments.push(...segments);
        }

        if (allSegments.length > 0) {
            const policyText = formatPolicyStatements(allSegments);
            core.info('Validating policy statements...');
            
            if (!parsePolicy(policyText)) {
                core.setFailed('Policy validation failed - check error messages above');
                return;
            }
            
            core.info('Policy validation successful');
            core.setOutput('allow_segments', allSegments);
            core.info('Found and validated allow segments:');
            allSegments.forEach(segment => core.info(segment));
        }
    } catch (error) {
        core.setFailed(`Action failed: ${error}`);
    }
}

run();