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
import { Logger, ValidationResult } from './types';

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

const POLICY_STATEMENTS_REGEX = /statements\s*=\s*\[\s*((?:[^[\]]*?(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$\{(?:[^{}]|\{[^{}]*\})*\})?)*)\s*\]/s;

function extractPolicyExpressions(text: string): string[] {
    const statementsMatch = text.match(POLICY_STATEMENTS_REGEX);
    if (!statementsMatch || !statementsMatch[1]) {
        core.debug('No statements array found in Terraform file');
        return [];
    }

    // Split statements handling nested structures and comments
    return statementsMatch[1]
        .split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)  // Split on commas outside quotes
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('#'))  // Remove empty and comment lines
        .map(s => s.replace(/^["'](.*)["']$/, '$1'))  // Remove outer quotes
        .map(s => s.replace(/\\(["'])/, '$1'))  // Unescape quotes
        .filter(s => /^(Allow|Define|Endorse|Admit)\s+.+$/i.test(s));
}

function formatPolicyStatements(expressions: string[]): string {
    // Ensure each statement is on its own line with proper separation
    return expressions.map(expr => expr.trim()).join('\n');
}

async function processFile(filePath: string, logger?: Logger): Promise<string[]> {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const expressions = extractPolicyExpressions(data);
        logger?.debug(`Found ${expressions.length} policy expressions in ${filePath}`);
        return expressions;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger?.error(`Error processing ${filePath}: ${errorMessage}`);
        return [];
    }
}

function getWorkspacePath(): string {
    // Check each CI platform's environment variable
    return process.env.GITHUB_WORKSPACE ||    // GitHub Actions
           process.env.CI_PROJECT_DIR ||      // GitLab CI
           process.env.BITBUCKET_CLONE_DIR || // BitBucket Pipelines
           process.cwd();                     // Fallback to current directory
}

async function findTerraformFiles(dir: string, logger?: Logger): Promise<string[]> {
    // Resolve path relative to CI platform's workspace
    const workspacePath = getWorkspacePath();
    const normalizedPath = path.resolve(workspacePath, dir);
    logger?.debug(`CI workspace: ${workspacePath}`);
    logger?.debug(`Resolved path: ${normalizedPath}`);

    try {
        // First check if path exists and is accessible
        try {
            await fs.promises.access(normalizedPath, fs.constants.R_OK);
        } catch (error) {
            logger?.error(`Path ${normalizedPath} is not accessible: ${error}`);
            return [];
        }

        const stats = await fs.promises.stat(normalizedPath);
        
        if (stats.isFile()) {
            logger?.debug(`Processing single file: ${normalizedPath}`);
            return normalizedPath.endsWith('.tf') ? [normalizedPath] : [];
        }

        if (!stats.isDirectory()) {
            logger?.error(`Path ${normalizedPath} is neither a file nor a directory`);
            return [];
        }

        const files: string[] = [];
        
        try {
            const entries = await fs.promises.readdir(normalizedPath, { withFileTypes: true });
            logger?.debug(`Scanning directory with ${entries.length} entries`);

            for (const entry of entries) {
                const fullPath = path.join(normalizedPath, entry.name);
                try {
                    if (entry.isDirectory()) {
                        logger?.debug(`Recursing into directory: ${fullPath}`);
                        files.push(...await findTerraformFiles(fullPath, logger));
                    } else if (entry.isFile() && entry.name.endsWith('.tf')) {
                        logger?.debug(`Found Terraform file: ${fullPath}`);
                        files.push(fullPath);
                    }
                } catch (error) {
                    logger?.error(`Error processing entry ${fullPath}: ${error}`);
                    // Continue with next entry instead of failing completely
                    continue;
                }
            }
        } catch (error) {
            // Fallback to older readdir method if withFileTypes fails
            logger?.warn(`Advanced directory reading failed, falling back to basic mode: ${error}`);
            const names = await fs.promises.readdir(normalizedPath);
            for (const name of names) {
                const fullPath = path.join(normalizedPath, name);
                try {
                    const entryStats = await fs.promises.stat(fullPath);
                    if (entryStats.isDirectory()) {
                        files.push(...await findTerraformFiles(fullPath, logger));
                    } else if (name.endsWith('.tf')) {
                        files.push(fullPath);
                    }
                } catch (error) {
                    logger?.error(`Error processing entry ${fullPath}: ${error}`);
                    continue;
                }
            }
        }
        
        return files;
    } catch (error) {
        logger?.error(`Error processing path ${normalizedPath}: ${error}`);
        return [];
    }
}

function parsePolicy(text: string, logger?: Logger): boolean {
    try {
        // Debug the input text to see what's being parsed
        logger?.debug('Parsing policy text:');
        logger?.debug(text);
        
        // Process each statement separately
        const statements = text.split('\n').filter(s => s.trim());
        
        for (const statement of statements) {
            const inputStream = CharStreams.fromString(statement);
            const lexer = new PolicyLexer(inputStream) as unknown as Lexer;
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new PolicyParser(tokenStream);
            
            parser.removeErrorListeners();
            parser.addErrorListener({
                syntaxError(
                    recognizer: Recognizer<Token>,
                    offendingSymbol: Token | undefined,
                    line: number,
                    charPositionInLine: number,
                    msg: string,
                    e: RecognitionException | undefined
                ): void {
                    logger?.error('Failed to parse policy statement:');
                    logger?.error(`Statement: "${statement}"`);
                    logger?.error(`Position: ${' '.repeat(charPositionInLine)}^ ${msg}`);
                    throw new Error(`Policy parsing error: ${msg}`);
                }
            });
            
            parser.policy();
        }
        return true;
    } catch (error) {
        if (error instanceof Error) {
            logger?.error(`Policy validation failed`);
        }
        return false;
    }
}

// GitHub Action specific wrapper
async function runAction(): Promise<void> {
    const actionLogger: Logger = {
        debug: (msg) => core.debug(msg),
        info: (msg) => core.info(msg),
        warn: (msg) => core.warning(msg),
        error: (msg) => core.error(msg)
    };

    try {
        const inputPath = core.getInput('path');
        const scanPath = path.resolve(getWorkspacePath(), inputPath);
        actionLogger.debug(`Input path: ${inputPath}`);
        actionLogger.debug(`Resolved scan path: ${scanPath}`);
        
        const tfFiles = await findTerraformFiles(scanPath, actionLogger);
        core.debug(`Found ${tfFiles.length} Terraform files`);
        
        if (tfFiles.length === 0) {
            core.warning('No .tf files found');
            return;
        }

        let allExpressions: string[] = [];
        for (const file of tfFiles) {
            const expressions = await processFile(file, actionLogger);
            core.debug(`Extracted expressions from ${file}: ${JSON.stringify(expressions)}`);
            allExpressions.push(...expressions);
        }

        if (allExpressions.length > 0) {
            const policyText = formatPolicyStatements(allExpressions);
            core.info('Validating policy statements...');
            
            if (!parsePolicy(policyText, actionLogger)) {
                core.setFailed('Policy validation failed - check error messages above');
                return;
            }
            
            core.info('Policy validation successful');
            core.setOutput('policy_expressions', allExpressions);
            
            // For backward compatibility
            const allowStatements = allExpressions.filter(expr => expr.toLowerCase().startsWith('allow'));
            core.setOutput('allow_segments', allowStatements);
            
            core.info('Found and validated policy expressions:');
            allExpressions.forEach(expr => core.info(expr));
        }
    } catch (error) {
        core.setFailed(`Action failed: ${error}`);
    }
}

// Only run the action if we're in a GitHub Action environment
if (process.env.GITHUB_ACTION) {
    runAction();
}

// Single export statement at the end of the file
export {
    findTerraformFiles,
    processFile,
    parsePolicy,
    formatPolicyStatements
};