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
    // First extract statements array from HCL
    const statementsMatch = text.match(/statements\s*=\s*\[([\s\S]*?)\]/);
    if (!statementsMatch || !statementsMatch[1]) {
        core.debug('No statements array found in Terraform file');
        return [];
    }

    // Parse the statements array content
    const statements = statementsMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
        .map(s => s.replace(/^"/, '').replace(/"$/, '')); // Remove quotes

    // Extract allow segments from each statement
    return statements
        .filter(s => s.toLowerCase().includes('allow'))
        .map(s => {
            const match = s.match(/^"?Allow\s+(.*?)"?$/i);
            return match ? match[1] : '';
        })
        .filter(s => s);
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
    const normalizedPath = path.resolve(dir);
    core.debug(`Checking path: ${normalizedPath}`);

    try {
        const stats = await fs.promises.stat(normalizedPath);
        
        // If path is a single file, return it if it's a .tf file
        if (stats.isFile()) {
            core.debug(`Processing single file: ${normalizedPath}`);
            return normalizedPath.endsWith('.tf') ? [normalizedPath] : [];
        }

        // If path is a directory, scan for .tf files
        const files: string[] = [];
        const entries = await fs.promises.readdir(normalizedPath, { withFileTypes: true });
        core.debug(`Scanning directory with ${entries.length} entries`);

        for (const entry of entries) {
            const fullPath = path.join(normalizedPath, entry.name);
            if (entry.isDirectory()) {
                core.debug(`Recursing into directory: ${fullPath}`);
                files.push(...await findTerraformFiles(fullPath));
            } else if (entry.name.endsWith('.tf')) {
                core.debug(`Found Terraform file: ${fullPath}`);
                files.push(fullPath);
            }
        }
        return files;
    } catch (error) {
        core.error(`Error processing path ${normalizedPath}: ${error}`);
        return [];
    }
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
        const inputPath = core.getInput('path');
        core.debug(`Input path: ${inputPath}`);
        
        // Resolve path relative to workspace
        const workspacePath = process.env.GITHUB_WORKSPACE || process.cwd();
        const scanPath = path.resolve(workspacePath, inputPath);
        core.debug(`Resolved scan path: ${scanPath}`);

        const tfFiles = await findTerraformFiles(scanPath);
        core.debug(`Found ${tfFiles.length} Terraform files`);
        
        if (tfFiles.length === 0) {
            core.warning('No .tf files found');
            return;
        }

        let allSegments: string[] = [];
        for (const file of tfFiles) {
            const segments = await processFile(file);
            core.debug(`Extracted segments from ${file}: ${JSON.stringify(segments)}`);
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