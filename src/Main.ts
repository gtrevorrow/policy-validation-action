import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { 
    CharStreams, 
    CommonTokenStream,
    RecognitionException,
    Recognizer,
    Token,
    Lexer
} from 'antlr4';
import { Logger, ParseResult, PolicyError, ValidationOutput } from './types';
import PolicyLexer from './generated/PolicyLexer';
import PolicyParser from './generated/PolicyParser';
import { ExtractorFactory, ExtractorType } from './extractors/ExtractorFactory';

// Remove the redundant extractPolicyExpressions function since we now have PolicyExtractor

function formatPolicyStatements(expressions: string[]): string {
    // Ensure each statement is on its own line with proper separation
    return expressions.map(expr => expr.trim()).join('\n');
}

 async function processFile(
    filePath: string,
    pattern: string | undefined,
    extractor: ExtractorType = 'regex',
    logger?: Logger
): Promise<string[]> {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const extractorPattern = pattern || process.env.POLICY_STATEMENTS_PATTERN;
        
        const policyExtractor = ExtractorFactory.create(extractor, {
            pattern: extractorPattern
        });
        
        const expressions = policyExtractor.extract(data);
        logger?.debug(`Found ${expressions.length} policy expressions in ${filePath}`);
        if (extractorPattern) {
            logger?.debug(`Using custom pattern: ${extractorPattern}`);
        }
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
    try {
        // First check if path exists and is accessible
        try {
            await fs.promises.access(dir, fs.constants.R_OK);
        } catch (error) {
            logger?.error(`Path ${dir} is not accessible: ${error}`);
            return [];
        }

        const stats = await fs.promises.stat(dir);
        
        if (stats.isFile()) {
            logger?.debug(`Processing single file: ${dir}`);
            return dir.endsWith('.tf') ? [dir] : [];
        }

        if (!stats.isDirectory()) {
            logger?.error(`Path ${dir} is neither a file nor a directory`);
            return [];
        }

        const files: string[] = [];
        
        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            logger?.debug(`Scanning directory with ${entries.length} entries`);

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
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
            const names = await fs.promises.readdir(dir);
            for (const name of names) {
                const fullPath = path.join(dir, name);
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
        logger?.error(`Error processing path ${dir}: ${error}`);
        return [];
    }
}

function parsePolicy(text: string, logger?: Logger): ParseResult {
    try {
        logger?.debug('Parsing policy text:');
        logger?.debug(text);
        
        const statements = text.split('\n').filter(s => s.trim());
        const errors: PolicyError[] = [];
        
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
                    errors.push({
                        statement,
                        position: charPositionInLine,
                        message: msg
                    });
                }
            });
            parser.policy();
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger?.error(`Policy validation failed: ${errorMsg}`);
        return {
            isValid: false,
            errors: [{
                statement: text,
                position: 0,
                message: errorMsg
            }]
        };
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
        const extractorType = (core.getInput('extractor') || 'regex') as ExtractorType;
        const pattern = core.getInput('extractorPattern');
        const exitOnError = core.getBooleanInput('exitOnError');

        actionLogger.debug(`Input path: ${inputPath}`);
        actionLogger.debug(`Resolved scan path: ${scanPath}`);
        actionLogger.debug(`Using extractor: ${extractorType}`);
        
        const tfFiles = await findTerraformFiles(scanPath, actionLogger);
        core.debug(`Found ${tfFiles.length} Terraform files`);
        
        if (tfFiles.length === 0) {
            core.warning('No .tf files found');
            return;
        }

        let allOutputs: ValidationOutput[] = [];

        for (const file of tfFiles) {
            actionLogger.info(`Validating policy statements for file ${file}`);
            const expressions = await processFile(file, pattern, extractorType, actionLogger);
            if (expressions.length > 0) {
                const result = parsePolicy(formatPolicyStatements(expressions), actionLogger);
                if (!result.isValid) {
                    result.errors.forEach(error => {
                        actionLogger.error('Failed to parse policy statement:');
                        actionLogger.error(`Statement: "${error.statement}"`);
                        actionLogger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
                    });
                    core.setFailed(`Policy validation failed for file ${file}`);
                    if (exitOnError) {
                        core.setFailed('Exiting due to policy validation errors');
                        return;
                    }
                }
                allOutputs.push({
                    file,
                    isValid: result.isValid,
                    statements: expressions,
                    errors: result.errors
                });
            }
        }

        if (allOutputs.length === 0) {
            core.warning('No policy statements found');
            return;
        }

        core.info('Policy validation successful');
        core.setOutput('policy_validation', allOutputs);
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