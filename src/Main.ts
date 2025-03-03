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
import  PolicyLexer from './generated/PolicyLexer';
import  PolicyParser from './generated/PolicyParser';
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

async function findPolicyFiles(
    dir: string, 
    options?: { fileNames?: string[], fileExtension?: string }, 
    logger?: Logger
): Promise<string[]> {
    const fileExtension = options?.fileExtension || '.tf';
    
    try {
        // First check if path exists and is accessible
        try {
            await fs.promises.access(dir, fs.constants.R_OK);
        } catch (error) {
            logger?.error(`Path ${dir} is not accessible: ${error}`);
            return [];
        }

        const stats = await fs.promises.stat(dir);
        
        // If it's a file, check if it matches criteria
        if (stats.isFile()) {
            logger?.debug(`Processing single file: ${dir}`);
            
            // If specific files are provided, check if this file is in that list
            if (options?.fileNames && options.fileNames.length > 0) {
                const fileName = path.basename(dir);
                return options.fileNames.includes(fileName) ? [dir] : [];
            }
            
            // Otherwise, check file extension
            return dir.endsWith(fileExtension) ? [dir] : [];
        }

        if (!stats.isDirectory()) {
            logger?.error(`Path ${dir} is neither a file nor a directory`);
            return [];
        }

        // If we have specific file names, we'll look for those files directly
        if (options?.fileNames && options.fileNames.length > 0) {
            const files: string[] = [];
            for (const fileName of options.fileNames) {
                const filePath = path.join(dir, fileName);
                try {
                    await fs.promises.access(filePath, fs.constants.R_OK);
                    const fileStats = await fs.promises.stat(filePath);
                    if (fileStats.isFile()) {
                        files.push(filePath);
                    }
                } catch (error) {
                    // File doesn't exist or isn't accessible, just skip it
                    logger?.debug(`File ${fileName} not found in ${dir}`);
                }
            }
            return files;
        }

        // Otherwise, scan the directory recursively
        const files: string[] = [];
        
        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            logger?.debug(`Scanning directory with ${entries.length} entries`);

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                try {
                    if (entry.isDirectory()) {
                        logger?.debug(`Recursing into directory: ${fullPath}`);
                        files.push(...await findPolicyFiles(fullPath, options, logger));
                    } else if (entry.isFile() && entry.name.endsWith(fileExtension)) {
                        logger?.debug(`Found policy file: ${fullPath}`);
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
                        files.push(...await findPolicyFiles(fullPath, options, logger));
                    } else if (name.endsWith(fileExtension)) {
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

    let inputPath: string = 'unknown'; // Declare and initialize inputPath
    let allOutputs: ValidationOutput[] = []; // Declare allOutputs outside the try block

    try {
        inputPath = core.getInput('path');
        const scanPath = path.resolve(getWorkspacePath(), inputPath);
        const extractorType = (core.getInput('extractor') || 'regex') as ExtractorType;
        const pattern = core.getInput('extractorPattern');
        const exitOnError = core.getBooleanInput('exitOnError');
        const fileNames = core.getInput('files') ? core.getInput('files').split(',').map(f => f.trim()) : undefined;

        actionLogger.debug(`Input path: ${inputPath}`);
        actionLogger.debug(`Resolved scan path: ${scanPath}`);
        actionLogger.debug(`Using extractor: ${extractorType}`);
        if (fileNames) {
            actionLogger.debug(`Specific files to process: ${fileNames.join(', ')}`);
        }
        
        const tfFiles = await findPolicyFiles(scanPath, { fileNames, fileExtension: '.tf' }, actionLogger);
        core.debug(`Found ${tfFiles.length} policy files to validate`);
        
        if (tfFiles.length === 0) {
            core.warning('No .tf files found');
            allOutputs = [{
                file: inputPath,
                isValid: false,
                statements: [],
                errors: [{
                    statement: '',
                    position: 0,
                    message: 'No .tf files found'
                }]
            }];
        } else {
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
                    }
                    allOutputs.push({
                        file,
                        isValid: result.isValid,
                        statements: expressions,
                        errors: result.errors
                    });
                    if (exitOnError && !result.isValid) {
                        core.setFailed('Exiting due to policy validation errors');
                        break; // Exit the loop if exitOnError is true
                    }
                }
            }
        }

        if (allOutputs.length === 0 && tfFiles.length > 0) {
            core.warning('No policy statements found');
            allOutputs = [{
                file: inputPath,
                isValid: false,
                statements: [],
                errors: [{
                    statement: '',
                    position: 0,
                    message: 'No policy statements found'
                }]
            }];
        }

        core.info('Policy validation successful');
    } catch (error) {
        allOutputs = [{
            file: inputPath,
            isValid: false,
            statements: [],
            errors: [{
                statement: '',
                position: 0,
                message: error instanceof Error ? error.message : String(error)
            }]
        }];
        core.setFailed(`Action failed: ${error}`);
    } finally {
        // Always set output before exiting
        core.setOutput('policy_validation', JSON.stringify(allOutputs));
        if (allOutputs.some(output => !output.isValid)) {
            core.setFailed('Policy validation failed');
        }
    }
}

// Only run the action if we're in a GitHub Action environment
if (process.env.GITHUB_ACTION) {
    runAction();
}

// Single export statement at the end of the file
export {
    findPolicyFiles,
    processFile,
    parsePolicy,
    formatPolicyStatements
};