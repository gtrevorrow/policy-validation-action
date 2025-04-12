#!/usr/bin/env node
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 24:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findPolicyFiles = findPolicyFiles;
exports.processFile = processFile;
exports.validatePolicySyntax = validatePolicySyntax;
exports.formatPolicyStatements = formatPolicyStatements;
exports.validatePolicies = validatePolicies;
exports.runAction = runAction;
const fs = __importStar(__nccwpck_require__(147));
const path = __importStar(__nccwpck_require__(17));
const ExtractorFactory_1 = __nccwpck_require__(727);
const ValidationPipeline_1 = __nccwpck_require__(220);
const OciCisBenchmarkValidator_1 = __nccwpck_require__(122);
const OciSyntaxValidator_1 = __nccwpck_require__(850);
/**
 * Function to format policy statements for output
 * This function ensures that each statement is on its own line and properly formatted.
 * It is used to prepare the output for better readability.
 * @param expressions
 * @returns  Formatted string of policy statements
 * Each statement is separated by a newline character.
 */
function formatPolicyStatements(expressions) {
    // Ensure each statement is on its own line with proper separation
    return expressions.map(expr => expr.trim()).join('\n');
}
/**
 * Function to process a file and extract policy statements
 * @param filePath The path to the file to process
 * @param pattern Optional regex pattern for extracting policy statements
 * @param extractor The type of extractor to use (default: 'regex')
 * @param logger Optional logger for recording diagnostic info
 * @returns An array of extracted policy statements
 */
async function processFile(filePath, pattern, extractor = 'regex', logger) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const extractorPattern = pattern || process.env.POLICY_STATEMENTS_PATTERN;
        const policyExtractor = ExtractorFactory_1.ExtractorFactory.create(extractor, {
            pattern: extractorPattern
        });
        const expressions = policyExtractor.extract(data);
        logger === null || logger === void 0 ? void 0 : logger.debug(`Found ${expressions.length} policy expressions in ${filePath}`);
        if (extractorPattern) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`Using custom pattern: ${extractorPattern}`);
        }
        return expressions;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger === null || logger === void 0 ? void 0 : logger.error(`Error processing ${filePath}: ${errorMessage}`);
        return [];
    }
}
/** Function to find policy files in a directory
 This function will recursively search for files matching the specified criteria
 and return their paths. It also handles both file and directory inputs.
 @param dir The directory to search in
 @param options Optional parameters for file names and extensions
 @param logger Optional logger for recording diagnostic info
 @returns An array of file paths that match the criteria
 If no files are found, an empty array is returned.
 If the path is not accessible, an error is logged and an empty array is returned.
*/
async function findPolicyFiles(dir, options, logger) {
    try {
        // First check if path exists and is accessible
        try {
            await fs.promises.access(dir, fs.constants.R_OK);
        }
        catch (error) {
            logger === null || logger === void 0 ? void 0 : logger.error(`Path ${dir} is not accessible: ${error}`);
            return [];
        }
        const stats = await fs.promises.stat(dir);
        // If it's a file, check if it matches criteria
        if (stats.isFile()) {
            logger === null || logger === void 0 ? void 0 : logger.debug(`Processing single file: ${dir}`);
            // If specific files are provided, check if this file is in that list
            if ((options === null || options === void 0 ? void 0 : options.fileNames) && options.fileNames.length > 0) {
                const fileName = path.basename(dir);
                return options.fileNames.includes(fileName) ? [dir] : [];
            }
            // If file extension is specified, check if file matches
            if ((options === null || options === void 0 ? void 0 : options.fileExtension) && !dir.endsWith(options.fileExtension)) {
                logger === null || logger === void 0 ? void 0 : logger.debug(`File ${dir} doesn't match extension ${options.fileExtension}, skipping`);
                return [];
            }
            // Include the file
            return [dir];
        }
        if (!stats.isDirectory()) {
            logger === null || logger === void 0 ? void 0 : logger.error(`Path ${dir} is neither a file nor a directory`);
            return [];
        }
        // If we have specific file names, we'll look for those files directly
        if ((options === null || options === void 0 ? void 0 : options.fileNames) && options.fileNames.length > 0) {
            const files = [];
            for (const fileName of options.fileNames) {
                const filePath = path.join(dir, fileName);
                try {
                    await fs.promises.access(filePath, fs.constants.R_OK);
                    const fileStats = await fs.promises.stat(filePath);
                    if (fileStats.isFile()) {
                        files.push(filePath);
                    }
                }
                catch (error) {
                    // File doesn't exist or isn't accessible, just skip it
                    logger === null || logger === void 0 ? void 0 : logger.debug(`File ${fileName} not found in ${dir}`);
                }
            }
            return files;
        }
        // Otherwise, scan the directory recursively
        const files = [];
        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            logger === null || logger === void 0 ? void 0 : logger.debug(`Scanning directory with ${entries.length} entries`);
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                try {
                    if (entry.isDirectory()) {
                        logger === null || logger === void 0 ? void 0 : logger.debug(`Recursing into directory: ${fullPath}`);
                        files.push(...await findPolicyFiles(fullPath, options, logger));
                    }
                    else if (entry.isFile()) {
                        // If file extension is specified, check if file matches
                        if ((options === null || options === void 0 ? void 0 : options.fileExtension) && !entry.name.endsWith(options.fileExtension)) {
                            logger === null || logger === void 0 ? void 0 : logger.debug(`File ${entry.name} doesn't match extension ${options.fileExtension}, skipping`);
                            continue;
                        }
                        logger === null || logger === void 0 ? void 0 : logger.debug(`Found file: ${fullPath}`);
                        files.push(fullPath);
                    }
                }
                catch (error) {
                    logger === null || logger === void 0 ? void 0 : logger.error(`Error processing entry ${fullPath}: ${error}`);
                    // Continue with next entry instead of failing completely
                    continue;
                }
            }
        }
        catch (error) {
            // Fallback to older readdir method if withFileTypes fails
            logger === null || logger === void 0 ? void 0 : logger.warn(`Advanced directory reading failed, falling back to basic mode: ${error}`);
            const names = await fs.promises.readdir(dir);
            for (const name of names) {
                const fullPath = path.join(dir, name);
                try {
                    const entryStats = await fs.promises.stat(fullPath);
                    if (entryStats.isDirectory()) {
                        files.push(...await findPolicyFiles(fullPath, options, logger));
                    }
                    else if (entryStats.isFile()) {
                        // If file extension is specified, check if file matches
                        if ((options === null || options === void 0 ? void 0 : options.fileExtension) && !name.endsWith(options.fileExtension)) {
                            logger === null || logger === void 0 ? void 0 : logger.debug(`File ${name} doesn't match extension ${options.fileExtension}, skipping`);
                            continue;
                        }
                        logger === null || logger === void 0 ? void 0 : logger.debug(`Found file: ${fullPath}`);
                        files.push(fullPath);
                    }
                }
                catch (error) {
                    logger === null || logger === void 0 ? void 0 : logger.error(`Error processing entry ${fullPath}: ${error}`);
                    continue;
                }
            }
        }
        return files;
    }
    catch (error) {
        logger === null || logger === void 0 ? void 0 : logger.error(`Error processing path ${dir}: ${error}`);
        return [];
    }
}
/**
 * Validates OCI policy statements for syntax correctness.
 * This is a wrapper around OciSyntaxValidator for backward compatibility.
 * @param statements The policy statements to validate
 * @param logger Optional logger for recording diagnostic info
 * @returns Parse result with validity status and any errors
 */
async function validatePolicySyntax(statements, logger) {
    const syntaxValidator = new OciSyntaxValidator_1.OciSyntaxValidator(logger);
    const validationReports = await syntaxValidator.validate(statements);
    // Process validation results into the expected ParseResult format
    const syntaxReport = validationReports[0]; // We expect only one report from OciSyntaxValidator
    const isValid = syntaxReport.passed;
    // Convert validation issues to PolicyError format
    const errors = [];
    if (!isValid) {
        for (const issue of syntaxReport.issues) {
            errors.push({
                statement: issue.statement,
                position: issue.message.includes('position') ?
                    parseInt(issue.message.split('position ')[1].split(':')[0]) : 0,
                message: issue.message.includes(':') ? issue.message.split(':')[1].trim() : issue.message
            });
        }
    }
    return {
        isValid,
        errors
    };
}
/**
 * Main function to validate policies in given path with provided options
 * This function will find all policy files, extract statements, validate syntax,
 * and run the CIS benchmark validation if requested.
 * @param scanPath The path to scan for policy files
 * @param options Validation options including extractor type, pattern, file names, etc.
 * @param logger Optional logger for recording diagnostic info
 * @returns An array of validation outputs for each file processed
 * Each output contains the file name, validity status, extracted statements, and any errors.
 *
 * If exitOnError is true and validation fails, the function will return early.
 * If runCisBenchmark is true, the CIS benchmark validation will be performed..
 * @throws Error if no files are found or if the path is not accessible
 * @throws Error if any file is not accessible
 */
async function validatePolicies(scanPath, options, logger) {
    // Find all policy files
    const filesToProcess = await findPolicyFiles(scanPath, {
        fileNames: options.fileNames,
        fileExtension: options.fileExtension,
    }, logger);
    if (filesToProcess.length === 0) {
        const message = options.fileExtension == undefined ?
            `No files found in ${scanPath}` :
            `No policy files found in ${scanPath}`;
        throw new Error(message);
    }
    // Track all validation outputs
    const allOutputs = [];
    // Track all policy statements for validation pipeline
    const allPolicyStatements = [];
    // Process each file
    for (const file of filesToProcess) {
        logger.info(`Validating policy statements for file ${file}`);
        const expressions = await processFile(file, options.pattern, options.extractorType, logger);
        // Collect statements for validation pipeline
        if (expressions.length > 0) {
            allPolicyStatements.push(...expressions);
        }
        // Validate syntax
        if (expressions.length > 0) {
            // Use the OciSyntaxValidator for validation
            const result = await validatePolicySyntax(expressions, logger);
            // Add results to outputs
            allOutputs.push({
                file,
                isValid: result.isValid,
                statements: expressions,
                errors: result.errors
            });
            // Exit on first error if required
            if (!result.isValid && options.exitOnError) {
                return allOutputs;
            }
        }
    }
    // Run the validation pipeline with all statements if requested
    if (allPolicyStatements.length > 0 && options.runCisBenchmark) {
        logger.info('Running validation pipeline...');
        // Set up validation pipeline
        const validationPipeline = new ValidationPipeline_1.ValidationPipeline(logger);
        // Add validators
        validationPipeline.addValidator(new OciSyntaxValidator_1.OciSyntaxValidator(logger));
        validationPipeline.addValidator(new OciCisBenchmarkValidator_1.OciCisBenchmarkValidator(logger));
        // Run validation
        const results = await validationPipeline.validate(allPolicyStatements);
        // Process results
        let hasIssues = false;
        for (const validatorResult of results) {
            logger.info(`Results from ${validatorResult.validatorName}:`);
            for (const report of validatorResult.reports) {
                if (!report.passed) {
                    hasIssues = true;
                    logger.warn(`Failed check: ${report.checkId} - ${report.name}`);
                    for (const issue of report.issues) {
                        logger.warn(`- ${issue.message}`);
                    }
                }
                else {
                    logger.info(`Passed check: ${report.checkId} - ${report.name}`);
                }
            }
        }
        // Add validation results to output
        if (allOutputs.length > 0) {
            allOutputs[0].validationResults = results;
        }
        // Return early if issues found and exitOnError is true
        if (hasIssues && options.exitOnError) {
            return allOutputs;
        }
    }
    logger.info('Policy validation completed');
    return allOutputs;
}
/**
 * Main entry point for running the policy validation
 * This function serves both the CLI and GitHub Action
 * @param platform The platform abstraction for handling inputs, outputs, and logging
 * @returns A promise that resolves when the action is complete
 * If an error occurs, it will be logged and the action will fail
 */
async function runAction(platform) {
    const logger = platform.createLogger();
    try {
        // Get inputs using the platform abstraction
        const inputPath = platform.getInput('path') || '.';
        const scanPath = resolvePath(inputPath);
        logger.info(`Resolved path: ${scanPath}`);
        // Build options from inputs
        const options = {
            extractorType: platform.getInput('extractor') || 'regex',
            pattern: platform.getInput('pattern'),
            fileExtension: platform.getInput('file-extension'),
            fileNames: platform.getInput('files') ?
                platform.getInput('files').split(',').map(f => f.trim()) :
                undefined,
            exitOnError: platform.getInput('exit-on-error') === 'true',
            runCisBenchmark: platform.getInput('cis-benchmark') === 'true'
        };
        // Log options
        logger.info(`Using extractor: ${options.extractorType}`);
        logger.info(`File extension: ${options.fileExtension || 'not specified (scanning all files)'}`);
        if (options.fileNames && options.fileNames.length > 0) {
            logger.info(`Files filter: ${options.fileNames.join(', ')}`);
        }
        if (options.pattern) {
            logger.info(`Custom pattern: ${options.pattern}`);
        }
        else {
            logger.info('Custom pattern: none');
        }
        logger.info(`Exit on error: ${options.exitOnError}`);
        // Check if path exists and is accessible
        try {
            await fs.promises.access(scanPath, fs.constants.R_OK);
        }
        catch (error) {
            const errorMsg = `Path ${scanPath} is not accessible: ${error}`;
            logger.error(errorMsg);
            platform.setOutput('error', errorMsg);
            platform.setResult(false, errorMsg);
            return;
        }
        // Run validation
        const results = await validatePolicies(scanPath, options, logger);
        // Set outputs
        platform.setOutput('results', JSON.stringify(results));
        // Determine success/failure
        const hasFailures = results.some(output => !output.isValid);
        if (hasFailures) {
            platform.setResult(!options.exitOnError, 'Policy validation failed');
        }
        else {
            platform.setResult(true, 'Policy validation succeeded');
        }
    }
    catch (error) {
        logger.error(`Error: ${error}`);
        platform.setOutput('error', `${error}`);
        platform.setResult(false, `Error: ${error}`);
    }
}
/**
 * Helper function to resolve path
 * This function checks if the path is absolute or relative
 * If it's relative, it resolves it against the current working directory
 * @param inputPath The input path to resolve
 * @returns The resolved absolute path
 */
function resolvePath(inputPath) {
    if (path.isAbsolute(inputPath)) {
        return inputPath;
    }
    return path.resolve(process.cwd(), inputPath);
}


/***/ }),

/***/ 675:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultExtractionStrategy = void 0;
class DefaultExtractionStrategy {
    /**
     * Extract policy statements from raw text
     */
    extractStatements(raw) {
        if (!raw || raw.trim() === '') {
            return [];
        }
        // Preprocess to fix common issues
        const preprocessed = this.preprocessStatement(raw);
        // Remove HCL comments first
        const uncommentedText = this.removeHclComments(preprocessed);
        // Split the input by commas, properly handling quotes and interpolation
        const statements = this.splitStatements(uncommentedText);
        // Clean and filter each statement
        return statements
            .map(statement => this.cleanStatement(statement))
            .filter(statement => statement && statement.trim() !== '');
    }
    /**
     * Preprocesses statement to fix common issues before extraction
     */
    preprocessStatement(statement) {
        let result = statement;
        // Fix common issues with Terraform string concatenation
        result = result.replace(/"\s*\+\s*"/g, '');
        // Remove extraneous commas inside variable interpolation
        result = result.replace(/(\${[^}]*),\s*([^}]*})/g, '$1 $2');
        return result;
    }
    /**
     * Remove HCL comments (# and //) from the text
     */
    removeHclComments(text) {
        // Process line by line to properly handle comments
        return text.split('\n')
            .map(line => {
            // Find comment position, but ignore inside quotes
            let inQuote = false;
            let quoteChar = '';
            let commentPos = -1;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = i < line.length - 1 ? line[i + 1] : '';
                // Toggle quote state (handling escaped quotes)
                if ((char === '"' || char === "'") && (i === 0 || line[i - 1] !== '\\')) {
                    if (!inQuote) {
                        inQuote = true;
                        quoteChar = char;
                    }
                    else if (char === quoteChar) {
                        inQuote = false;
                    }
                }
                // Find comment start (but not inside quotes)
                if (!inQuote && (char === '#' || (char === '/' && nextChar === '/'))) {
                    commentPos = i;
                    break;
                }
            }
            // Remove comment if found
            return commentPos >= 0 ? line.substring(0, commentPos).trim() : line;
        })
            .filter(line => line.trim() !== '') // Remove empty lines
            .join(' '); // Join with spaces instead of newlines
    }
    /**
     * Split a statement string by commas, properly handling quoted content and interpolation
     */
    splitStatements(text) {
        // If there are no commas, return the whole text as a single statement
        if (!text.includes(',')) {
            return [text];
        }
        const results = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';
        let braceLevel = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            // Handle quotes
            if ((char === '"' || char === "'") && (i === 0 || text.charAt(i - 1) !== '\\')) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                }
                else if (char === quoteChar) {
                    inQuote = false;
                }
            }
            // Track interpolation blocks ${...}
            if (char === '{' && i > 0 && text.charAt(i - 1) === '$') {
                braceLevel++;
            }
            else if (char === '}' && braceLevel > 0) {
                braceLevel--;
            }
            // Only split on commas outside of quotes and interpolation blocks
            if (char === ',' && !inQuote && braceLevel === 0) {
                results.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        // Add the final segment
        if (current.trim()) {
            results.push(current.trim());
        }
        return results;
    }
    /**
     * Clean a statement by removing quotes and extra whitespace
     */
    cleanStatement(statement) {
        if (!statement)
            return '';
        let result = statement.trim();
        // Remove surrounding quotes if present
        if ((result.startsWith('"') && result.endsWith('"')) ||
            (result.startsWith("'") && result.endsWith("'"))) {
            result = result.substring(1, result.length - 1).trim();
        }
        return result;
    }
}
exports.DefaultExtractionStrategy = DefaultExtractionStrategy;


/***/ }),

/***/ 727:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtractorFactory = void 0;
const RegexPolicyExtractor_1 = __nccwpck_require__(307);
class ExtractorFactory {
    static create(type = 'regex', options) {
        switch (type) {
            case 'regex':
                return new RegexPolicyExtractor_1.RegexPolicyExtractor(options === null || options === void 0 ? void 0 : options.pattern, options === null || options === void 0 ? void 0 : options.extractionStrategy);
            default:
                throw new Error(`Unsupported extractor type: ${type}`);
        }
    }
}
exports.ExtractorFactory = ExtractorFactory;


/***/ }),

/***/ 307:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegexPolicyExtractor = void 0;
const DefaultExtractionStrategy_1 = __nccwpck_require__(675);
const types_1 = __nccwpck_require__(164);
class RegexPolicyExtractor {
    constructor(pattern, extractionStrategy) {
        // Use existing pattern from types.ts or build a new one from the provided pattern
        this.pattern = pattern
            ? new RegExp(pattern, 'sgi')
            : types_1.POLICY_STATEMENTS_REGEX;
        this.extractionStrategy = extractionStrategy || new DefaultExtractionStrategy_1.DefaultExtractionStrategy();
    }
    extract(text) {
        if (!text || text.trim() === '') {
            return [];
        }
        // With global flag, matchAll returns an iterator of all matches
        const matches = Array.from(text.matchAll(this.pattern));
        if (!matches || matches.length === 0) {
            return [];
        }
        // Get raw statements from regex matches and delegate all processing to the strategy
        return matches
            .map(match => match[1]) // Get capturing group from each match
            .filter(Boolean) // Remove any undefined/null matches
            .flatMap(statement => this.extractionStrategy.extractStatements(statement))
            .filter(s => s && s.trim() !== '');
    }
    name() {
        return 'regex';
    }
}
exports.RegexPolicyExtractor = RegexPolicyExtractor;


/***/ }),

/***/ 612:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Generated from Policy.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
const antlr4_1 = __nccwpck_require__(370);
class PolicyLexer extends antlr4_1.Lexer {
    constructor(input) {
        super(input);
        this._interp = new antlr4_1.LexerATNSimulator(this, PolicyLexer._ATN, PolicyLexer.DecisionsToDFA, new antlr4_1.PredictionContextCache());
    }
    get grammarFileName() { return "Policy.g4"; }
    get literalNames() { return PolicyLexer.literalNames; }
    get symbolicNames() { return PolicyLexer.symbolicNames; }
    get ruleNames() { return PolicyLexer.ruleNames; }
    get serializedATN() { return PolicyLexer._serializedATN; }
    get channelNames() { return PolicyLexer.channelNames; }
    get modeNames() { return PolicyLexer.modeNames; }
    static get _ATN() {
        if (!PolicyLexer.__ATN) {
            PolicyLexer.__ATN = new antlr4_1.ATNDeserializer().deserialize(PolicyLexer._serializedATN);
        }
        return PolicyLexer.__ATN;
    }
}
PolicyLexer.T__0 = 1;
PolicyLexer.T__1 = 2;
PolicyLexer.T__2 = 3;
PolicyLexer.T__3 = 4;
PolicyLexer.T__4 = 5;
PolicyLexer.T__5 = 6;
PolicyLexer.T__6 = 7;
PolicyLexer.T__7 = 8;
PolicyLexer.T__8 = 9;
PolicyLexer.T__9 = 10;
PolicyLexer.T__10 = 11;
PolicyLexer.T__11 = 12;
PolicyLexer.T__12 = 13;
PolicyLexer.BEFORE = 14;
PolicyLexer.BETWEEN = 15;
PolicyLexer.NEWLINE = 16;
PolicyLexer.QUOTED_STRING = 17;
PolicyLexer.WS = 18;
PolicyLexer.ANYUSER = 19;
PolicyLexer.ANYTENANCY = 20;
PolicyLexer.ENDORSE = 21;
PolicyLexer.ALLOW = 22;
PolicyLexer.DEFINE = 23;
PolicyLexer.RESOURCE = 24;
PolicyLexer.TO = 25;
PolicyLexer.OF = 26;
PolicyLexer.IN = 27;
PolicyLexer.WHERE = 28;
PolicyLexer.WITH = 29;
PolicyLexer.DYNAMICGROUP = 30;
PolicyLexer.GROUP = 31;
PolicyLexer.SERVICE = 32;
PolicyLexer.COMPARTMENT = 33;
PolicyLexer.TENANCY = 34;
PolicyLexer.READ = 35;
PolicyLexer.INSPECT = 36;
PolicyLexer.MANAGE = 37;
PolicyLexer.ASSOCIATE = 38;
PolicyLexer.ADMIT = 39;
PolicyLexer.USE = 40;
PolicyLexer.ANY = 41;
PolicyLexer.AND = 42;
PolicyLexer.ALL = 43;
PolicyLexer.AS = 44;
PolicyLexer.ID = 45;
PolicyLexer.HCL_VAR = 46;
PolicyLexer.WORD = 47;
PolicyLexer.EOF = antlr4_1.Token.EOF;
PolicyLexer.channelNames = ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"];
PolicyLexer.literalNames = [null, "'{'",
    "','", "'}'",
    "':'", "'/'",
    "'''", "'.'",
    "'='", "'!'",
    "'('", "')'",
    "'*/'", "'/*'"];
PolicyLexer.symbolicNames = [null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    "BEFORE", "BETWEEN",
    "NEWLINE",
    "QUOTED_STRING",
    "WS", "ANYUSER",
    "ANYTENANCY",
    "ENDORSE",
    "ALLOW", "DEFINE",
    "RESOURCE",
    "TO", "OF",
    "IN", "WHERE",
    "WITH", "DYNAMICGROUP",
    "GROUP", "SERVICE",
    "COMPARTMENT",
    "TENANCY",
    "READ", "INSPECT",
    "MANAGE", "ASSOCIATE",
    "ADMIT", "USE",
    "ANY", "AND",
    "ALL", "AS",
    "ID", "HCL_VAR",
    "WORD"];
PolicyLexer.modeNames = ["DEFAULT_MODE",];
PolicyLexer.ruleNames = [
    "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8",
    "T__9", "T__10", "T__11", "T__12", "BEFORE", "BETWEEN", "NEWLINE", "QUOTED_STRING",
    "WS", "ANYUSER", "ANYTENANCY", "ENDORSE", "ALLOW", "DEFINE", "RESOURCE",
    "TO", "OF", "IN", "WHERE", "WITH", "DYNAMICGROUP", "GROUP", "SERVICE",
    "COMPARTMENT", "TENANCY", "READ", "INSPECT", "MANAGE", "ASSOCIATE", "ADMIT",
    "USE", "ANY", "AND", "ALL", "AS", "ID", "HCL_VAR", "WORD", "LETTER", "DIGIT",
    "A", "L", "O", "W", "I", "N", "T", "E", "R", "H", "U", "P", "S", "V",
    "C", "D", "M", "G", "Y", "F", "B",
];
PolicyLexer._serializedATN = [4, 0, 47, 452, 6, -1, 2, 0,
    7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9,
    7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7,
    16, 2, 17, 7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23,
    2, 24, 7, 24, 2, 25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2,
    31, 7, 31, 2, 32, 7, 32, 2, 33, 7, 33, 2, 34, 7, 34, 2, 35, 7, 35, 2, 36, 7, 36, 2, 37, 7, 37, 2, 38,
    7, 38, 2, 39, 7, 39, 2, 40, 7, 40, 2, 41, 7, 41, 2, 42, 7, 42, 2, 43, 7, 43, 2, 44, 7, 44, 2, 45, 7,
    45, 2, 46, 7, 46, 2, 47, 7, 47, 2, 48, 7, 48, 2, 49, 7, 49, 2, 50, 7, 50, 2, 51, 7, 51, 2, 52, 7, 52,
    2, 53, 7, 53, 2, 54, 7, 54, 2, 55, 7, 55, 2, 56, 7, 56, 2, 57, 7, 57, 2, 58, 7, 58, 2, 59, 7, 59, 2,
    60, 7, 60, 2, 61, 7, 61, 2, 62, 7, 62, 2, 63, 7, 63, 2, 64, 7, 64, 2, 65, 7, 65, 2, 66, 7, 66, 2, 67,
    7, 67, 2, 68, 7, 68, 2, 69, 7, 69, 1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 3, 1, 4, 1, 4, 1, 5, 1,
    5, 1, 6, 1, 6, 1, 7, 1, 7, 1, 8, 1, 8, 1, 9, 1, 9, 1, 10, 1, 10, 1, 11, 1, 11, 1, 11, 1, 12, 1, 12, 1,
    12, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14,
    1, 14, 1, 15, 3, 15, 186, 8, 15, 1, 15, 1, 15, 4, 15, 190, 8, 15, 11, 15, 12, 15, 191, 1, 15, 1,
    15, 1, 16, 1, 16, 1, 16, 1, 16, 4, 16, 200, 8, 16, 11, 16, 12, 16, 201, 1, 16, 1, 16, 1, 17, 4, 17,
    207, 8, 17, 11, 17, 12, 17, 208, 1, 17, 1, 17, 1, 18, 1, 18, 1, 18, 1, 18, 1, 18, 1, 18, 1, 18, 1,
    18, 1, 18, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 19, 1, 20,
    1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 20, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 21, 1, 22, 1,
    22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 22, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23, 1, 23,
    1, 24, 1, 24, 1, 24, 1, 25, 1, 25, 1, 25, 1, 26, 1, 26, 1, 26, 1, 27, 1, 27, 1, 27, 1, 27, 1, 27, 1,
    27, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29,
    1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 31, 1, 31, 1, 31, 1,
    31, 1, 31, 1, 31, 1, 31, 1, 31, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32,
    1, 32, 1, 32, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 33, 1, 34, 1, 34, 1, 34, 1, 34, 1,
    34, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 35, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36, 1, 36,
    1, 36, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 37, 1, 38, 1, 38, 1, 38, 1,
    38, 1, 38, 1, 38, 1, 39, 1, 39, 1, 39, 1, 39, 1, 40, 1, 40, 1, 40, 1, 40, 1, 41, 1, 41, 1, 41, 1, 41,
    1, 42, 1, 42, 1, 42, 1, 42, 1, 43, 1, 43, 1, 43, 1, 44, 1, 44, 1, 44, 1, 45, 1, 45, 1, 45, 1, 45, 4,
    45, 394, 8, 45, 11, 45, 12, 45, 395, 1, 45, 1, 45, 1, 46, 1, 46, 1, 46, 4, 46, 403, 8, 46, 11, 46,
    12, 46, 404, 1, 47, 1, 47, 1, 48, 1, 48, 1, 49, 1, 49, 1, 50, 1, 50, 1, 51, 1, 51, 1, 52, 1, 52, 1,
    53, 1, 53, 1, 54, 1, 54, 1, 55, 1, 55, 1, 56, 1, 56, 1, 57, 1, 57, 1, 58, 1, 58, 1, 59, 1, 59, 1, 60,
    1, 60, 1, 61, 1, 61, 1, 62, 1, 62, 1, 63, 1, 63, 1, 64, 1, 64, 1, 65, 1, 65, 1, 66, 1, 66, 1, 67, 1,
    67, 1, 68, 1, 68, 1, 69, 1, 69, 0, 0, 70, 1, 1, 3, 2, 5, 3, 7, 4, 9, 5, 11, 6, 13, 7, 15, 8, 17, 9, 19,
    10, 21, 11, 23, 12, 25, 13, 27, 14, 29, 15, 31, 16, 33, 17, 35, 18, 37, 19, 39, 20, 41, 21, 43,
    22, 45, 23, 47, 24, 49, 25, 51, 26, 53, 27, 55, 28, 57, 29, 59, 30, 61, 31, 63, 32, 65, 33, 67,
    34, 69, 35, 71, 36, 73, 37, 75, 38, 77, 39, 79, 40, 81, 41, 83, 42, 85, 43, 87, 44, 89, 45, 91,
    46, 93, 47, 95, 0, 97, 0, 99, 0, 101, 0, 103, 0, 105, 0, 107, 0, 109, 0, 111, 0, 113, 0, 115, 0,
    117, 0, 119, 0, 121, 0, 123, 0, 125, 0, 127, 0, 129, 0, 131, 0, 133, 0, 135, 0, 137, 0, 139, 0,
    1, 0, 26, 5, 0, 32, 32, 45, 47, 58, 58, 64, 64, 95, 95, 1, 0, 125, 125, 4, 0, 45, 46, 58, 58, 64,
    64, 95, 95, 2, 0, 65, 90, 97, 122, 1, 0, 48, 57, 2, 0, 65, 65, 97, 97, 2, 0, 76, 76, 108, 108, 2,
    0, 79, 79, 111, 111, 2, 0, 87, 87, 119, 119, 2, 0, 73, 73, 105, 105, 2, 0, 78, 78, 110, 110, 2,
    0, 84, 84, 116, 116, 2, 0, 69, 69, 101, 101, 2, 0, 82, 82, 114, 114, 2, 0, 72, 72, 104, 104, 2,
    0, 85, 85, 117, 117, 2, 0, 80, 80, 112, 112, 2, 0, 83, 83, 115, 115, 2, 0, 86, 86, 118, 118, 2,
    0, 67, 67, 99, 99, 2, 0, 68, 68, 100, 100, 2, 0, 77, 77, 109, 109, 2, 0, 71, 71, 103, 103, 2, 0,
    89, 89, 121, 121, 2, 0, 70, 70, 102, 102, 2, 0, 66, 66, 98, 98, 439, 0, 1, 1, 0, 0, 0, 0, 3, 1, 0,
    0, 0, 0, 5, 1, 0, 0, 0, 0, 7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0, 0, 0, 13, 1, 0, 0, 0, 0, 15,
    1, 0, 0, 0, 0, 17, 1, 0, 0, 0, 0, 19, 1, 0, 0, 0, 0, 21, 1, 0, 0, 0, 0, 23, 1, 0, 0, 0, 0, 25, 1, 0, 0,
    0, 0, 27, 1, 0, 0, 0, 0, 29, 1, 0, 0, 0, 0, 31, 1, 0, 0, 0, 0, 33, 1, 0, 0, 0, 0, 35, 1, 0, 0, 0, 0, 37,
    1, 0, 0, 0, 0, 39, 1, 0, 0, 0, 0, 41, 1, 0, 0, 0, 0, 43, 1, 0, 0, 0, 0, 45, 1, 0, 0, 0, 0, 47, 1, 0, 0,
    0, 0, 49, 1, 0, 0, 0, 0, 51, 1, 0, 0, 0, 0, 53, 1, 0, 0, 0, 0, 55, 1, 0, 0, 0, 0, 57, 1, 0, 0, 0, 0, 59,
    1, 0, 0, 0, 0, 61, 1, 0, 0, 0, 0, 63, 1, 0, 0, 0, 0, 65, 1, 0, 0, 0, 0, 67, 1, 0, 0, 0, 0, 69, 1, 0, 0,
    0, 0, 71, 1, 0, 0, 0, 0, 73, 1, 0, 0, 0, 0, 75, 1, 0, 0, 0, 0, 77, 1, 0, 0, 0, 0, 79, 1, 0, 0, 0, 0, 81,
    1, 0, 0, 0, 0, 83, 1, 0, 0, 0, 0, 85, 1, 0, 0, 0, 0, 87, 1, 0, 0, 0, 0, 89, 1, 0, 0, 0, 0, 91, 1, 0, 0,
    0, 0, 93, 1, 0, 0, 0, 1, 141, 1, 0, 0, 0, 3, 143, 1, 0, 0, 0, 5, 145, 1, 0, 0, 0, 7, 147, 1, 0, 0, 0,
    9, 149, 1, 0, 0, 0, 11, 151, 1, 0, 0, 0, 13, 153, 1, 0, 0, 0, 15, 155, 1, 0, 0, 0, 17, 157, 1, 0, 0,
    0, 19, 159, 1, 0, 0, 0, 21, 161, 1, 0, 0, 0, 23, 163, 1, 0, 0, 0, 25, 166, 1, 0, 0, 0, 27, 169, 1,
    0, 0, 0, 29, 176, 1, 0, 0, 0, 31, 189, 1, 0, 0, 0, 33, 195, 1, 0, 0, 0, 35, 206, 1, 0, 0, 0, 37, 212,
    1, 0, 0, 0, 39, 221, 1, 0, 0, 0, 41, 233, 1, 0, 0, 0, 43, 241, 1, 0, 0, 0, 45, 247, 1, 0, 0, 0, 47,
    254, 1, 0, 0, 0, 49, 263, 1, 0, 0, 0, 51, 266, 1, 0, 0, 0, 53, 269, 1, 0, 0, 0, 55, 272, 1, 0, 0, 0,
    57, 278, 1, 0, 0, 0, 59, 283, 1, 0, 0, 0, 61, 297, 1, 0, 0, 0, 63, 303, 1, 0, 0, 0, 65, 311, 1, 0,
    0, 0, 67, 323, 1, 0, 0, 0, 69, 331, 1, 0, 0, 0, 71, 336, 1, 0, 0, 0, 73, 344, 1, 0, 0, 0, 75, 351,
    1, 0, 0, 0, 77, 361, 1, 0, 0, 0, 79, 367, 1, 0, 0, 0, 81, 371, 1, 0, 0, 0, 83, 375, 1, 0, 0, 0, 85,
    379, 1, 0, 0, 0, 87, 383, 1, 0, 0, 0, 89, 386, 1, 0, 0, 0, 91, 389, 1, 0, 0, 0, 93, 402, 1, 0, 0, 0,
    95, 406, 1, 0, 0, 0, 97, 408, 1, 0, 0, 0, 99, 410, 1, 0, 0, 0, 101, 412, 1, 0, 0, 0, 103, 414, 1,
    0, 0, 0, 105, 416, 1, 0, 0, 0, 107, 418, 1, 0, 0, 0, 109, 420, 1, 0, 0, 0, 111, 422, 1, 0, 0, 0, 113,
    424, 1, 0, 0, 0, 115, 426, 1, 0, 0, 0, 117, 428, 1, 0, 0, 0, 119, 430, 1, 0, 0, 0, 121, 432, 1, 0,
    0, 0, 123, 434, 1, 0, 0, 0, 125, 436, 1, 0, 0, 0, 127, 438, 1, 0, 0, 0, 129, 440, 1, 0, 0, 0, 131,
    442, 1, 0, 0, 0, 133, 444, 1, 0, 0, 0, 135, 446, 1, 0, 0, 0, 137, 448, 1, 0, 0, 0, 139, 450, 1, 0,
    0, 0, 141, 142, 5, 123, 0, 0, 142, 2, 1, 0, 0, 0, 143, 144, 5, 44, 0, 0, 144, 4, 1, 0, 0, 0, 145,
    146, 5, 125, 0, 0, 146, 6, 1, 0, 0, 0, 147, 148, 5, 58, 0, 0, 148, 8, 1, 0, 0, 0, 149, 150, 5, 47,
    0, 0, 150, 10, 1, 0, 0, 0, 151, 152, 5, 39, 0, 0, 152, 12, 1, 0, 0, 0, 153, 154, 5, 46, 0, 0, 154,
    14, 1, 0, 0, 0, 155, 156, 5, 61, 0, 0, 156, 16, 1, 0, 0, 0, 157, 158, 5, 33, 0, 0, 158, 18, 1, 0,
    0, 0, 159, 160, 5, 40, 0, 0, 160, 20, 1, 0, 0, 0, 161, 162, 5, 41, 0, 0, 162, 22, 1, 0, 0, 0, 163,
    164, 5, 42, 0, 0, 164, 165, 5, 47, 0, 0, 165, 24, 1, 0, 0, 0, 166, 167, 5, 47, 0, 0, 167, 168, 5,
    42, 0, 0, 168, 26, 1, 0, 0, 0, 169, 170, 3, 139, 69, 0, 170, 171, 3, 113, 56, 0, 171, 172, 3, 137,
    68, 0, 172, 173, 3, 103, 51, 0, 173, 174, 3, 115, 57, 0, 174, 175, 3, 113, 56, 0, 175, 28, 1,
    0, 0, 0, 176, 177, 3, 139, 69, 0, 177, 178, 3, 113, 56, 0, 178, 179, 3, 111, 55, 0, 179, 180,
    3, 105, 52, 0, 180, 181, 3, 113, 56, 0, 181, 182, 3, 113, 56, 0, 182, 183, 3, 109, 54, 0, 183,
    30, 1, 0, 0, 0, 184, 186, 5, 13, 0, 0, 185, 184, 1, 0, 0, 0, 185, 186, 1, 0, 0, 0, 186, 187, 1, 0,
    0, 0, 187, 190, 5, 10, 0, 0, 188, 190, 5, 13, 0, 0, 189, 185, 1, 0, 0, 0, 189, 188, 1, 0, 0, 0, 190,
    191, 1, 0, 0, 0, 191, 189, 1, 0, 0, 0, 191, 192, 1, 0, 0, 0, 192, 193, 1, 0, 0, 0, 193, 194, 6, 15,
    0, 0, 194, 32, 1, 0, 0, 0, 195, 199, 5, 39, 0, 0, 196, 200, 3, 95, 47, 0, 197, 200, 3, 97, 48, 0,
    198, 200, 7, 0, 0, 0, 199, 196, 1, 0, 0, 0, 199, 197, 1, 0, 0, 0, 199, 198, 1, 0, 0, 0, 200, 201,
    1, 0, 0, 0, 201, 199, 1, 0, 0, 0, 201, 202, 1, 0, 0, 0, 202, 203, 1, 0, 0, 0, 203, 204, 5, 39, 0,
    0, 204, 34, 1, 0, 0, 0, 205, 207, 5, 32, 0, 0, 206, 205, 1, 0, 0, 0, 207, 208, 1, 0, 0, 0, 208, 206,
    1, 0, 0, 0, 208, 209, 1, 0, 0, 0, 209, 210, 1, 0, 0, 0, 210, 211, 6, 17, 0, 0, 211, 36, 1, 0, 0, 0,
    212, 213, 3, 99, 49, 0, 213, 214, 3, 109, 54, 0, 214, 215, 3, 135, 67, 0, 215, 216, 5, 45, 0,
    0, 216, 217, 3, 119, 59, 0, 217, 218, 3, 123, 61, 0, 218, 219, 3, 113, 56, 0, 219, 220, 3, 115,
    57, 0, 220, 38, 1, 0, 0, 0, 221, 222, 3, 99, 49, 0, 222, 223, 3, 109, 54, 0, 223, 224, 3, 135,
    67, 0, 224, 225, 5, 45, 0, 0, 225, 226, 3, 111, 55, 0, 226, 227, 3, 113, 56, 0, 227, 228, 3, 109,
    54, 0, 228, 229, 3, 99, 49, 0, 229, 230, 3, 109, 54, 0, 230, 231, 3, 127, 63, 0, 231, 232, 3,
    135, 67, 0, 232, 40, 1, 0, 0, 0, 233, 234, 3, 113, 56, 0, 234, 235, 3, 109, 54, 0, 235, 236, 3,
    129, 64, 0, 236, 237, 3, 103, 51, 0, 237, 238, 3, 115, 57, 0, 238, 239, 3, 123, 61, 0, 239, 240,
    3, 113, 56, 0, 240, 42, 1, 0, 0, 0, 241, 242, 3, 99, 49, 0, 242, 243, 3, 101, 50, 0, 243, 244,
    3, 101, 50, 0, 244, 245, 3, 103, 51, 0, 245, 246, 3, 105, 52, 0, 246, 44, 1, 0, 0, 0, 247, 248,
    3, 129, 64, 0, 248, 249, 3, 113, 56, 0, 249, 250, 3, 137, 68, 0, 250, 251, 3, 107, 53, 0, 251,
    252, 3, 109, 54, 0, 252, 253, 3, 113, 56, 0, 253, 46, 1, 0, 0, 0, 254, 255, 3, 115, 57, 0, 255,
    256, 3, 113, 56, 0, 256, 257, 3, 123, 61, 0, 257, 258, 3, 103, 51, 0, 258, 259, 3, 119, 59, 0,
    259, 260, 3, 115, 57, 0, 260, 261, 3, 127, 63, 0, 261, 262, 3, 113, 56, 0, 262, 48, 1, 0, 0, 0,
    263, 264, 3, 111, 55, 0, 264, 265, 3, 103, 51, 0, 265, 50, 1, 0, 0, 0, 266, 267, 3, 103, 51, 0,
    267, 268, 3, 137, 68, 0, 268, 52, 1, 0, 0, 0, 269, 270, 3, 107, 53, 0, 270, 271, 3, 109, 54, 0,
    271, 54, 1, 0, 0, 0, 272, 273, 3, 105, 52, 0, 273, 274, 3, 117, 58, 0, 274, 275, 3, 113, 56, 0,
    275, 276, 3, 115, 57, 0, 276, 277, 3, 113, 56, 0, 277, 56, 1, 0, 0, 0, 278, 279, 3, 105, 52, 0,
    279, 280, 3, 107, 53, 0, 280, 281, 3, 111, 55, 0, 281, 282, 3, 117, 58, 0, 282, 58, 1, 0, 0, 0,
    283, 284, 3, 129, 64, 0, 284, 285, 3, 135, 67, 0, 285, 286, 3, 109, 54, 0, 286, 287, 3, 99, 49,
    0, 287, 288, 3, 131, 65, 0, 288, 289, 3, 107, 53, 0, 289, 290, 3, 127, 63, 0, 290, 291, 5, 45,
    0, 0, 291, 292, 3, 133, 66, 0, 292, 293, 3, 115, 57, 0, 293, 294, 3, 103, 51, 0, 294, 295, 3,
    119, 59, 0, 295, 296, 3, 121, 60, 0, 296, 60, 1, 0, 0, 0, 297, 298, 3, 133, 66, 0, 298, 299, 3,
    115, 57, 0, 299, 300, 3, 103, 51, 0, 300, 301, 3, 119, 59, 0, 301, 302, 3, 121, 60, 0, 302, 62,
    1, 0, 0, 0, 303, 304, 3, 123, 61, 0, 304, 305, 3, 113, 56, 0, 305, 306, 3, 115, 57, 0, 306, 307,
    3, 125, 62, 0, 307, 308, 3, 107, 53, 0, 308, 309, 3, 127, 63, 0, 309, 310, 3, 113, 56, 0, 310,
    64, 1, 0, 0, 0, 311, 312, 3, 127, 63, 0, 312, 313, 3, 103, 51, 0, 313, 314, 3, 131, 65, 0, 314,
    315, 3, 121, 60, 0, 315, 316, 3, 99, 49, 0, 316, 317, 3, 115, 57, 0, 317, 318, 3, 111, 55, 0,
    318, 319, 3, 131, 65, 0, 319, 320, 3, 113, 56, 0, 320, 321, 3, 109, 54, 0, 321, 322, 3, 111,
    55, 0, 322, 66, 1, 0, 0, 0, 323, 324, 3, 111, 55, 0, 324, 325, 3, 113, 56, 0, 325, 326, 3, 109,
    54, 0, 326, 327, 3, 99, 49, 0, 327, 328, 3, 109, 54, 0, 328, 329, 3, 127, 63, 0, 329, 330, 3,
    135, 67, 0, 330, 68, 1, 0, 0, 0, 331, 332, 3, 115, 57, 0, 332, 333, 3, 113, 56, 0, 333, 334, 3,
    99, 49, 0, 334, 335, 3, 129, 64, 0, 335, 70, 1, 0, 0, 0, 336, 337, 3, 107, 53, 0, 337, 338, 3,
    109, 54, 0, 338, 339, 3, 123, 61, 0, 339, 340, 3, 121, 60, 0, 340, 341, 3, 113, 56, 0, 341, 342,
    3, 127, 63, 0, 342, 343, 3, 111, 55, 0, 343, 72, 1, 0, 0, 0, 344, 345, 3, 131, 65, 0, 345, 346,
    3, 99, 49, 0, 346, 347, 3, 109, 54, 0, 347, 348, 3, 99, 49, 0, 348, 349, 3, 133, 66, 0, 349, 350,
    3, 113, 56, 0, 350, 74, 1, 0, 0, 0, 351, 352, 3, 99, 49, 0, 352, 353, 3, 123, 61, 0, 353, 354,
    3, 123, 61, 0, 354, 355, 3, 103, 51, 0, 355, 356, 3, 127, 63, 0, 356, 357, 3, 107, 53, 0, 357,
    358, 3, 99, 49, 0, 358, 359, 3, 111, 55, 0, 359, 360, 3, 113, 56, 0, 360, 76, 1, 0, 0, 0, 361,
    362, 3, 99, 49, 0, 362, 363, 3, 129, 64, 0, 363, 364, 3, 131, 65, 0, 364, 365, 3, 107, 53, 0,
    365, 366, 3, 111, 55, 0, 366, 78, 1, 0, 0, 0, 367, 368, 3, 119, 59, 0, 368, 369, 3, 123, 61, 0,
    369, 370, 3, 113, 56, 0, 370, 80, 1, 0, 0, 0, 371, 372, 3, 99, 49, 0, 372, 373, 3, 109, 54, 0,
    373, 374, 3, 135, 67, 0, 374, 82, 1, 0, 0, 0, 375, 376, 3, 99, 49, 0, 376, 377, 3, 109, 54, 0,
    377, 378, 3, 129, 64, 0, 378, 84, 1, 0, 0, 0, 379, 380, 3, 99, 49, 0, 380, 381, 3, 101, 50, 0,
    381, 382, 3, 101, 50, 0, 382, 86, 1, 0, 0, 0, 383, 384, 3, 99, 49, 0, 384, 385, 3, 123, 61, 0,
    385, 88, 1, 0, 0, 0, 386, 387, 3, 107, 53, 0, 387, 388, 3, 129, 64, 0, 388, 90, 1, 0, 0, 0, 389,
    390, 5, 36, 0, 0, 390, 391, 5, 123, 0, 0, 391, 393, 1, 0, 0, 0, 392, 394, 8, 1, 0, 0, 393, 392,
    1, 0, 0, 0, 394, 395, 1, 0, 0, 0, 395, 393, 1, 0, 0, 0, 395, 396, 1, 0, 0, 0, 396, 397, 1, 0, 0, 0,
    397, 398, 5, 125, 0, 0, 398, 92, 1, 0, 0, 0, 399, 403, 3, 95, 47, 0, 400, 403, 3, 97, 48, 0, 401,
    403, 7, 2, 0, 0, 402, 399, 1, 0, 0, 0, 402, 400, 1, 0, 0, 0, 402, 401, 1, 0, 0, 0, 403, 404, 1, 0,
    0, 0, 404, 402, 1, 0, 0, 0, 404, 405, 1, 0, 0, 0, 405, 94, 1, 0, 0, 0, 406, 407, 7, 3, 0, 0, 407,
    96, 1, 0, 0, 0, 408, 409, 7, 4, 0, 0, 409, 98, 1, 0, 0, 0, 410, 411, 7, 5, 0, 0, 411, 100, 1, 0, 0,
    0, 412, 413, 7, 6, 0, 0, 413, 102, 1, 0, 0, 0, 414, 415, 7, 7, 0, 0, 415, 104, 1, 0, 0, 0, 416, 417,
    7, 8, 0, 0, 417, 106, 1, 0, 0, 0, 418, 419, 7, 9, 0, 0, 419, 108, 1, 0, 0, 0, 420, 421, 7, 10, 0,
    0, 421, 110, 1, 0, 0, 0, 422, 423, 7, 11, 0, 0, 423, 112, 1, 0, 0, 0, 424, 425, 7, 12, 0, 0, 425,
    114, 1, 0, 0, 0, 426, 427, 7, 13, 0, 0, 427, 116, 1, 0, 0, 0, 428, 429, 7, 14, 0, 0, 429, 118, 1,
    0, 0, 0, 430, 431, 7, 15, 0, 0, 431, 120, 1, 0, 0, 0, 432, 433, 7, 16, 0, 0, 433, 122, 1, 0, 0, 0,
    434, 435, 7, 17, 0, 0, 435, 124, 1, 0, 0, 0, 436, 437, 7, 18, 0, 0, 437, 126, 1, 0, 0, 0, 438, 439,
    7, 19, 0, 0, 439, 128, 1, 0, 0, 0, 440, 441, 7, 20, 0, 0, 441, 130, 1, 0, 0, 0, 442, 443, 7, 21,
    0, 0, 443, 132, 1, 0, 0, 0, 444, 445, 7, 22, 0, 0, 445, 134, 1, 0, 0, 0, 446, 447, 7, 23, 0, 0, 447,
    136, 1, 0, 0, 0, 448, 449, 7, 24, 0, 0, 449, 138, 1, 0, 0, 0, 450, 451, 7, 25, 0, 0, 451, 140, 1,
    0, 0, 0, 10, 0, 185, 189, 191, 199, 201, 208, 395, 402, 404, 1, 6, 0, 0];
PolicyLexer.DecisionsToDFA = PolicyLexer._ATN.decisionToState.map((ds, index) => new antlr4_1.DFA(ds, index));
exports["default"] = PolicyLexer;


/***/ }),

/***/ 597:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// Generated from Policy.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatternMatchContext = exports.LogicalCombineContext = exports.ComparisonListContext = exports.TimeWindowContext = exports.ValueListContext = exports.ValueContext = exports.OperatorContext = exports.VariableContext = exports.ComparisonContext = exports.ConditionContext = exports.ResourceContext = exports.DefinedContext = exports.DefinedSubjectContext = exports.TenancySubjectContext = exports.DynamicGroupSubjectContext = exports.GroupIDContext = exports.ServiceSubjectIdContext = exports.ResourceSubjectIdContext = exports.GroupNameContext = exports.ServiceSubjectContext = exports.ResourceSubjectContext = exports.GroupSubjectContext = exports.SubjectContext = exports.EndorseScopeContext = exports.ScopeContext = exports.PermissionListContext = exports.VerbContext = exports.EndorseVerbContext = exports.AdmitExpressionContext = exports.DefineExpressionContext = exports.EndorseExpressionContext = exports.AllowExpressionContext = exports.PolicyContext = void 0;
const antlr4_1 = __nccwpck_require__(370);
class PolicyParser extends antlr4_1.Parser {
    get grammarFileName() { return "Policy.g4"; }
    get literalNames() { return PolicyParser.literalNames; }
    get symbolicNames() { return PolicyParser.symbolicNames; }
    get ruleNames() { return PolicyParser.ruleNames; }
    get serializedATN() { return PolicyParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new antlr4_1.FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new antlr4_1.ParserATNSimulator(this, PolicyParser._ATN, PolicyParser.DecisionsToDFA, new antlr4_1.PredictionContextCache());
    }
    // @RuleVersion(0)
    policy() {
        let localctx = new PolicyContext(this, this._ctx, this.state);
        this.enterRule(localctx, 0, PolicyParser.RULE_policy);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 70;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        this.state = 70;
                        this._errHandler.sync(this);
                        switch (this._input.LA(1)) {
                            case 22:
                                {
                                    this.state = 66;
                                    this.allowExpression();
                                }
                                break;
                            case 21:
                                {
                                    this.state = 67;
                                    this.endorseExpression();
                                }
                                break;
                            case 23:
                                {
                                    this.state = 68;
                                    this.defineExpression();
                                }
                                break;
                            case 39:
                                {
                                    this.state = 69;
                                    this.admitExpression();
                                }
                                break;
                            default:
                                throw new antlr4_1.NoViableAltException(this);
                        }
                    }
                    this.state = 72;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & 262151) !== 0));
                this.state = 74;
                this.match(PolicyParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    allowExpression() {
        let localctx = new AllowExpressionContext(this, this._ctx, this.state);
        this.enterRule(localctx, 2, PolicyParser.RULE_allowExpression);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 76;
                this.match(PolicyParser.ALLOW);
                this.state = 77;
                this.subject();
                this.state = 88;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 4, this._ctx)) {
                    case 1:
                        {
                            this.state = 79;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            if (_la === 25) {
                                {
                                    this.state = 78;
                                    this.match(PolicyParser.TO);
                                }
                            }
                            this.state = 81;
                            this.verb();
                            this.state = 82;
                            this.resource();
                        }
                        break;
                    case 2:
                        {
                            this.state = 85;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            if (_la === 25) {
                                {
                                    this.state = 84;
                                    this.match(PolicyParser.TO);
                                }
                            }
                            this.state = 87;
                            this.permissionList();
                        }
                        break;
                }
                this.state = 90;
                this.match(PolicyParser.IN);
                this.state = 91;
                this.scope();
                this.state = 94;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 28) {
                    {
                        this.state = 92;
                        this.match(PolicyParser.WHERE);
                        this.state = 93;
                        this.condition();
                    }
                }
                this.state = 97;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 16) {
                    {
                        this.state = 96;
                        this.match(PolicyParser.NEWLINE);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    endorseExpression() {
        let localctx = new EndorseExpressionContext(this, this._ctx, this.state);
        this.enterRule(localctx, 4, PolicyParser.RULE_endorseExpression);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 99;
                this.match(PolicyParser.ENDORSE);
                this.state = 100;
                this.subject();
                this.state = 109;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 8, this._ctx)) {
                    case 1:
                        {
                            this.state = 101;
                            this.match(PolicyParser.TO);
                            this.state = 102;
                            this.endorseVerb();
                            this.state = 103;
                            this.resource();
                        }
                        break;
                    case 2:
                        {
                            this.state = 106;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            if (_la === 25) {
                                {
                                    this.state = 105;
                                    this.match(PolicyParser.TO);
                                }
                            }
                            this.state = 108;
                            this.permissionList();
                        }
                        break;
                }
                this.state = 111;
                this.match(PolicyParser.IN);
                this.state = 119;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 9, this._ctx)) {
                    case 1:
                        {
                            this.state = 112;
                            this.endorseScope();
                        }
                        break;
                    case 2:
                        {
                            {
                                this.state = 113;
                                this.scope();
                                this.state = 114;
                                this.match(PolicyParser.WITH);
                                this.state = 115;
                                this.resource();
                                this.state = 116;
                                this.match(PolicyParser.IN);
                                this.state = 117;
                                this.endorseScope();
                            }
                        }
                        break;
                }
                this.state = 123;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 28) {
                    {
                        this.state = 121;
                        this.match(PolicyParser.WHERE);
                        this.state = 122;
                        this.condition();
                    }
                }
                this.state = 126;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 16) {
                    {
                        this.state = 125;
                        this.match(PolicyParser.NEWLINE);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    defineExpression() {
        let localctx = new DefineExpressionContext(this, this._ctx, this.state);
        this.enterRule(localctx, 6, PolicyParser.RULE_defineExpression);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 128;
                this.match(PolicyParser.DEFINE);
                this.state = 129;
                this.definedSubject();
                this.state = 130;
                this.match(PolicyParser.AS);
                this.state = 131;
                this.defined();
                this.state = 133;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 16) {
                    {
                        this.state = 132;
                        this.match(PolicyParser.NEWLINE);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    admitExpression() {
        let localctx = new AdmitExpressionContext(this, this._ctx, this.state);
        this.enterRule(localctx, 8, PolicyParser.RULE_admitExpression);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 135;
                this.match(PolicyParser.ADMIT);
                this.state = 136;
                this.subject();
                this.state = 139;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 26) {
                    {
                        this.state = 137;
                        this.match(PolicyParser.OF);
                        this.state = 138;
                        this.endorseScope();
                    }
                }
                this.state = 149;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 15, this._ctx)) {
                    case 1:
                        {
                            this.state = 141;
                            this.match(PolicyParser.TO);
                            this.state = 142;
                            this.endorseVerb();
                            this.state = 143;
                            this.resource();
                        }
                        break;
                    case 2:
                        {
                            this.state = 146;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            if (_la === 25) {
                                {
                                    this.state = 145;
                                    this.match(PolicyParser.TO);
                                }
                            }
                            this.state = 148;
                            this.permissionList();
                        }
                        break;
                }
                this.state = 151;
                this.match(PolicyParser.IN);
                this.state = 152;
                this.scope();
                this.state = 158;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 29) {
                    {
                        this.state = 153;
                        this.match(PolicyParser.WITH);
                        this.state = 154;
                        this.resource();
                        this.state = 155;
                        this.match(PolicyParser.IN);
                        this.state = 156;
                        this.endorseScope();
                    }
                }
                this.state = 162;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 28) {
                    {
                        this.state = 160;
                        this.match(PolicyParser.WHERE);
                        this.state = 161;
                        this.condition();
                    }
                }
                this.state = 165;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 16) {
                    {
                        this.state = 164;
                        this.match(PolicyParser.NEWLINE);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    endorseVerb() {
        let localctx = new EndorseVerbContext(this, this._ctx, this.state);
        this.enterRule(localctx, 10, PolicyParser.RULE_endorseVerb);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 169;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 35:
                    case 36:
                    case 37:
                    case 40:
                        {
                            this.state = 167;
                            this.verb();
                        }
                        break;
                    case 38:
                        {
                            this.state = 168;
                            this.match(PolicyParser.ASSOCIATE);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    verb() {
        let localctx = new VerbContext(this, this._ctx, this.state);
        this.enterRule(localctx, 12, PolicyParser.RULE_verb);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 171;
                _la = this._input.LA(1);
                if (!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & 39) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    permissionList() {
        let localctx = new PermissionListContext(this, this._ctx, this.state);
        this.enterRule(localctx, 14, PolicyParser.RULE_permissionList);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 173;
                this.match(PolicyParser.T__0);
                this.state = 174;
                this.match(PolicyParser.WORD);
                this.state = 179;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 175;
                            this.match(PolicyParser.T__1);
                            this.state = 176;
                            this.match(PolicyParser.WORD);
                        }
                    }
                    this.state = 181;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 182;
                this.match(PolicyParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    scope() {
        let localctx = new ScopeContext(this, this._ctx, this.state);
        this.enterRule(localctx, 16, PolicyParser.RULE_scope);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 197;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 33:
                        {
                            {
                                this.state = 184;
                                this.match(PolicyParser.COMPARTMENT);
                                this.state = 186;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                                if (_la === 45) {
                                    {
                                        this.state = 185;
                                        this.match(PolicyParser.ID);
                                    }
                                }
                            }
                            this.state = 188;
                            _la = this._input.LA(1);
                            if (!(_la === 46 || _la === 47)) {
                                this._errHandler.recoverInline(this);
                            }
                            else {
                                this._errHandler.reportMatch(this);
                                this.consume();
                            }
                            this.state = 193;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            while (_la === 4) {
                                {
                                    {
                                        this.state = 189;
                                        this.match(PolicyParser.T__3);
                                        this.state = 190;
                                        _la = this._input.LA(1);
                                        if (!(_la === 46 || _la === 47)) {
                                            this._errHandler.recoverInline(this);
                                        }
                                        else {
                                            this._errHandler.reportMatch(this);
                                            this.consume();
                                        }
                                    }
                                }
                                this.state = 195;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                            }
                        }
                        break;
                    case 34:
                        {
                            this.state = 196;
                            this.match(PolicyParser.TENANCY);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    endorseScope() {
        let localctx = new EndorseScopeContext(this, this._ctx, this.state);
        this.enterRule(localctx, 18, PolicyParser.RULE_endorseScope);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 202;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 20:
                        {
                            this.state = 199;
                            this.match(PolicyParser.ANYTENANCY);
                        }
                        break;
                    case 34:
                        {
                            this.state = 200;
                            this.match(PolicyParser.TENANCY);
                            this.state = 201;
                            _la = this._input.LA(1);
                            if (!(_la === 46 || _la === 47)) {
                                this._errHandler.recoverInline(this);
                            }
                            else {
                                this._errHandler.reportMatch(this);
                                this.consume();
                            }
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    subject() {
        let localctx = new SubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 20, PolicyParser.RULE_subject);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 209;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 31:
                        {
                            this.state = 204;
                            this.groupSubject();
                        }
                        break;
                    case 32:
                        {
                            this.state = 205;
                            this.serviceSubject();
                        }
                        break;
                    case 30:
                        {
                            this.state = 206;
                            this.dynamicGroupSubject();
                        }
                        break;
                    case 24:
                        {
                            this.state = 207;
                            this.resourceSubject();
                        }
                        break;
                    case 19:
                        {
                            this.state = 208;
                            this.match(PolicyParser.ANYUSER);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    groupSubject() {
        let localctx = new GroupSubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 22, PolicyParser.RULE_groupSubject);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 211;
                this.match(PolicyParser.GROUP);
                this.state = 214;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 17:
                    case 46:
                    case 47:
                        {
                            this.state = 212;
                            this.groupName();
                        }
                        break;
                    case 45:
                        {
                            this.state = 213;
                            this.groupID();
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
                this.state = 223;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 216;
                            this.match(PolicyParser.T__1);
                            this.state = 219;
                            this._errHandler.sync(this);
                            switch (this._input.LA(1)) {
                                case 17:
                                case 46:
                                case 47:
                                    {
                                        this.state = 217;
                                        this.groupName();
                                    }
                                    break;
                                case 45:
                                    {
                                        this.state = 218;
                                        this.groupID();
                                    }
                                    break;
                                default:
                                    throw new antlr4_1.NoViableAltException(this);
                            }
                        }
                    }
                    this.state = 225;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    resourceSubject() {
        let localctx = new ResourceSubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 24, PolicyParser.RULE_resourceSubject);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 226;
                this.match(PolicyParser.RESOURCE);
                this.state = 227;
                this.resourceSubjectId();
                this.state = 231;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 46 || _la === 47) {
                    {
                        {
                            this.state = 228;
                            this.resourceSubjectId();
                        }
                    }
                    this.state = 233;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    serviceSubject() {
        let localctx = new ServiceSubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 26, PolicyParser.RULE_serviceSubject);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 234;
                this.match(PolicyParser.SERVICE);
                this.state = 235;
                this.serviceSubjectId();
                this.state = 240;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 236;
                            this.match(PolicyParser.T__1);
                            this.state = 237;
                            this.serviceSubjectId();
                        }
                    }
                    this.state = 242;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    groupName() {
        let localctx = new GroupNameContext(this, this._ctx, this.state);
        this.enterRule(localctx, 28, PolicyParser.RULE_groupName);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 255;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 31, this._ctx)) {
                    case 1:
                        {
                            this.state = 243;
                            this.match(PolicyParser.WORD);
                        }
                        break;
                    case 2:
                        {
                            this.state = 244;
                            this.match(PolicyParser.QUOTED_STRING);
                            this.state = 245;
                            this.match(PolicyParser.T__4);
                            this.state = 246;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 3:
                        {
                            this.state = 247;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 4:
                        {
                            this.state = 248;
                            this.match(PolicyParser.WORD);
                            this.state = 249;
                            this.match(PolicyParser.T__4);
                            this.state = 250;
                            this.match(PolicyParser.WORD);
                        }
                        break;
                    case 5:
                        {
                            this.state = 251;
                            this.match(PolicyParser.WORD);
                            this.state = 252;
                            this.match(PolicyParser.T__4);
                            this.state = 253;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 6:
                        {
                            this.state = 254;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    resourceSubjectId() {
        let localctx = new ResourceSubjectIdContext(this, this._ctx, this.state);
        this.enterRule(localctx, 30, PolicyParser.RULE_resourceSubjectId);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 257;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 266;
                this._errHandler.sync(this);
                _alt = 1 + 1;
                do {
                    switch (_alt) {
                        case 1 + 1:
                            {
                                this.state = 266;
                                this._errHandler.sync(this);
                                switch (this._interp.adaptivePredict(this._input, 32, this._ctx)) {
                                    case 1:
                                        {
                                            this.state = 258;
                                            this.match(PolicyParser.T__5);
                                            this.state = 259;
                                            _la = this._input.LA(1);
                                            if (!(_la === 46 || _la === 47)) {
                                                this._errHandler.recoverInline(this);
                                            }
                                            else {
                                                this._errHandler.reportMatch(this);
                                                this.consume();
                                            }
                                            this.state = 260;
                                            this.match(PolicyParser.T__5);
                                        }
                                        break;
                                    case 2:
                                        {
                                            this.state = 261;
                                            this.match(PolicyParser.T__5);
                                            this.state = 262;
                                            _la = this._input.LA(1);
                                            if (!(_la === 46 || _la === 47)) {
                                                this._errHandler.recoverInline(this);
                                            }
                                            else {
                                                this._errHandler.reportMatch(this);
                                                this.consume();
                                            }
                                            this.state = 263;
                                            this.match(PolicyParser.T__4);
                                            this.state = 264;
                                            _la = this._input.LA(1);
                                            if (!(_la === 46 || _la === 47)) {
                                                this._errHandler.recoverInline(this);
                                            }
                                            else {
                                                this._errHandler.reportMatch(this);
                                                this.consume();
                                            }
                                            this.state = 265;
                                            this.match(PolicyParser.T__5);
                                        }
                                        break;
                                }
                            }
                            break;
                        default:
                            throw new antlr4_1.NoViableAltException(this);
                    }
                    this.state = 268;
                    this._errHandler.sync(this);
                    _alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
                } while (_alt !== 1 && _alt !== antlr4_1.ATN.INVALID_ALT_NUMBER);
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    serviceSubjectId() {
        let localctx = new ServiceSubjectIdContext(this, this._ctx, this.state);
        this.enterRule(localctx, 32, PolicyParser.RULE_serviceSubjectId);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 270;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    groupID() {
        let localctx = new GroupIDContext(this, this._ctx, this.state);
        this.enterRule(localctx, 34, PolicyParser.RULE_groupID);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 272;
                this.match(PolicyParser.ID);
                this.state = 273;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    dynamicGroupSubject() {
        let localctx = new DynamicGroupSubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 36, PolicyParser.RULE_dynamicGroupSubject);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 275;
                this.match(PolicyParser.DYNAMICGROUP);
                this.state = 278;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 17:
                    case 46:
                    case 47:
                        {
                            this.state = 276;
                            this.groupName();
                        }
                        break;
                    case 45:
                        {
                            this.state = 277;
                            this.groupID();
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
                this.state = 287;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 280;
                            this.match(PolicyParser.T__1);
                            this.state = 283;
                            this._errHandler.sync(this);
                            switch (this._input.LA(1)) {
                                case 17:
                                case 46:
                                case 47:
                                    {
                                        this.state = 281;
                                        this.groupName();
                                    }
                                    break;
                                case 45:
                                    {
                                        this.state = 282;
                                        this.groupID();
                                    }
                                    break;
                                default:
                                    throw new antlr4_1.NoViableAltException(this);
                            }
                        }
                    }
                    this.state = 289;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    tenancySubject() {
        let localctx = new TenancySubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 38, PolicyParser.RULE_tenancySubject);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 290;
                this.match(PolicyParser.TENANCY);
                this.state = 291;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    definedSubject() {
        let localctx = new DefinedSubjectContext(this, this._ctx, this.state);
        this.enterRule(localctx, 40, PolicyParser.RULE_definedSubject);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 297;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 31:
                        {
                            this.state = 293;
                            this.groupSubject();
                        }
                        break;
                    case 30:
                        {
                            this.state = 294;
                            this.dynamicGroupSubject();
                        }
                        break;
                    case 32:
                        {
                            this.state = 295;
                            this.serviceSubject();
                        }
                        break;
                    case 34:
                        {
                            this.state = 296;
                            this.tenancySubject();
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    defined() {
        let localctx = new DefinedContext(this, this._ctx, this.state);
        this.enterRule(localctx, 42, PolicyParser.RULE_defined);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 299;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    resource() {
        let localctx = new ResourceContext(this, this._ctx, this.state);
        this.enterRule(localctx, 44, PolicyParser.RULE_resource);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 301;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    condition() {
        let localctx = new ConditionContext(this, this._ctx, this.state);
        this.enterRule(localctx, 46, PolicyParser.RULE_condition);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 306;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 38, this._ctx)) {
                    case 1:
                        {
                            this.state = 303;
                            this.comparisonList();
                        }
                        break;
                    case 2:
                        {
                            this.state = 304;
                            this.comparison();
                        }
                        break;
                    case 3:
                        {
                            this.state = 305;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    comparison() {
        let localctx = new ComparisonContext(this, this._ctx, this.state);
        this.enterRule(localctx, 48, PolicyParser.RULE_comparison);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 308;
                this.variable();
                this.state = 309;
                this.operator();
                this.state = 314;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 39, this._ctx)) {
                    case 1:
                        {
                            this.state = 310;
                            this.value();
                        }
                        break;
                    case 2:
                        {
                            this.state = 311;
                            this.valueList();
                        }
                        break;
                    case 3:
                        {
                            this.state = 312;
                            this.timeWindow();
                        }
                        break;
                    case 4:
                        {
                            this.state = 313;
                            this.patternMatch();
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    variable() {
        let localctx = new VariableContext(this, this._ctx, this.state);
        this.enterRule(localctx, 50, PolicyParser.RULE_variable);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 316;
                _la = this._input.LA(1);
                if (!(_la === 46 || _la === 47)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 323;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === 7) {
                    {
                        this.state = 319;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        do {
                            {
                                {
                                    this.state = 317;
                                    this.match(PolicyParser.T__6);
                                    this.state = 318;
                                    _la = this._input.LA(1);
                                    if (!(_la === 46 || _la === 47)) {
                                        this._errHandler.recoverInline(this);
                                    }
                                    else {
                                        this._errHandler.reportMatch(this);
                                        this.consume();
                                    }
                                }
                            }
                            this.state = 321;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        } while (_la === 7);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    operator() {
        let localctx = new OperatorContext(this, this._ctx, this.state);
        this.enterRule(localctx, 52, PolicyParser.RULE_operator);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 331;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 8:
                        {
                            this.state = 325;
                            this.match(PolicyParser.T__7);
                        }
                        break;
                    case 9:
                        {
                            this.state = 326;
                            this.match(PolicyParser.T__8);
                            this.state = 327;
                            this.match(PolicyParser.T__7);
                        }
                        break;
                    case 14:
                        {
                            this.state = 328;
                            this.match(PolicyParser.BEFORE);
                        }
                        break;
                    case 27:
                        {
                            this.state = 329;
                            this.match(PolicyParser.IN);
                        }
                        break;
                    case 15:
                        {
                            this.state = 330;
                            this.match(PolicyParser.BETWEEN);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    value() {
        let localctx = new ValueContext(this, this._ctx, this.state);
        this.enterRule(localctx, 54, PolicyParser.RULE_value);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 349;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 44, this._ctx)) {
                    case 1:
                        {
                            this.state = 333;
                            this.match(PolicyParser.WORD);
                        }
                        break;
                    case 2:
                        {
                            this.state = 334;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 3:
                        {
                            this.state = 335;
                            this.match(PolicyParser.QUOTED_STRING);
                            this.state = 336;
                            this.match(PolicyParser.T__4);
                            this.state = 337;
                            this.match(PolicyParser.WORD);
                        }
                        break;
                    case 4:
                        {
                            this.state = 338;
                            this.match(PolicyParser.QUOTED_STRING);
                            this.state = 341;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            do {
                                {
                                    {
                                        this.state = 339;
                                        this.match(PolicyParser.WS);
                                        this.state = 340;
                                        this.match(PolicyParser.WORD);
                                    }
                                }
                                this.state = 343;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                            } while (_la === 18);
                        }
                        break;
                    case 5:
                        {
                            this.state = 345;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                    case 6:
                        {
                            this.state = 346;
                            this.match(PolicyParser.T__5);
                            this.state = 347;
                            this.match(PolicyParser.HCL_VAR);
                            this.state = 348;
                            this.match(PolicyParser.T__5);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    valueList() {
        let localctx = new ValueListContext(this, this._ctx, this.state);
        this.enterRule(localctx, 56, PolicyParser.RULE_valueList);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 351;
                this.match(PolicyParser.T__9);
                this.state = 357;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 17:
                        {
                            this.state = 352;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 46:
                        {
                            this.state = 353;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                    case 6:
                        {
                            this.state = 354;
                            this.match(PolicyParser.T__5);
                            this.state = 355;
                            this.match(PolicyParser.HCL_VAR);
                            this.state = 356;
                            this.match(PolicyParser.T__5);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
                this.state = 369;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 359;
                            this.match(PolicyParser.T__1);
                            this.state = 365;
                            this._errHandler.sync(this);
                            switch (this._input.LA(1)) {
                                case 17:
                                    {
                                        this.state = 360;
                                        this.match(PolicyParser.QUOTED_STRING);
                                    }
                                    break;
                                case 46:
                                    {
                                        this.state = 361;
                                        this.match(PolicyParser.HCL_VAR);
                                    }
                                    break;
                                case 6:
                                    {
                                        this.state = 362;
                                        this.match(PolicyParser.T__5);
                                        this.state = 363;
                                        this.match(PolicyParser.HCL_VAR);
                                        this.state = 364;
                                        this.match(PolicyParser.T__5);
                                    }
                                    break;
                                default:
                                    throw new antlr4_1.NoViableAltException(this);
                            }
                        }
                    }
                    this.state = 371;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 372;
                this.match(PolicyParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    timeWindow() {
        let localctx = new TimeWindowContext(this, this._ctx, this.state);
        this.enterRule(localctx, 58, PolicyParser.RULE_timeWindow);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 379;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 17:
                        {
                            this.state = 374;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 46:
                        {
                            this.state = 375;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                    case 6:
                        {
                            this.state = 376;
                            this.match(PolicyParser.T__5);
                            this.state = 377;
                            this.match(PolicyParser.HCL_VAR);
                            this.state = 378;
                            this.match(PolicyParser.T__5);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
                this.state = 381;
                this.match(PolicyParser.AND);
                this.state = 387;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case 17:
                        {
                            this.state = 382;
                            this.match(PolicyParser.QUOTED_STRING);
                        }
                        break;
                    case 46:
                        {
                            this.state = 383;
                            this.match(PolicyParser.HCL_VAR);
                        }
                        break;
                    case 6:
                        {
                            this.state = 384;
                            this.match(PolicyParser.T__5);
                            this.state = 385;
                            this.match(PolicyParser.HCL_VAR);
                            this.state = 386;
                            this.match(PolicyParser.T__5);
                        }
                        break;
                    default:
                        throw new antlr4_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    comparisonList() {
        let localctx = new ComparisonListContext(this, this._ctx, this.state);
        this.enterRule(localctx, 60, PolicyParser.RULE_comparisonList);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 389;
                this.logicalCombine();
                this.state = 390;
                this.match(PolicyParser.T__0);
                this.state = 391;
                this.condition();
                this.state = 396;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === 2) {
                    {
                        {
                            this.state = 392;
                            this.match(PolicyParser.T__1);
                            this.state = 393;
                            this.condition();
                        }
                    }
                    this.state = 398;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 399;
                this.match(PolicyParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    logicalCombine() {
        let localctx = new LogicalCombineContext(this, this._ctx, this.state);
        this.enterRule(localctx, 62, PolicyParser.RULE_logicalCombine);
        let _la;
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 401;
                _la = this._input.LA(1);
                if (!(_la === 41 || _la === 43)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    // @RuleVersion(0)
    patternMatch() {
        let localctx = new PatternMatchContext(this, this._ctx, this.state);
        this.enterRule(localctx, 64, PolicyParser.RULE_patternMatch);
        try {
            this.enterOuterAlt(localctx, 1);
            {
                this.state = 415;
                this._errHandler.sync(this);
                switch (this._interp.adaptivePredict(this._input, 51, this._ctx)) {
                    case 1:
                        {
                            this.state = 403;
                            this.match(PolicyParser.T__4);
                            this.state = 404;
                            this.match(PolicyParser.WORD);
                            this.state = 405;
                            this.match(PolicyParser.T__11);
                        }
                        break;
                    case 2:
                        {
                            this.state = 406;
                            this.match(PolicyParser.T__12);
                            this.state = 407;
                            this.match(PolicyParser.WORD);
                            this.state = 408;
                            this.match(PolicyParser.T__4);
                        }
                        break;
                    case 3:
                        {
                            this.state = 409;
                            this.match(PolicyParser.T__4);
                            this.state = 410;
                            this.match(PolicyParser.WORD);
                            this.state = 411;
                            this.match(PolicyParser.T__4);
                        }
                        break;
                    case 4:
                        {
                            this.state = 412;
                            this.match(PolicyParser.T__12);
                            this.state = 413;
                            this.match(PolicyParser.WORD);
                            this.state = 414;
                            this.match(PolicyParser.T__11);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof antlr4_1.RecognitionException) {
                localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localctx;
    }
    static get _ATN() {
        if (!PolicyParser.__ATN) {
            PolicyParser.__ATN = new antlr4_1.ATNDeserializer().deserialize(PolicyParser._serializedATN);
        }
        return PolicyParser.__ATN;
    }
}
PolicyParser.T__0 = 1;
PolicyParser.T__1 = 2;
PolicyParser.T__2 = 3;
PolicyParser.T__3 = 4;
PolicyParser.T__4 = 5;
PolicyParser.T__5 = 6;
PolicyParser.T__6 = 7;
PolicyParser.T__7 = 8;
PolicyParser.T__8 = 9;
PolicyParser.T__9 = 10;
PolicyParser.T__10 = 11;
PolicyParser.T__11 = 12;
PolicyParser.T__12 = 13;
PolicyParser.BEFORE = 14;
PolicyParser.BETWEEN = 15;
PolicyParser.NEWLINE = 16;
PolicyParser.QUOTED_STRING = 17;
PolicyParser.WS = 18;
PolicyParser.ANYUSER = 19;
PolicyParser.ANYTENANCY = 20;
PolicyParser.ENDORSE = 21;
PolicyParser.ALLOW = 22;
PolicyParser.DEFINE = 23;
PolicyParser.RESOURCE = 24;
PolicyParser.TO = 25;
PolicyParser.OF = 26;
PolicyParser.IN = 27;
PolicyParser.WHERE = 28;
PolicyParser.WITH = 29;
PolicyParser.DYNAMICGROUP = 30;
PolicyParser.GROUP = 31;
PolicyParser.SERVICE = 32;
PolicyParser.COMPARTMENT = 33;
PolicyParser.TENANCY = 34;
PolicyParser.READ = 35;
PolicyParser.INSPECT = 36;
PolicyParser.MANAGE = 37;
PolicyParser.ASSOCIATE = 38;
PolicyParser.ADMIT = 39;
PolicyParser.USE = 40;
PolicyParser.ANY = 41;
PolicyParser.AND = 42;
PolicyParser.ALL = 43;
PolicyParser.AS = 44;
PolicyParser.ID = 45;
PolicyParser.HCL_VAR = 46;
PolicyParser.WORD = 47;
PolicyParser.EOF = antlr4_1.Token.EOF;
PolicyParser.RULE_policy = 0;
PolicyParser.RULE_allowExpression = 1;
PolicyParser.RULE_endorseExpression = 2;
PolicyParser.RULE_defineExpression = 3;
PolicyParser.RULE_admitExpression = 4;
PolicyParser.RULE_endorseVerb = 5;
PolicyParser.RULE_verb = 6;
PolicyParser.RULE_permissionList = 7;
PolicyParser.RULE_scope = 8;
PolicyParser.RULE_endorseScope = 9;
PolicyParser.RULE_subject = 10;
PolicyParser.RULE_groupSubject = 11;
PolicyParser.RULE_resourceSubject = 12;
PolicyParser.RULE_serviceSubject = 13;
PolicyParser.RULE_groupName = 14;
PolicyParser.RULE_resourceSubjectId = 15;
PolicyParser.RULE_serviceSubjectId = 16;
PolicyParser.RULE_groupID = 17;
PolicyParser.RULE_dynamicGroupSubject = 18;
PolicyParser.RULE_tenancySubject = 19;
PolicyParser.RULE_definedSubject = 20;
PolicyParser.RULE_defined = 21;
PolicyParser.RULE_resource = 22;
PolicyParser.RULE_condition = 23;
PolicyParser.RULE_comparison = 24;
PolicyParser.RULE_variable = 25;
PolicyParser.RULE_operator = 26;
PolicyParser.RULE_value = 27;
PolicyParser.RULE_valueList = 28;
PolicyParser.RULE_timeWindow = 29;
PolicyParser.RULE_comparisonList = 30;
PolicyParser.RULE_logicalCombine = 31;
PolicyParser.RULE_patternMatch = 32;
PolicyParser.literalNames = [null, "'{'",
    "','", "'}'",
    "':'", "'/'",
    "'''", "'.'",
    "'='", "'!'",
    "'('", "')'",
    "'*/'", "'/*'"];
PolicyParser.symbolicNames = [null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    null, null,
    "BEFORE", "BETWEEN",
    "NEWLINE",
    "QUOTED_STRING",
    "WS", "ANYUSER",
    "ANYTENANCY",
    "ENDORSE",
    "ALLOW", "DEFINE",
    "RESOURCE",
    "TO", "OF",
    "IN", "WHERE",
    "WITH", "DYNAMICGROUP",
    "GROUP", "SERVICE",
    "COMPARTMENT",
    "TENANCY",
    "READ", "INSPECT",
    "MANAGE", "ASSOCIATE",
    "ADMIT", "USE",
    "ANY", "AND",
    "ALL", "AS",
    "ID", "HCL_VAR",
    "WORD"];
// tslint:disable:no-trailing-whitespace
PolicyParser.ruleNames = [
    "policy", "allowExpression", "endorseExpression", "defineExpression",
    "admitExpression", "endorseVerb", "verb", "permissionList", "scope", "endorseScope",
    "subject", "groupSubject", "resourceSubject", "serviceSubject", "groupName",
    "resourceSubjectId", "serviceSubjectId", "groupID", "dynamicGroupSubject",
    "tenancySubject", "definedSubject", "defined", "resource", "condition",
    "comparison", "variable", "operator", "value", "valueList", "timeWindow",
    "comparisonList", "logicalCombine", "patternMatch",
];
PolicyParser._serializedATN = [4, 1, 47, 418, 2, 0, 7, 0, 2,
    1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2,
    10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13, 2, 14, 7, 14, 2, 15, 7, 15, 2, 16, 7, 16, 2, 17,
    7, 17, 2, 18, 7, 18, 2, 19, 7, 19, 2, 20, 7, 20, 2, 21, 7, 21, 2, 22, 7, 22, 2, 23, 7, 23, 2, 24, 7,
    24, 2, 25, 7, 25, 2, 26, 7, 26, 2, 27, 7, 27, 2, 28, 7, 28, 2, 29, 7, 29, 2, 30, 7, 30, 2, 31, 7, 31,
    2, 32, 7, 32, 1, 0, 1, 0, 1, 0, 1, 0, 4, 0, 71, 8, 0, 11, 0, 12, 0, 72, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 3,
    1, 80, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 86, 8, 1, 1, 1, 3, 1, 89, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1,
    95, 8, 1, 1, 1, 3, 1, 98, 8, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3, 2, 107, 8, 2, 1, 2, 3, 2, 110,
    8, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 3, 2, 120, 8, 2, 1, 2, 1, 2, 3, 2, 124, 8, 2, 1, 2,
    3, 2, 127, 8, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 134, 8, 3, 1, 4, 1, 4, 1, 4, 1, 4, 3, 4, 140, 8, 4,
    1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 3, 4, 147, 8, 4, 1, 4, 3, 4, 150, 8, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4,
    1, 4, 3, 4, 159, 8, 4, 1, 4, 1, 4, 3, 4, 163, 8, 4, 1, 4, 3, 4, 166, 8, 4, 1, 5, 1, 5, 3, 5, 170, 8, 5,
    1, 6, 1, 6, 1, 7, 1, 7, 1, 7, 1, 7, 5, 7, 178, 8, 7, 10, 7, 12, 7, 181, 9, 7, 1, 7, 1, 7, 1, 8, 1, 8, 3,
    8, 187, 8, 8, 1, 8, 1, 8, 1, 8, 5, 8, 192, 8, 8, 10, 8, 12, 8, 195, 9, 8, 1, 8, 3, 8, 198, 8, 8, 1, 9,
    1, 9, 1, 9, 3, 9, 203, 8, 9, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 3, 10, 210, 8, 10, 1, 11, 1, 11, 1,
    11, 3, 11, 215, 8, 11, 1, 11, 1, 11, 1, 11, 3, 11, 220, 8, 11, 5, 11, 222, 8, 11, 10, 11, 12, 11,
    225, 9, 11, 1, 12, 1, 12, 1, 12, 5, 12, 230, 8, 12, 10, 12, 12, 12, 233, 9, 12, 1, 13, 1, 13, 1,
    13, 1, 13, 5, 13, 239, 8, 13, 10, 13, 12, 13, 242, 9, 13, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14,
    1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 1, 14, 3, 14, 256, 8, 14, 1, 15, 1, 15, 1, 15, 1, 15, 1, 15, 1,
    15, 1, 15, 1, 15, 1, 15, 4, 15, 267, 8, 15, 11, 15, 12, 15, 268, 1, 16, 1, 16, 1, 17, 1, 17, 1, 17,
    1, 18, 1, 18, 1, 18, 3, 18, 279, 8, 18, 1, 18, 1, 18, 1, 18, 3, 18, 284, 8, 18, 5, 18, 286, 8, 18,
    10, 18, 12, 18, 289, 9, 18, 1, 19, 1, 19, 1, 19, 1, 20, 1, 20, 1, 20, 1, 20, 3, 20, 298, 8, 20, 1,
    21, 1, 21, 1, 22, 1, 22, 1, 23, 1, 23, 1, 23, 3, 23, 307, 8, 23, 1, 24, 1, 24, 1, 24, 1, 24, 1, 24,
    1, 24, 3, 24, 315, 8, 24, 1, 25, 1, 25, 1, 25, 4, 25, 320, 8, 25, 11, 25, 12, 25, 321, 3, 25, 324,
    8, 25, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 1, 26, 3, 26, 332, 8, 26, 1, 27, 1, 27, 1, 27, 1, 27, 1,
    27, 1, 27, 1, 27, 1, 27, 4, 27, 342, 8, 27, 11, 27, 12, 27, 343, 1, 27, 1, 27, 1, 27, 1, 27, 3, 27,
    350, 8, 27, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 1, 28, 3, 28, 358, 8, 28, 1, 28, 1, 28, 1, 28, 1, 28,
    1, 28, 1, 28, 3, 28, 366, 8, 28, 5, 28, 368, 8, 28, 10, 28, 12, 28, 371, 9, 28, 1, 28, 1, 28, 1,
    29, 1, 29, 1, 29, 1, 29, 1, 29, 3, 29, 380, 8, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 1, 29, 3, 29,
    388, 8, 29, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 5, 30, 395, 8, 30, 10, 30, 12, 30, 398, 9, 30, 1,
    30, 1, 30, 1, 31, 1, 31, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32, 1, 32,
    1, 32, 3, 32, 416, 8, 32, 1, 32, 1, 268, 0, 33, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26,
    28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 0, 3, 2, 0, 35, 37,
    40, 40, 1, 0, 46, 47, 2, 0, 41, 41, 43, 43, 463, 0, 70, 1, 0, 0, 0, 2, 76, 1, 0, 0, 0, 4, 99, 1, 0,
    0, 0, 6, 128, 1, 0, 0, 0, 8, 135, 1, 0, 0, 0, 10, 169, 1, 0, 0, 0, 12, 171, 1, 0, 0, 0, 14, 173, 1,
    0, 0, 0, 16, 197, 1, 0, 0, 0, 18, 202, 1, 0, 0, 0, 20, 209, 1, 0, 0, 0, 22, 211, 1, 0, 0, 0, 24, 226,
    1, 0, 0, 0, 26, 234, 1, 0, 0, 0, 28, 255, 1, 0, 0, 0, 30, 257, 1, 0, 0, 0, 32, 270, 1, 0, 0, 0, 34,
    272, 1, 0, 0, 0, 36, 275, 1, 0, 0, 0, 38, 290, 1, 0, 0, 0, 40, 297, 1, 0, 0, 0, 42, 299, 1, 0, 0, 0,
    44, 301, 1, 0, 0, 0, 46, 306, 1, 0, 0, 0, 48, 308, 1, 0, 0, 0, 50, 316, 1, 0, 0, 0, 52, 331, 1, 0,
    0, 0, 54, 349, 1, 0, 0, 0, 56, 351, 1, 0, 0, 0, 58, 379, 1, 0, 0, 0, 60, 389, 1, 0, 0, 0, 62, 401,
    1, 0, 0, 0, 64, 415, 1, 0, 0, 0, 66, 71, 3, 2, 1, 0, 67, 71, 3, 4, 2, 0, 68, 71, 3, 6, 3, 0, 69, 71,
    3, 8, 4, 0, 70, 66, 1, 0, 0, 0, 70, 67, 1, 0, 0, 0, 70, 68, 1, 0, 0, 0, 70, 69, 1, 0, 0, 0, 71, 72, 1,
    0, 0, 0, 72, 70, 1, 0, 0, 0, 72, 73, 1, 0, 0, 0, 73, 74, 1, 0, 0, 0, 74, 75, 5, 0, 0, 1, 75, 1, 1, 0,
    0, 0, 76, 77, 5, 22, 0, 0, 77, 88, 3, 20, 10, 0, 78, 80, 5, 25, 0, 0, 79, 78, 1, 0, 0, 0, 79, 80, 1,
    0, 0, 0, 80, 81, 1, 0, 0, 0, 81, 82, 3, 12, 6, 0, 82, 83, 3, 44, 22, 0, 83, 89, 1, 0, 0, 0, 84, 86,
    5, 25, 0, 0, 85, 84, 1, 0, 0, 0, 85, 86, 1, 0, 0, 0, 86, 87, 1, 0, 0, 0, 87, 89, 3, 14, 7, 0, 88, 79,
    1, 0, 0, 0, 88, 85, 1, 0, 0, 0, 89, 90, 1, 0, 0, 0, 90, 91, 5, 27, 0, 0, 91, 94, 3, 16, 8, 0, 92, 93,
    5, 28, 0, 0, 93, 95, 3, 46, 23, 0, 94, 92, 1, 0, 0, 0, 94, 95, 1, 0, 0, 0, 95, 97, 1, 0, 0, 0, 96, 98,
    5, 16, 0, 0, 97, 96, 1, 0, 0, 0, 97, 98, 1, 0, 0, 0, 98, 3, 1, 0, 0, 0, 99, 100, 5, 21, 0, 0, 100, 109,
    3, 20, 10, 0, 101, 102, 5, 25, 0, 0, 102, 103, 3, 10, 5, 0, 103, 104, 3, 44, 22, 0, 104, 110, 1,
    0, 0, 0, 105, 107, 5, 25, 0, 0, 106, 105, 1, 0, 0, 0, 106, 107, 1, 0, 0, 0, 107, 108, 1, 0, 0, 0,
    108, 110, 3, 14, 7, 0, 109, 101, 1, 0, 0, 0, 109, 106, 1, 0, 0, 0, 110, 111, 1, 0, 0, 0, 111, 119,
    5, 27, 0, 0, 112, 120, 3, 18, 9, 0, 113, 114, 3, 16, 8, 0, 114, 115, 5, 29, 0, 0, 115, 116, 3, 44,
    22, 0, 116, 117, 5, 27, 0, 0, 117, 118, 3, 18, 9, 0, 118, 120, 1, 0, 0, 0, 119, 112, 1, 0, 0, 0,
    119, 113, 1, 0, 0, 0, 120, 123, 1, 0, 0, 0, 121, 122, 5, 28, 0, 0, 122, 124, 3, 46, 23, 0, 123,
    121, 1, 0, 0, 0, 123, 124, 1, 0, 0, 0, 124, 126, 1, 0, 0, 0, 125, 127, 5, 16, 0, 0, 126, 125, 1,
    0, 0, 0, 126, 127, 1, 0, 0, 0, 127, 5, 1, 0, 0, 0, 128, 129, 5, 23, 0, 0, 129, 130, 3, 40, 20, 0,
    130, 131, 5, 44, 0, 0, 131, 133, 3, 42, 21, 0, 132, 134, 5, 16, 0, 0, 133, 132, 1, 0, 0, 0, 133,
    134, 1, 0, 0, 0, 134, 7, 1, 0, 0, 0, 135, 136, 5, 39, 0, 0, 136, 139, 3, 20, 10, 0, 137, 138, 5,
    26, 0, 0, 138, 140, 3, 18, 9, 0, 139, 137, 1, 0, 0, 0, 139, 140, 1, 0, 0, 0, 140, 149, 1, 0, 0, 0,
    141, 142, 5, 25, 0, 0, 142, 143, 3, 10, 5, 0, 143, 144, 3, 44, 22, 0, 144, 150, 1, 0, 0, 0, 145,
    147, 5, 25, 0, 0, 146, 145, 1, 0, 0, 0, 146, 147, 1, 0, 0, 0, 147, 148, 1, 0, 0, 0, 148, 150, 3,
    14, 7, 0, 149, 141, 1, 0, 0, 0, 149, 146, 1, 0, 0, 0, 150, 151, 1, 0, 0, 0, 151, 152, 5, 27, 0, 0,
    152, 158, 3, 16, 8, 0, 153, 154, 5, 29, 0, 0, 154, 155, 3, 44, 22, 0, 155, 156, 5, 27, 0, 0, 156,
    157, 3, 18, 9, 0, 157, 159, 1, 0, 0, 0, 158, 153, 1, 0, 0, 0, 158, 159, 1, 0, 0, 0, 159, 162, 1,
    0, 0, 0, 160, 161, 5, 28, 0, 0, 161, 163, 3, 46, 23, 0, 162, 160, 1, 0, 0, 0, 162, 163, 1, 0, 0,
    0, 163, 165, 1, 0, 0, 0, 164, 166, 5, 16, 0, 0, 165, 164, 1, 0, 0, 0, 165, 166, 1, 0, 0, 0, 166,
    9, 1, 0, 0, 0, 167, 170, 3, 12, 6, 0, 168, 170, 5, 38, 0, 0, 169, 167, 1, 0, 0, 0, 169, 168, 1, 0,
    0, 0, 170, 11, 1, 0, 0, 0, 171, 172, 7, 0, 0, 0, 172, 13, 1, 0, 0, 0, 173, 174, 5, 1, 0, 0, 174, 179,
    5, 47, 0, 0, 175, 176, 5, 2, 0, 0, 176, 178, 5, 47, 0, 0, 177, 175, 1, 0, 0, 0, 178, 181, 1, 0, 0,
    0, 179, 177, 1, 0, 0, 0, 179, 180, 1, 0, 0, 0, 180, 182, 1, 0, 0, 0, 181, 179, 1, 0, 0, 0, 182, 183,
    5, 3, 0, 0, 183, 15, 1, 0, 0, 0, 184, 186, 5, 33, 0, 0, 185, 187, 5, 45, 0, 0, 186, 185, 1, 0, 0,
    0, 186, 187, 1, 0, 0, 0, 187, 188, 1, 0, 0, 0, 188, 193, 7, 1, 0, 0, 189, 190, 5, 4, 0, 0, 190, 192,
    7, 1, 0, 0, 191, 189, 1, 0, 0, 0, 192, 195, 1, 0, 0, 0, 193, 191, 1, 0, 0, 0, 193, 194, 1, 0, 0, 0,
    194, 198, 1, 0, 0, 0, 195, 193, 1, 0, 0, 0, 196, 198, 5, 34, 0, 0, 197, 184, 1, 0, 0, 0, 197, 196,
    1, 0, 0, 0, 198, 17, 1, 0, 0, 0, 199, 203, 5, 20, 0, 0, 200, 201, 5, 34, 0, 0, 201, 203, 7, 1, 0,
    0, 202, 199, 1, 0, 0, 0, 202, 200, 1, 0, 0, 0, 203, 19, 1, 0, 0, 0, 204, 210, 3, 22, 11, 0, 205,
    210, 3, 26, 13, 0, 206, 210, 3, 36, 18, 0, 207, 210, 3, 24, 12, 0, 208, 210, 5, 19, 0, 0, 209,
    204, 1, 0, 0, 0, 209, 205, 1, 0, 0, 0, 209, 206, 1, 0, 0, 0, 209, 207, 1, 0, 0, 0, 209, 208, 1, 0,
    0, 0, 210, 21, 1, 0, 0, 0, 211, 214, 5, 31, 0, 0, 212, 215, 3, 28, 14, 0, 213, 215, 3, 34, 17, 0,
    214, 212, 1, 0, 0, 0, 214, 213, 1, 0, 0, 0, 215, 223, 1, 0, 0, 0, 216, 219, 5, 2, 0, 0, 217, 220,
    3, 28, 14, 0, 218, 220, 3, 34, 17, 0, 219, 217, 1, 0, 0, 0, 219, 218, 1, 0, 0, 0, 220, 222, 1, 0,
    0, 0, 221, 216, 1, 0, 0, 0, 222, 225, 1, 0, 0, 0, 223, 221, 1, 0, 0, 0, 223, 224, 1, 0, 0, 0, 224,
    23, 1, 0, 0, 0, 225, 223, 1, 0, 0, 0, 226, 227, 5, 24, 0, 0, 227, 231, 3, 30, 15, 0, 228, 230, 3,
    30, 15, 0, 229, 228, 1, 0, 0, 0, 230, 233, 1, 0, 0, 0, 231, 229, 1, 0, 0, 0, 231, 232, 1, 0, 0, 0,
    232, 25, 1, 0, 0, 0, 233, 231, 1, 0, 0, 0, 234, 235, 5, 32, 0, 0, 235, 240, 3, 32, 16, 0, 236, 237,
    5, 2, 0, 0, 237, 239, 3, 32, 16, 0, 238, 236, 1, 0, 0, 0, 239, 242, 1, 0, 0, 0, 240, 238, 1, 0, 0,
    0, 240, 241, 1, 0, 0, 0, 241, 27, 1, 0, 0, 0, 242, 240, 1, 0, 0, 0, 243, 256, 5, 47, 0, 0, 244, 245,
    5, 17, 0, 0, 245, 246, 5, 5, 0, 0, 246, 256, 5, 17, 0, 0, 247, 256, 5, 17, 0, 0, 248, 249, 5, 47,
    0, 0, 249, 250, 5, 5, 0, 0, 250, 256, 5, 47, 0, 0, 251, 252, 5, 47, 0, 0, 252, 253, 5, 5, 0, 0, 253,
    256, 5, 17, 0, 0, 254, 256, 5, 46, 0, 0, 255, 243, 1, 0, 0, 0, 255, 244, 1, 0, 0, 0, 255, 247, 1,
    0, 0, 0, 255, 248, 1, 0, 0, 0, 255, 251, 1, 0, 0, 0, 255, 254, 1, 0, 0, 0, 256, 29, 1, 0, 0, 0, 257,
    266, 7, 1, 0, 0, 258, 259, 5, 6, 0, 0, 259, 260, 7, 1, 0, 0, 260, 267, 5, 6, 0, 0, 261, 262, 5, 6,
    0, 0, 262, 263, 7, 1, 0, 0, 263, 264, 5, 5, 0, 0, 264, 265, 7, 1, 0, 0, 265, 267, 5, 6, 0, 0, 266,
    258, 1, 0, 0, 0, 266, 261, 1, 0, 0, 0, 267, 268, 1, 0, 0, 0, 268, 269, 1, 0, 0, 0, 268, 266, 1, 0,
    0, 0, 269, 31, 1, 0, 0, 0, 270, 271, 7, 1, 0, 0, 271, 33, 1, 0, 0, 0, 272, 273, 5, 45, 0, 0, 273,
    274, 7, 1, 0, 0, 274, 35, 1, 0, 0, 0, 275, 278, 5, 30, 0, 0, 276, 279, 3, 28, 14, 0, 277, 279, 3,
    34, 17, 0, 278, 276, 1, 0, 0, 0, 278, 277, 1, 0, 0, 0, 279, 287, 1, 0, 0, 0, 280, 283, 5, 2, 0, 0,
    281, 284, 3, 28, 14, 0, 282, 284, 3, 34, 17, 0, 283, 281, 1, 0, 0, 0, 283, 282, 1, 0, 0, 0, 284,
    286, 1, 0, 0, 0, 285, 280, 1, 0, 0, 0, 286, 289, 1, 0, 0, 0, 287, 285, 1, 0, 0, 0, 287, 288, 1, 0,
    0, 0, 288, 37, 1, 0, 0, 0, 289, 287, 1, 0, 0, 0, 290, 291, 5, 34, 0, 0, 291, 292, 7, 1, 0, 0, 292,
    39, 1, 0, 0, 0, 293, 298, 3, 22, 11, 0, 294, 298, 3, 36, 18, 0, 295, 298, 3, 26, 13, 0, 296, 298,
    3, 38, 19, 0, 297, 293, 1, 0, 0, 0, 297, 294, 1, 0, 0, 0, 297, 295, 1, 0, 0, 0, 297, 296, 1, 0, 0,
    0, 298, 41, 1, 0, 0, 0, 299, 300, 7, 1, 0, 0, 300, 43, 1, 0, 0, 0, 301, 302, 7, 1, 0, 0, 302, 45,
    1, 0, 0, 0, 303, 307, 3, 60, 30, 0, 304, 307, 3, 48, 24, 0, 305, 307, 5, 46, 0, 0, 306, 303, 1,
    0, 0, 0, 306, 304, 1, 0, 0, 0, 306, 305, 1, 0, 0, 0, 307, 47, 1, 0, 0, 0, 308, 309, 3, 50, 25, 0,
    309, 314, 3, 52, 26, 0, 310, 315, 3, 54, 27, 0, 311, 315, 3, 56, 28, 0, 312, 315, 3, 58, 29, 0,
    313, 315, 3, 64, 32, 0, 314, 310, 1, 0, 0, 0, 314, 311, 1, 0, 0, 0, 314, 312, 1, 0, 0, 0, 314, 313,
    1, 0, 0, 0, 315, 49, 1, 0, 0, 0, 316, 323, 7, 1, 0, 0, 317, 318, 5, 7, 0, 0, 318, 320, 7, 1, 0, 0,
    319, 317, 1, 0, 0, 0, 320, 321, 1, 0, 0, 0, 321, 319, 1, 0, 0, 0, 321, 322, 1, 0, 0, 0, 322, 324,
    1, 0, 0, 0, 323, 319, 1, 0, 0, 0, 323, 324, 1, 0, 0, 0, 324, 51, 1, 0, 0, 0, 325, 332, 5, 8, 0, 0,
    326, 327, 5, 9, 0, 0, 327, 332, 5, 8, 0, 0, 328, 332, 5, 14, 0, 0, 329, 332, 5, 27, 0, 0, 330, 332,
    5, 15, 0, 0, 331, 325, 1, 0, 0, 0, 331, 326, 1, 0, 0, 0, 331, 328, 1, 0, 0, 0, 331, 329, 1, 0, 0,
    0, 331, 330, 1, 0, 0, 0, 332, 53, 1, 0, 0, 0, 333, 350, 5, 47, 0, 0, 334, 350, 5, 17, 0, 0, 335,
    336, 5, 17, 0, 0, 336, 337, 5, 5, 0, 0, 337, 350, 5, 47, 0, 0, 338, 341, 5, 17, 0, 0, 339, 340,
    5, 18, 0, 0, 340, 342, 5, 47, 0, 0, 341, 339, 1, 0, 0, 0, 342, 343, 1, 0, 0, 0, 343, 341, 1, 0, 0,
    0, 343, 344, 1, 0, 0, 0, 344, 350, 1, 0, 0, 0, 345, 350, 5, 46, 0, 0, 346, 347, 5, 6, 0, 0, 347,
    348, 5, 46, 0, 0, 348, 350, 5, 6, 0, 0, 349, 333, 1, 0, 0, 0, 349, 334, 1, 0, 0, 0, 349, 335, 1,
    0, 0, 0, 349, 338, 1, 0, 0, 0, 349, 345, 1, 0, 0, 0, 349, 346, 1, 0, 0, 0, 350, 55, 1, 0, 0, 0, 351,
    357, 5, 10, 0, 0, 352, 358, 5, 17, 0, 0, 353, 358, 5, 46, 0, 0, 354, 355, 5, 6, 0, 0, 355, 356,
    5, 46, 0, 0, 356, 358, 5, 6, 0, 0, 357, 352, 1, 0, 0, 0, 357, 353, 1, 0, 0, 0, 357, 354, 1, 0, 0,
    0, 358, 369, 1, 0, 0, 0, 359, 365, 5, 2, 0, 0, 360, 366, 5, 17, 0, 0, 361, 366, 5, 46, 0, 0, 362,
    363, 5, 6, 0, 0, 363, 364, 5, 46, 0, 0, 364, 366, 5, 6, 0, 0, 365, 360, 1, 0, 0, 0, 365, 361, 1,
    0, 0, 0, 365, 362, 1, 0, 0, 0, 366, 368, 1, 0, 0, 0, 367, 359, 1, 0, 0, 0, 368, 371, 1, 0, 0, 0, 369,
    367, 1, 0, 0, 0, 369, 370, 1, 0, 0, 0, 370, 372, 1, 0, 0, 0, 371, 369, 1, 0, 0, 0, 372, 373, 5, 11,
    0, 0, 373, 57, 1, 0, 0, 0, 374, 380, 5, 17, 0, 0, 375, 380, 5, 46, 0, 0, 376, 377, 5, 6, 0, 0, 377,
    378, 5, 46, 0, 0, 378, 380, 5, 6, 0, 0, 379, 374, 1, 0, 0, 0, 379, 375, 1, 0, 0, 0, 379, 376, 1,
    0, 0, 0, 380, 381, 1, 0, 0, 0, 381, 387, 5, 42, 0, 0, 382, 388, 5, 17, 0, 0, 383, 388, 5, 46, 0,
    0, 384, 385, 5, 6, 0, 0, 385, 386, 5, 46, 0, 0, 386, 388, 5, 6, 0, 0, 387, 382, 1, 0, 0, 0, 387,
    383, 1, 0, 0, 0, 387, 384, 1, 0, 0, 0, 388, 59, 1, 0, 0, 0, 389, 390, 3, 62, 31, 0, 390, 391, 5,
    1, 0, 0, 391, 396, 3, 46, 23, 0, 392, 393, 5, 2, 0, 0, 393, 395, 3, 46, 23, 0, 394, 392, 1, 0, 0,
    0, 395, 398, 1, 0, 0, 0, 396, 394, 1, 0, 0, 0, 396, 397, 1, 0, 0, 0, 397, 399, 1, 0, 0, 0, 398, 396,
    1, 0, 0, 0, 399, 400, 5, 3, 0, 0, 400, 61, 1, 0, 0, 0, 401, 402, 7, 2, 0, 0, 402, 63, 1, 0, 0, 0, 403,
    404, 5, 5, 0, 0, 404, 405, 5, 47, 0, 0, 405, 416, 5, 12, 0, 0, 406, 407, 5, 13, 0, 0, 407, 408,
    5, 47, 0, 0, 408, 416, 5, 5, 0, 0, 409, 410, 5, 5, 0, 0, 410, 411, 5, 47, 0, 0, 411, 416, 5, 5, 0,
    0, 412, 413, 5, 13, 0, 0, 413, 414, 5, 47, 0, 0, 414, 416, 5, 12, 0, 0, 415, 403, 1, 0, 0, 0, 415,
    406, 1, 0, 0, 0, 415, 409, 1, 0, 0, 0, 415, 412, 1, 0, 0, 0, 416, 65, 1, 0, 0, 0, 52, 70, 72, 79,
    85, 88, 94, 97, 106, 109, 119, 123, 126, 133, 139, 146, 149, 158, 162, 165, 169, 179, 186,
    193, 197, 202, 209, 214, 219, 223, 231, 240, 255, 266, 268, 278, 283, 287, 297, 306, 314,
    321, 323, 331, 343, 349, 357, 365, 369, 379, 387, 396, 415];
PolicyParser.DecisionsToDFA = PolicyParser._ATN.decisionToState.map((ds, index) => new antlr4_1.DFA(ds, index));
exports["default"] = PolicyParser;
class PolicyContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    EOF() {
        return this.getToken(PolicyParser.EOF, 0);
    }
    allowExpression_list() {
        return this.getTypedRuleContexts(AllowExpressionContext);
    }
    allowExpression(i) {
        return this.getTypedRuleContext(AllowExpressionContext, i);
    }
    endorseExpression_list() {
        return this.getTypedRuleContexts(EndorseExpressionContext);
    }
    endorseExpression(i) {
        return this.getTypedRuleContext(EndorseExpressionContext, i);
    }
    defineExpression_list() {
        return this.getTypedRuleContexts(DefineExpressionContext);
    }
    defineExpression(i) {
        return this.getTypedRuleContext(DefineExpressionContext, i);
    }
    admitExpression_list() {
        return this.getTypedRuleContexts(AdmitExpressionContext);
    }
    admitExpression(i) {
        return this.getTypedRuleContext(AdmitExpressionContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_policy;
    }
    enterRule(listener) {
        if (listener.enterPolicy) {
            listener.enterPolicy(this);
        }
    }
    exitRule(listener) {
        if (listener.exitPolicy) {
            listener.exitPolicy(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPolicy) {
            return visitor.visitPolicy(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PolicyContext = PolicyContext;
class AllowExpressionContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ALLOW() {
        return this.getToken(PolicyParser.ALLOW, 0);
    }
    subject() {
        return this.getTypedRuleContext(SubjectContext, 0);
    }
    IN() {
        return this.getToken(PolicyParser.IN, 0);
    }
    scope() {
        return this.getTypedRuleContext(ScopeContext, 0);
    }
    verb() {
        return this.getTypedRuleContext(VerbContext, 0);
    }
    resource() {
        return this.getTypedRuleContext(ResourceContext, 0);
    }
    permissionList() {
        return this.getTypedRuleContext(PermissionListContext, 0);
    }
    WHERE() {
        return this.getToken(PolicyParser.WHERE, 0);
    }
    condition() {
        return this.getTypedRuleContext(ConditionContext, 0);
    }
    NEWLINE() {
        return this.getToken(PolicyParser.NEWLINE, 0);
    }
    TO() {
        return this.getToken(PolicyParser.TO, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_allowExpression;
    }
    enterRule(listener) {
        if (listener.enterAllowExpression) {
            listener.enterAllowExpression(this);
        }
    }
    exitRule(listener) {
        if (listener.exitAllowExpression) {
            listener.exitAllowExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAllowExpression) {
            return visitor.visitAllowExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AllowExpressionContext = AllowExpressionContext;
class EndorseExpressionContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ENDORSE() {
        return this.getToken(PolicyParser.ENDORSE, 0);
    }
    subject() {
        return this.getTypedRuleContext(SubjectContext, 0);
    }
    IN_list() {
        return this.getTokens(PolicyParser.IN);
    }
    IN(i) {
        return this.getToken(PolicyParser.IN, i);
    }
    TO() {
        return this.getToken(PolicyParser.TO, 0);
    }
    endorseVerb() {
        return this.getTypedRuleContext(EndorseVerbContext, 0);
    }
    resource_list() {
        return this.getTypedRuleContexts(ResourceContext);
    }
    resource(i) {
        return this.getTypedRuleContext(ResourceContext, i);
    }
    permissionList() {
        return this.getTypedRuleContext(PermissionListContext, 0);
    }
    endorseScope() {
        return this.getTypedRuleContext(EndorseScopeContext, 0);
    }
    WHERE() {
        return this.getToken(PolicyParser.WHERE, 0);
    }
    condition() {
        return this.getTypedRuleContext(ConditionContext, 0);
    }
    NEWLINE() {
        return this.getToken(PolicyParser.NEWLINE, 0);
    }
    scope() {
        return this.getTypedRuleContext(ScopeContext, 0);
    }
    WITH() {
        return this.getToken(PolicyParser.WITH, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_endorseExpression;
    }
    enterRule(listener) {
        if (listener.enterEndorseExpression) {
            listener.enterEndorseExpression(this);
        }
    }
    exitRule(listener) {
        if (listener.exitEndorseExpression) {
            listener.exitEndorseExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEndorseExpression) {
            return visitor.visitEndorseExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EndorseExpressionContext = EndorseExpressionContext;
class DefineExpressionContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    DEFINE() {
        return this.getToken(PolicyParser.DEFINE, 0);
    }
    definedSubject() {
        return this.getTypedRuleContext(DefinedSubjectContext, 0);
    }
    AS() {
        return this.getToken(PolicyParser.AS, 0);
    }
    defined() {
        return this.getTypedRuleContext(DefinedContext, 0);
    }
    NEWLINE() {
        return this.getToken(PolicyParser.NEWLINE, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_defineExpression;
    }
    enterRule(listener) {
        if (listener.enterDefineExpression) {
            listener.enterDefineExpression(this);
        }
    }
    exitRule(listener) {
        if (listener.exitDefineExpression) {
            listener.exitDefineExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDefineExpression) {
            return visitor.visitDefineExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DefineExpressionContext = DefineExpressionContext;
class AdmitExpressionContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ADMIT() {
        return this.getToken(PolicyParser.ADMIT, 0);
    }
    subject() {
        return this.getTypedRuleContext(SubjectContext, 0);
    }
    IN_list() {
        return this.getTokens(PolicyParser.IN);
    }
    IN(i) {
        return this.getToken(PolicyParser.IN, i);
    }
    scope() {
        return this.getTypedRuleContext(ScopeContext, 0);
    }
    TO() {
        return this.getToken(PolicyParser.TO, 0);
    }
    endorseVerb() {
        return this.getTypedRuleContext(EndorseVerbContext, 0);
    }
    resource_list() {
        return this.getTypedRuleContexts(ResourceContext);
    }
    resource(i) {
        return this.getTypedRuleContext(ResourceContext, i);
    }
    permissionList() {
        return this.getTypedRuleContext(PermissionListContext, 0);
    }
    OF() {
        return this.getToken(PolicyParser.OF, 0);
    }
    endorseScope_list() {
        return this.getTypedRuleContexts(EndorseScopeContext);
    }
    endorseScope(i) {
        return this.getTypedRuleContext(EndorseScopeContext, i);
    }
    WITH() {
        return this.getToken(PolicyParser.WITH, 0);
    }
    WHERE() {
        return this.getToken(PolicyParser.WHERE, 0);
    }
    condition() {
        return this.getTypedRuleContext(ConditionContext, 0);
    }
    NEWLINE() {
        return this.getToken(PolicyParser.NEWLINE, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_admitExpression;
    }
    enterRule(listener) {
        if (listener.enterAdmitExpression) {
            listener.enterAdmitExpression(this);
        }
    }
    exitRule(listener) {
        if (listener.exitAdmitExpression) {
            listener.exitAdmitExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAdmitExpression) {
            return visitor.visitAdmitExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AdmitExpressionContext = AdmitExpressionContext;
class EndorseVerbContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    verb() {
        return this.getTypedRuleContext(VerbContext, 0);
    }
    ASSOCIATE() {
        return this.getToken(PolicyParser.ASSOCIATE, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_endorseVerb;
    }
    enterRule(listener) {
        if (listener.enterEndorseVerb) {
            listener.enterEndorseVerb(this);
        }
    }
    exitRule(listener) {
        if (listener.exitEndorseVerb) {
            listener.exitEndorseVerb(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEndorseVerb) {
            return visitor.visitEndorseVerb(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EndorseVerbContext = EndorseVerbContext;
class VerbContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    INSPECT() {
        return this.getToken(PolicyParser.INSPECT, 0);
    }
    READ() {
        return this.getToken(PolicyParser.READ, 0);
    }
    USE() {
        return this.getToken(PolicyParser.USE, 0);
    }
    MANAGE() {
        return this.getToken(PolicyParser.MANAGE, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_verb;
    }
    enterRule(listener) {
        if (listener.enterVerb) {
            listener.enterVerb(this);
        }
    }
    exitRule(listener) {
        if (listener.exitVerb) {
            listener.exitVerb(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitVerb) {
            return visitor.visitVerb(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.VerbContext = VerbContext;
class PermissionListContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_permissionList;
    }
    enterRule(listener) {
        if (listener.enterPermissionList) {
            listener.enterPermissionList(this);
        }
    }
    exitRule(listener) {
        if (listener.exitPermissionList) {
            listener.exitPermissionList(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPermissionList) {
            return visitor.visitPermissionList(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PermissionListContext = PermissionListContext;
class ScopeContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    TENANCY() {
        return this.getToken(PolicyParser.TENANCY, 0);
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    HCL_VAR_list() {
        return this.getTokens(PolicyParser.HCL_VAR);
    }
    HCL_VAR(i) {
        return this.getToken(PolicyParser.HCL_VAR, i);
    }
    COMPARTMENT() {
        return this.getToken(PolicyParser.COMPARTMENT, 0);
    }
    ID() {
        return this.getToken(PolicyParser.ID, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_scope;
    }
    enterRule(listener) {
        if (listener.enterScope) {
            listener.enterScope(this);
        }
    }
    exitRule(listener) {
        if (listener.exitScope) {
            listener.exitScope(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScope) {
            return visitor.visitScope(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ScopeContext = ScopeContext;
class EndorseScopeContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ANYTENANCY() {
        return this.getToken(PolicyParser.ANYTENANCY, 0);
    }
    TENANCY() {
        return this.getToken(PolicyParser.TENANCY, 0);
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_endorseScope;
    }
    enterRule(listener) {
        if (listener.enterEndorseScope) {
            listener.enterEndorseScope(this);
        }
    }
    exitRule(listener) {
        if (listener.exitEndorseScope) {
            listener.exitEndorseScope(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEndorseScope) {
            return visitor.visitEndorseScope(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EndorseScopeContext = EndorseScopeContext;
class SubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    groupSubject() {
        return this.getTypedRuleContext(GroupSubjectContext, 0);
    }
    serviceSubject() {
        return this.getTypedRuleContext(ServiceSubjectContext, 0);
    }
    dynamicGroupSubject() {
        return this.getTypedRuleContext(DynamicGroupSubjectContext, 0);
    }
    resourceSubject() {
        return this.getTypedRuleContext(ResourceSubjectContext, 0);
    }
    ANYUSER() {
        return this.getToken(PolicyParser.ANYUSER, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_subject;
    }
    enterRule(listener) {
        if (listener.enterSubject) {
            listener.enterSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitSubject) {
            listener.exitSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSubject) {
            return visitor.visitSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SubjectContext = SubjectContext;
class GroupSubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    GROUP() {
        return this.getToken(PolicyParser.GROUP, 0);
    }
    groupName_list() {
        return this.getTypedRuleContexts(GroupNameContext);
    }
    groupName(i) {
        return this.getTypedRuleContext(GroupNameContext, i);
    }
    groupID_list() {
        return this.getTypedRuleContexts(GroupIDContext);
    }
    groupID(i) {
        return this.getTypedRuleContext(GroupIDContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_groupSubject;
    }
    enterRule(listener) {
        if (listener.enterGroupSubject) {
            listener.enterGroupSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitGroupSubject) {
            listener.exitGroupSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitGroupSubject) {
            return visitor.visitGroupSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.GroupSubjectContext = GroupSubjectContext;
class ResourceSubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    RESOURCE() {
        return this.getToken(PolicyParser.RESOURCE, 0);
    }
    resourceSubjectId_list() {
        return this.getTypedRuleContexts(ResourceSubjectIdContext);
    }
    resourceSubjectId(i) {
        return this.getTypedRuleContext(ResourceSubjectIdContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_resourceSubject;
    }
    enterRule(listener) {
        if (listener.enterResourceSubject) {
            listener.enterResourceSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitResourceSubject) {
            listener.exitResourceSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitResourceSubject) {
            return visitor.visitResourceSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ResourceSubjectContext = ResourceSubjectContext;
class ServiceSubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    SERVICE() {
        return this.getToken(PolicyParser.SERVICE, 0);
    }
    serviceSubjectId_list() {
        return this.getTypedRuleContexts(ServiceSubjectIdContext);
    }
    serviceSubjectId(i) {
        return this.getTypedRuleContext(ServiceSubjectIdContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_serviceSubject;
    }
    enterRule(listener) {
        if (listener.enterServiceSubject) {
            listener.enterServiceSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitServiceSubject) {
            listener.exitServiceSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitServiceSubject) {
            return visitor.visitServiceSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ServiceSubjectContext = ServiceSubjectContext;
class GroupNameContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    QUOTED_STRING_list() {
        return this.getTokens(PolicyParser.QUOTED_STRING);
    }
    QUOTED_STRING(i) {
        return this.getToken(PolicyParser.QUOTED_STRING, i);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_groupName;
    }
    enterRule(listener) {
        if (listener.enterGroupName) {
            listener.enterGroupName(this);
        }
    }
    exitRule(listener) {
        if (listener.exitGroupName) {
            listener.exitGroupName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitGroupName) {
            return visitor.visitGroupName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.GroupNameContext = GroupNameContext;
class ResourceSubjectIdContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    HCL_VAR_list() {
        return this.getTokens(PolicyParser.HCL_VAR);
    }
    HCL_VAR(i) {
        return this.getToken(PolicyParser.HCL_VAR, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_resourceSubjectId;
    }
    enterRule(listener) {
        if (listener.enterResourceSubjectId) {
            listener.enterResourceSubjectId(this);
        }
    }
    exitRule(listener) {
        if (listener.exitResourceSubjectId) {
            listener.exitResourceSubjectId(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitResourceSubjectId) {
            return visitor.visitResourceSubjectId(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ResourceSubjectIdContext = ResourceSubjectIdContext;
class ServiceSubjectIdContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_serviceSubjectId;
    }
    enterRule(listener) {
        if (listener.enterServiceSubjectId) {
            listener.enterServiceSubjectId(this);
        }
    }
    exitRule(listener) {
        if (listener.exitServiceSubjectId) {
            listener.exitServiceSubjectId(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitServiceSubjectId) {
            return visitor.visitServiceSubjectId(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ServiceSubjectIdContext = ServiceSubjectIdContext;
class GroupIDContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ID() {
        return this.getToken(PolicyParser.ID, 0);
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_groupID;
    }
    enterRule(listener) {
        if (listener.enterGroupID) {
            listener.enterGroupID(this);
        }
    }
    exitRule(listener) {
        if (listener.exitGroupID) {
            listener.exitGroupID(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitGroupID) {
            return visitor.visitGroupID(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.GroupIDContext = GroupIDContext;
class DynamicGroupSubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    DYNAMICGROUP() {
        return this.getToken(PolicyParser.DYNAMICGROUP, 0);
    }
    groupName_list() {
        return this.getTypedRuleContexts(GroupNameContext);
    }
    groupName(i) {
        return this.getTypedRuleContext(GroupNameContext, i);
    }
    groupID_list() {
        return this.getTypedRuleContexts(GroupIDContext);
    }
    groupID(i) {
        return this.getTypedRuleContext(GroupIDContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_dynamicGroupSubject;
    }
    enterRule(listener) {
        if (listener.enterDynamicGroupSubject) {
            listener.enterDynamicGroupSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitDynamicGroupSubject) {
            listener.exitDynamicGroupSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDynamicGroupSubject) {
            return visitor.visitDynamicGroupSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DynamicGroupSubjectContext = DynamicGroupSubjectContext;
class TenancySubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    TENANCY() {
        return this.getToken(PolicyParser.TENANCY, 0);
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_tenancySubject;
    }
    enterRule(listener) {
        if (listener.enterTenancySubject) {
            listener.enterTenancySubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitTenancySubject) {
            listener.exitTenancySubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTenancySubject) {
            return visitor.visitTenancySubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TenancySubjectContext = TenancySubjectContext;
class DefinedSubjectContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    groupSubject() {
        return this.getTypedRuleContext(GroupSubjectContext, 0);
    }
    dynamicGroupSubject() {
        return this.getTypedRuleContext(DynamicGroupSubjectContext, 0);
    }
    serviceSubject() {
        return this.getTypedRuleContext(ServiceSubjectContext, 0);
    }
    tenancySubject() {
        return this.getTypedRuleContext(TenancySubjectContext, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_definedSubject;
    }
    enterRule(listener) {
        if (listener.enterDefinedSubject) {
            listener.enterDefinedSubject(this);
        }
    }
    exitRule(listener) {
        if (listener.exitDefinedSubject) {
            listener.exitDefinedSubject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDefinedSubject) {
            return visitor.visitDefinedSubject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DefinedSubjectContext = DefinedSubjectContext;
class DefinedContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_defined;
    }
    enterRule(listener) {
        if (listener.enterDefined) {
            listener.enterDefined(this);
        }
    }
    exitRule(listener) {
        if (listener.exitDefined) {
            listener.exitDefined(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDefined) {
            return visitor.visitDefined(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DefinedContext = DefinedContext;
class ResourceContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_resource;
    }
    enterRule(listener) {
        if (listener.enterResource) {
            listener.enterResource(this);
        }
    }
    exitRule(listener) {
        if (listener.exitResource) {
            listener.exitResource(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitResource) {
            return visitor.visitResource(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ResourceContext = ResourceContext;
class ConditionContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    comparisonList() {
        return this.getTypedRuleContext(ComparisonListContext, 0);
    }
    comparison() {
        return this.getTypedRuleContext(ComparisonContext, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_condition;
    }
    enterRule(listener) {
        if (listener.enterCondition) {
            listener.enterCondition(this);
        }
    }
    exitRule(listener) {
        if (listener.exitCondition) {
            listener.exitCondition(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCondition) {
            return visitor.visitCondition(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ConditionContext = ConditionContext;
class ComparisonContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    variable() {
        return this.getTypedRuleContext(VariableContext, 0);
    }
    operator() {
        return this.getTypedRuleContext(OperatorContext, 0);
    }
    value() {
        return this.getTypedRuleContext(ValueContext, 0);
    }
    valueList() {
        return this.getTypedRuleContext(ValueListContext, 0);
    }
    timeWindow() {
        return this.getTypedRuleContext(TimeWindowContext, 0);
    }
    patternMatch() {
        return this.getTypedRuleContext(PatternMatchContext, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_comparison;
    }
    enterRule(listener) {
        if (listener.enterComparison) {
            listener.enterComparison(this);
        }
    }
    exitRule(listener) {
        if (listener.exitComparison) {
            listener.exitComparison(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComparison) {
            return visitor.visitComparison(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComparisonContext = ComparisonContext;
class VariableContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    HCL_VAR_list() {
        return this.getTokens(PolicyParser.HCL_VAR);
    }
    HCL_VAR(i) {
        return this.getToken(PolicyParser.HCL_VAR, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_variable;
    }
    enterRule(listener) {
        if (listener.enterVariable) {
            listener.enterVariable(this);
        }
    }
    exitRule(listener) {
        if (listener.exitVariable) {
            listener.exitVariable(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitVariable) {
            return visitor.visitVariable(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.VariableContext = VariableContext;
class OperatorContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    BEFORE() {
        return this.getToken(PolicyParser.BEFORE, 0);
    }
    IN() {
        return this.getToken(PolicyParser.IN, 0);
    }
    BETWEEN() {
        return this.getToken(PolicyParser.BETWEEN, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_operator;
    }
    enterRule(listener) {
        if (listener.enterOperator) {
            listener.enterOperator(this);
        }
    }
    exitRule(listener) {
        if (listener.exitOperator) {
            listener.exitOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOperator) {
            return visitor.visitOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OperatorContext = OperatorContext;
class ValueContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD_list() {
        return this.getTokens(PolicyParser.WORD);
    }
    WORD(i) {
        return this.getToken(PolicyParser.WORD, i);
    }
    QUOTED_STRING() {
        return this.getToken(PolicyParser.QUOTED_STRING, 0);
    }
    HCL_VAR() {
        return this.getToken(PolicyParser.HCL_VAR, 0);
    }
    WS_list() {
        return this.getTokens(PolicyParser.WS);
    }
    WS(i) {
        return this.getToken(PolicyParser.WS, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_value;
    }
    enterRule(listener) {
        if (listener.enterValue) {
            listener.enterValue(this);
        }
    }
    exitRule(listener) {
        if (listener.exitValue) {
            listener.exitValue(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitValue) {
            return visitor.visitValue(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ValueContext = ValueContext;
class ValueListContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    QUOTED_STRING_list() {
        return this.getTokens(PolicyParser.QUOTED_STRING);
    }
    QUOTED_STRING(i) {
        return this.getToken(PolicyParser.QUOTED_STRING, i);
    }
    HCL_VAR_list() {
        return this.getTokens(PolicyParser.HCL_VAR);
    }
    HCL_VAR(i) {
        return this.getToken(PolicyParser.HCL_VAR, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_valueList;
    }
    enterRule(listener) {
        if (listener.enterValueList) {
            listener.enterValueList(this);
        }
    }
    exitRule(listener) {
        if (listener.exitValueList) {
            listener.exitValueList(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitValueList) {
            return visitor.visitValueList(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ValueListContext = ValueListContext;
class TimeWindowContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    AND() {
        return this.getToken(PolicyParser.AND, 0);
    }
    QUOTED_STRING_list() {
        return this.getTokens(PolicyParser.QUOTED_STRING);
    }
    QUOTED_STRING(i) {
        return this.getToken(PolicyParser.QUOTED_STRING, i);
    }
    HCL_VAR_list() {
        return this.getTokens(PolicyParser.HCL_VAR);
    }
    HCL_VAR(i) {
        return this.getToken(PolicyParser.HCL_VAR, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_timeWindow;
    }
    enterRule(listener) {
        if (listener.enterTimeWindow) {
            listener.enterTimeWindow(this);
        }
    }
    exitRule(listener) {
        if (listener.exitTimeWindow) {
            listener.exitTimeWindow(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTimeWindow) {
            return visitor.visitTimeWindow(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TimeWindowContext = TimeWindowContext;
class ComparisonListContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    logicalCombine() {
        return this.getTypedRuleContext(LogicalCombineContext, 0);
    }
    condition_list() {
        return this.getTypedRuleContexts(ConditionContext);
    }
    condition(i) {
        return this.getTypedRuleContext(ConditionContext, i);
    }
    get ruleIndex() {
        return PolicyParser.RULE_comparisonList;
    }
    enterRule(listener) {
        if (listener.enterComparisonList) {
            listener.enterComparisonList(this);
        }
    }
    exitRule(listener) {
        if (listener.exitComparisonList) {
            listener.exitComparisonList(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComparisonList) {
            return visitor.visitComparisonList(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComparisonListContext = ComparisonListContext;
class LogicalCombineContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    ALL() {
        return this.getToken(PolicyParser.ALL, 0);
    }
    ANY() {
        return this.getToken(PolicyParser.ANY, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_logicalCombine;
    }
    enterRule(listener) {
        if (listener.enterLogicalCombine) {
            listener.enterLogicalCombine(this);
        }
    }
    exitRule(listener) {
        if (listener.exitLogicalCombine) {
            listener.exitLogicalCombine(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitLogicalCombine) {
            return visitor.visitLogicalCombine(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.LogicalCombineContext = LogicalCombineContext;
class PatternMatchContext extends antlr4_1.ParserRuleContext {
    constructor(parser, parent, invokingState) {
        super(parent, invokingState);
        this.parser = parser;
    }
    WORD() {
        return this.getToken(PolicyParser.WORD, 0);
    }
    get ruleIndex() {
        return PolicyParser.RULE_patternMatch;
    }
    enterRule(listener) {
        if (listener.enterPatternMatch) {
            listener.enterPatternMatch(this);
        }
    }
    exitRule(listener) {
        if (listener.exitPatternMatch) {
            listener.exitPatternMatch(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPatternMatch) {
            return visitor.visitPatternMatch(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PatternMatchContext = PatternMatchContext;


/***/ }),

/***/ 235:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CliOperations = void 0;
/**
 * CLI implementation of PlatformOperations
 */
class CliOperations {
    getInput(name, required = false) {
        // For CLI, get inputs from environment variables with POLICY_ prefix
        const envName = `POLICY_${name.replace(/-/g, '_').toUpperCase()}`;
        const value = process.env[envName] || '';
        if (required && !value) {
            throw new Error(`Required input missing: ${name}`);
        }
        return value;
    }
    setOutput(name, value) {
        // For CLI, simply log the output as JSON
        console.log(JSON.stringify({ [name]: value }));
    }
    setResult(success, message) {
        if (!success) {
            if (message) {
                console.error(message);
            }
            // Check if we should exit on error
            if (this.getInput('exit-on-error') === 'true') {
                process.exit(1);
            }
        }
        else if (message) {
            console.log(message);
        }
    }
    debug(message) {
        if (process.env.POLICY_VERBOSE === 'true') {
            console.error(`DEBUG: ${message}`);
        }
    }
    info(message) {
        if (process.env.POLICY_VERBOSE === 'true') {
            console.error(`INFO: ${message}`);
        }
    }
    warning(message) {
        console.error(`WARNING: ${message}`);
    }
    error(message) {
        console.error(`ERROR: ${message}`);
    }
    createLogger() {
        return {
            debug: (msg) => this.debug(msg),
            info: (msg) => this.info(msg),
            warn: (msg) => this.warning(msg),
            error: (msg) => this.error(msg)
        };
    }
}
exports.CliOperations = CliOperations;


/***/ }),

/***/ 164:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.POLICY_STATEMENTS_REGEX = exports.ExpressionType = void 0;
var ExpressionType;
(function (ExpressionType) {
    ExpressionType["Allow"] = "Allow";
    ExpressionType["Define"] = "Define";
    ExpressionType["Endorse"] = "Endorse";
    ExpressionType["Admit"] = "Admit";
})(ExpressionType || (exports.ExpressionType = ExpressionType = {}));
/**
 * Get policy statements regex pattern from environment or use default
 * This allows different CI platforms to configure their own pattern if needed
 */
exports.POLICY_STATEMENTS_REGEX = new RegExp(process.env.POLICY_STATEMENTS_PATTERN ||
    'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]', 'sg');


/***/ }),

/***/ 122:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OciCisBenchmarkValidator = void 0;
const antlr4_1 = __nccwpck_require__(370);
const PolicyLexer_1 = __importDefault(__nccwpck_require__(612));
const PolicyParser_1 = __importDefault(__nccwpck_require__(597));
const OciCisListener_1 = __nccwpck_require__(63);
/**
 * Validates OCI policies against CIS Benchmark v2 controls
 */
class OciCisBenchmarkValidator {
    constructor(logger) {
        this.cisChecks = [
            {
                id: 'CIS-OCI-1.1',
                name: 'Service-Level Admins',
                description: 'Ensure service level admins are created to manage resources of particular service'
            },
            {
                id: 'CIS-OCI-1.2',
                name: 'Least Privilege',
                description: 'Ensure permissions on all resources are given only to the groups that need them'
            },
            {
                id: 'CIS-OCI-1.3',
                name: 'Admin Group Restrictions',
                description: 'Ensure IAM administrators cannot update tenancy Administrators group'
            },
            {
                id: 'CIS-OCI-1.5',
                name: 'Compartment-level Admins',
                description: 'Ensure compartment level admins are used to manage resources in compartments'
            },
            {
                id: 'CIS-OCI-1.13',
                name: 'MFA Enforcement',
                description: 'Ensure multi-factor authentication is enforced for all users with console access'
            },
            {
                id: 'CIS-OCI-5.2',
                name: 'Network Security Groups',
                description: 'Ensure security lists/NSGs are properly configured to restrict access'
            }
        ];
        this.logger = logger;
    }
    name() {
        return 'OCI CIS Benchmark Validator';
    }
    description() {
        return 'Validates OCI IAM policies against CIS Benchmark v2.0 controls';
    }
    getChecks() {
        return this.cisChecks;
    }
    async validate(statements) {
        var _a, _b, _c;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Validating ${statements.length} policy statements against OCI CIS Benchmark`);
        if (statements.length === 0) {
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info('No policy statements to validate');
            return [];
        }
        try {
            // Parse statements and collect findings
            const results = this.analyzePolicy(statements);
            // Generate validation reports for each CIS check
            const reports = [];
            // CIS-OCI-1.1: Service-level admins
            const criticalServices = ['compute', 'database', 'storage', 'network'];
            const foundServiceAdmins = new Set();
            // Check if we have admin policies for each critical service
            results.serviceAdminPolicies.forEach((policy) => {
                criticalServices.forEach(service => {
                    if (policy.toLowerCase().includes(service)) {
                        foundServiceAdmins.add(service);
                    }
                });
            });
            const missingServices = criticalServices.filter(service => !foundServiceAdmins.has(service));
            const serviceAdminsPassed = missingServices.length === 0;
            reports.push({
                checkId: 'CIS-OCI-1.1',
                name: 'Service-Level Admins',
                description: 'Ensure service level admins are created to manage resources of particular service',
                passed: serviceAdminsPassed,
                issues: serviceAdminsPassed ? [] : [{
                        checkId: 'CIS-OCI-1.1',
                        statement: '',
                        message: `Missing service-specific admin policies for: ${missingServices.join(', ')}`,
                        recommendation: 'Create service-specific admin groups with targeted permissions',
                        severity: 'warning'
                    }]
            });
            // CIS-OCI-1.2: Least privilege
            const leastPrivilegePassed = results.overlyPermissivePolicies.length === 0;
            reports.push({
                checkId: 'CIS-OCI-1.2',
                name: 'Least Privilege',
                description: 'Ensure permissions on all resources are given only to the groups that need them',
                passed: leastPrivilegePassed,
                issues: results.overlyPermissivePolicies.map((policy) => ({
                    checkId: 'CIS-OCI-1.2',
                    statement: policy,
                    message: 'Overly permissive policy grants "manage all-resources" without conditions',
                    recommendation: 'Restrict permissions using specific resource types and add conditions',
                    severity: 'error'
                }))
            });
            // CIS-OCI-1.3: Admin group restrictions
            const adminPolicies = statements.filter(policy => policy.toLowerCase().includes('manage') &&
                policy.toLowerCase().includes('group'));
            const adminRestrictionsMissing = adminPolicies.length > 0 &&
                results.adminRestrictionPolicies.length === 0;
            reports.push({
                checkId: 'CIS-OCI-1.3',
                name: 'Admin Group Restrictions',
                description: 'Ensure IAM administrators cannot update tenancy Administrators group',
                passed: !adminRestrictionsMissing,
                issues: adminRestrictionsMissing ? [{
                        checkId: 'CIS-OCI-1.3',
                        statement: adminPolicies[0],
                        message: 'Group management policies do not restrict access to Administrators group',
                        recommendation: 'Add "where target.group.name != \'Administrators\'" to group management policies',
                        severity: 'error'
                    }] : []
            });
            // CIS-OCI-1.5: Compartment-level admins
            const compartmentAdminsPassed = results.compartmentAdminPolicies.length > 0;
            reports.push({
                checkId: 'CIS-OCI-1.5',
                name: 'Compartment-level Admins',
                description: 'Ensure compartment level admins are used to manage resources in compartments',
                passed: compartmentAdminsPassed,
                issues: compartmentAdminsPassed ? [] : [{
                        checkId: 'CIS-OCI-1.5',
                        statement: '',
                        message: 'No compartment-specific admin policies found',
                        recommendation: 'Create policies with "in compartment" scope specification for delegation',
                        severity: 'info'
                    }]
            });
            // CIS-OCI-1.13: MFA enforcement
            const securityPolicies = statements.filter(policy => (policy.toLowerCase().includes('security') ||
                policy.toLowerCase().includes('iam')) &&
                policy.toLowerCase().includes('manage'));
            const mfaMissing = securityPolicies.length > 0 && results.mfaPolicies.length === 0;
            reports.push({
                checkId: 'CIS-OCI-1.13',
                name: 'MFA Enforcement',
                description: 'Ensure multi-factor authentication is enforced for all users with console access',
                passed: !mfaMissing,
                issues: mfaMissing ? [{
                        checkId: 'CIS-OCI-1.13',
                        statement: securityPolicies[0] || '',
                        message: 'Security-related policies do not enforce MFA',
                        recommendation: 'Add "where request.user.mfachallenged == \'true\'" to security policies',
                        severity: 'warning'
                    }] : []
            });
            // CIS-OCI-5.2: Network Security Groups
            const nsgPolicies = statements.filter(policy => policy.toLowerCase().includes('network-security-group'));
            const nsgRestrictionsMissing = nsgPolicies.length > 0 &&
                !nsgPolicies.some(policy => policy.toLowerCase().includes('where'));
            reports.push({
                checkId: 'CIS-OCI-5.2',
                name: 'Network Security Groups',
                description: 'Ensure security lists/NSGs are properly configured to restrict access',
                passed: !nsgRestrictionsMissing,
                issues: nsgRestrictionsMissing ? [{
                        checkId: 'CIS-OCI-5.2',
                        statement: nsgPolicies[0] || '',
                        message: 'Network security group policies lack proper restrictions',
                        recommendation: 'Add conditions to limit access to specific network resources',
                        severity: 'warning'
                    }] : []
            });
            return reports;
        }
        catch (error) {
            (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(`Error validating policies: ${error}`);
            // Return an error report
            return [{
                    checkId: 'CIS-OCI-ERROR',
                    name: 'Validation Error',
                    description: 'An error occurred during validation',
                    passed: false,
                    issues: [{
                            checkId: 'CIS-OCI-ERROR',
                            statement: '',
                            message: `Validation error: ${error}`,
                            recommendation: 'Check policy syntax and try again',
                            severity: 'error'
                        }]
                }];
        }
    }
    /**
     * Analyzes policies using ANTLR parser and listener
     */
    analyzePolicy(statements) {
        var _a, _b;
        const listener = new OciCisListener_1.OciCisListener(statements, this.logger);
        const walker = new antlr4_1.ParseTreeWalker();
        // Process each statement through ANTLR parser
        for (const statement of statements) {
            try {
                const trimmedStatement = statement.trim();
                if (!trimmedStatement)
                    continue;
                const inputStream = antlr4_1.CharStreams.fromString(trimmedStatement);
                const lexer = new PolicyLexer_1.default(inputStream);
                const tokenStream = new antlr4_1.CommonTokenStream(lexer);
                const parser = new PolicyParser_1.default(tokenStream);
                // Use error handling strategy
                parser.removeErrorListeners();
                parser.addErrorListener({
                    syntaxError: (recognizer, offendingSymbol, line, column, msg) => {
                        var _a, _b;
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Parser warning (${line}:${column}): ${msg} in statement: "${trimmedStatement}"`);
                        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug(`Skipping statement due to parsing error: ${statement}`);
                    }
                });
                // Parse and walk the tree
                const tree = parser.policy();
                walker.walk(listener, tree);
            }
            catch (error) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Skipping statement due to parsing error: ${statement}`);
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug(`Error: ${error}`);
            }
        }
        // Get the analysis results
        return listener.getResults();
    }
}
exports.OciCisBenchmarkValidator = OciCisBenchmarkValidator;


/***/ }),

/***/ 63:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OciCisListener = void 0;
/**
 * ANTLR listener that validates OCI policy statements against CIS benchmark controls
 */
class OciCisListener {
    // Implementing missing methods required by PolicyListener interface
    visitTerminal(node) { }
    visitErrorNode(node) { }
    enterEveryRule(node) { }
    exitEveryRule(node) { }
    constructor(statements, logger) {
        this.currentStatement = '';
        this.currentIndex = 0;
        // Results storage
        this.serviceAdminPolicies = [];
        this.overlyPermissivePolicies = [];
        this.adminRestrictionPolicies = [];
        this.mfaPolicies = [];
        this.restrictNsgPolicies = [];
        this.compartmentAdminPolicies = [];
        this.statements = statements;
        this.logger = logger;
    }
    enterPolicy(ctx) {
        if (this.currentIndex < this.statements.length) {
            this.currentStatement = this.statements[this.currentIndex];
            this.currentIndex++;
        }
    }
    exitVerb(ctx) {
        var _a;
        const verb = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.getText()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (verb === 'manage') {
            this.checkOverlyPermissivePolicies();
        }
    }
    exitResource(ctx) {
        var _a;
        const resource = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.getText()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        // Check for network security group specific policies
        if (resource && resource.includes('network-security-groups')) {
            this.restrictNsgPolicies.push(this.currentStatement);
        }
        // Check for specific service-related admin policies
        if (resource) {
            if (this.isServiceSpecificResource(resource)) {
                this.serviceAdminPolicies.push(this.currentStatement);
            }
        }
    }
    exitCondition(ctx) {
        var _a;
        const condition = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.getText()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        // Check for MFA condition
        if (condition && condition.includes('request.user.mfachallenged')) {
            this.mfaPolicies.push(this.currentStatement);
        }
        // Check for admin restriction condition
        if (condition && (condition.includes('target.group.name!=') || condition.includes('target.group.name !='))) {
            if (condition.includes('administrators')) {
                this.adminRestrictionPolicies.push(this.currentStatement);
            }
        }
    }
    exitScope(ctx) {
        var _a;
        const scope = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.getText()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        // Check for compartment-level admin policies
        if (scope && scope.includes('compartment')) {
            this.compartmentAdminPolicies.push(this.currentStatement);
        }
    }
    // Implement other required methods from PolicyListener with empty bodies
    exitPolicy(ctx) { }
    enterAllowExpression(ctx) { }
    exitAllowExpression(ctx) { }
    enterEndorseExpression(ctx) { }
    exitEndorseExpression(ctx) { }
    enterDefineExpression(ctx) { }
    exitDefineExpression(ctx) { }
    enterAdmitExpression(ctx) { }
    exitAdmitExpression(ctx) { }
    enterEndorseVerb(ctx) { }
    exitEndorseVerb(ctx) { }
    enterVerb(ctx) { }
    enterPermissionList(ctx) { }
    exitPermissionList(ctx) { }
    enterScope(ctx) { }
    enterEndorseScope(ctx) { }
    exitEndorseScope(ctx) { }
    enterSubject(ctx) { }
    exitSubject(ctx) { }
    enterGroupSubject(ctx) { }
    exitGroupSubject(ctx) { }
    enterResourceSubject(ctx) { }
    exitResourceSubject(ctx) { }
    enterServiceSubject(ctx) { }
    exitServiceSubject(ctx) { }
    enterGroupName(ctx) { }
    exitGroupName(ctx) { }
    enterResourceSubjectId(ctx) { }
    exitResourceSubjectId(ctx) { }
    enterServiceSubjectId(ctx) { }
    exitServiceSubjectId(ctx) { }
    enterGroupID(ctx) { }
    exitGroupID(ctx) { }
    enterDynamicGroupSubject(ctx) { }
    exitDynamicGroupSubject(ctx) { }
    enterTenancySubject(ctx) { }
    exitTenancySubject(ctx) { }
    enterDefinedSubject(ctx) { }
    exitDefinedSubject(ctx) { }
    enterDefined(ctx) { }
    exitDefined(ctx) { }
    enterResource(ctx) { }
    enterCondition(ctx) { }
    enterComparison(ctx) { }
    exitComparison(ctx) { }
    enterVariable(ctx) { }
    exitVariable(ctx) { }
    enterOperator(ctx) { }
    exitOperator(ctx) { }
    enterValue(ctx) { }
    exitValue(ctx) { }
    enterValueList(ctx) { }
    exitValueList(ctx) { }
    enterTimeWindow(ctx) { }
    exitTimeWindow(ctx) { }
    enterComparisonList(ctx) { }
    exitComparisonList(ctx) { }
    enterLogicalCombine(ctx) { }
    exitLogicalCombine(ctx) { }
    enterPatternMatch(ctx) { }
    exitPatternMatch(ctx) { }
    /**
     * Checks if the current statement has overly permissive permissions
     */
    checkOverlyPermissivePolicies() {
        const statement = this.currentStatement.toLowerCase();
        // Check for overly permissive permissions
        if (statement.includes('manage all-resources') && !statement.includes('where') && !statement.includes('compartment')) {
            this.overlyPermissivePolicies.push(this.currentStatement);
        }
    }
    /**
     * Check if the resource is specific to a particular OCI service
     */
    isServiceSpecificResource(resource) {
        const criticalServices = [
            'compute', 'database', 'object', 'storage',
            'network', 'vcn', 'file-system', 'instances',
            'autonomous-database', 'vault', 'keys', 'volumes'
        ];
        return criticalServices.some(service => resource.includes(service));
    }
    /**
     * Get all collected results
     */
    getResults() {
        return {
            serviceAdminPolicies: this.serviceAdminPolicies,
            overlyPermissivePolicies: this.overlyPermissivePolicies,
            adminRestrictionPolicies: this.adminRestrictionPolicies,
            mfaPolicies: this.mfaPolicies,
            restrictNsgPolicies: this.restrictNsgPolicies,
            compartmentAdminPolicies: this.compartmentAdminPolicies
        };
    }
}
exports.OciCisListener = OciCisListener;


/***/ }),

/***/ 850:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OciSyntaxValidator = void 0;
const antlr4_1 = __nccwpck_require__(370);
const PolicyLexer_1 = __importDefault(__nccwpck_require__(612));
const PolicyParser_1 = __importDefault(__nccwpck_require__(597));
/**
 * Validates OCI policy statements for syntactical correctness according to OCI IAM policy grammar
 */
class OciSyntaxValidator {
    constructor(logger) {
        this.syntaxChecks = [
            {
                id: 'OCI-SYNTAX-1',
                name: 'OCI Policy Syntax',
                description: 'Ensures OCI IAM policy statements follow the correct syntax'
            }
        ];
        this.logger = logger;
    }
    name() {
        return 'OCI Syntax Validator';
    }
    description() {
        return 'Validates OCI IAM policy statements for syntactical correctness';
    }
    getChecks() {
        return this.syntaxChecks;
    }
    async validate(statements) {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Validating ${statements.length} policy statements for syntax correctness`);
        if (statements.length === 0) {
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.info('No policy statements to validate');
            return [];
        }
        const issues = [];
        for (const statement of statements) {
            const trimmedStatement = statement.trim();
            if (!trimmedStatement)
                continue;
            try {
                const inputStream = antlr4_1.CharStreams.fromString(trimmedStatement);
                const lexer = new PolicyLexer_1.default(inputStream);
                const tokenStream = new antlr4_1.CommonTokenStream(lexer);
                const parser = new PolicyParser_1.default(tokenStream);
                // Use error handling strategy
                parser.removeErrorListeners();
                parser.addErrorListener({
                    syntaxError: (recognizer, offendingSymbol, line, charPositionInLine, msg, e) => {
                        var _a, _b, _c;
                        // Reproduce the original detailed error logging format
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error('Failed to parse policy statement:');
                        (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(`Statement: "${trimmedStatement}"`);
                        (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(`Position: ${' '.repeat(charPositionInLine)}^ ${msg}`);
                        issues.push({
                            checkId: 'OCI-SYNTAX-1',
                            statement: trimmedStatement,
                            message: `Syntax error at position ${charPositionInLine}: ${msg}`,
                            recommendation: 'Review OCI IAM policy syntax documentation and correct the statement',
                            severity: 'error'
                        });
                    }
                });
                // Attempt to parse the policy
                parser.policy();
            }
            catch (error) {
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.debug(`Exception while parsing statement: ${trimmedStatement}`);
                (_d = this.logger) === null || _d === void 0 ? void 0 : _d.debug(`Error: ${error}`);
                // Log the error in the same format as syntax errors
                (_e = this.logger) === null || _e === void 0 ? void 0 : _e.error('Failed to parse policy statement:');
                (_f = this.logger) === null || _f === void 0 ? void 0 : _f.error(`Statement: "${trimmedStatement}"`);
                (_g = this.logger) === null || _g === void 0 ? void 0 : _g.error(`Position: ^ ${error instanceof Error ? error.message : String(error)}`);
                issues.push({
                    checkId: 'OCI-SYNTAX-1',
                    statement: trimmedStatement,
                    message: `Failed to parse policy: ${error instanceof Error ? error.message : String(error)}`,
                    recommendation: 'Review OCI IAM policy syntax documentation and correct the statement',
                    severity: 'error'
                });
            }
        }
        // Create validation report
        const report = {
            checkId: 'OCI-SYNTAX-1',
            name: 'OCI Policy Syntax',
            description: 'Ensures OCI IAM policy statements follow the correct syntax',
            passed: issues.length === 0,
            issues: issues
        };
        return [report];
    }
}
exports.OciSyntaxValidator = OciSyntaxValidator;


/***/ }),

/***/ 220:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationPipeline = void 0;
/**
 * Pipeline for running multiple validators on policy statements
 */
class ValidationPipeline {
    constructor(logger) {
        this.validators = [];
        this.logger = logger;
    }
    /**
     * Add a validator to the pipeline
     */
    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }
    /**
     * Run all validators in the pipeline on the given statements
     */
    async validate(statements) {
        var _a, _b, _c, _d;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(`Running validation pipeline with ${this.validators.length} validators`);
        const results = [];
        for (const validator of this.validators) {
            try {
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug(`Running validator: ${validator.name()}`);
                const reports = await validator.validate(statements);
                results.push({
                    validatorName: validator.name(),
                    validatorDescription: validator.description(),
                    reports
                });
                // Log summary of findings
                const failedChecks = reports.filter(report => !report.passed).length;
                const totalChecks = reports.length;
                const issuesCount = reports.reduce((sum, report) => sum + report.issues.length, 0);
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.info(`Validator ${validator.name()} completed: ${totalChecks - failedChecks}/${totalChecks} checks passed, ${issuesCount} issues found`);
            }
            catch (error) {
                (_d = this.logger) === null || _d === void 0 ? void 0 : _d.error(`Error running validator ${validator.name()}: ${error}`);
            }
        }
        return results;
    }
}
exports.ValidationPipeline = ValidationPipeline;


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 379:
/***/ ((module, exports, __nccwpck_require__) => {

const { Argument } = __nccwpck_require__(414);
const { Command } = __nccwpck_require__(552);
const { CommanderError, InvalidArgumentError } = __nccwpck_require__(625);
const { Help } = __nccwpck_require__(153);
const { Option } = __nccwpck_require__(558);

// @ts-check

/**
 * Expose the root command.
 */

exports = module.exports = new Command();
exports.program = exports; // More explicit access to global command.
// Implicit export of createArgument, createCommand, and createOption.

/**
 * Expose classes
 */

exports.Argument = Argument;
exports.Command = Command;
exports.CommanderError = CommanderError;
exports.Help = Help;
exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated
exports.Option = Option;


/***/ }),

/***/ 414:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const { InvalidArgumentError } = __nccwpck_require__(625);

// @ts-check

class Argument {
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @param {string} name
   * @param {string} [description]
   */

  constructor(name, description) {
    this.description = description || '';
    this.variadic = false;
    this.parseArg = undefined;
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.argChoices = undefined;

    switch (name[0]) {
      case '<': // e.g. <required>
        this.required = true;
        this._name = name.slice(1, -1);
        break;
      case '[': // e.g. [optional]
        this.required = false;
        this._name = name.slice(1, -1);
        break;
      default:
        this.required = true;
        this._name = name;
        break;
    }

    if (this._name.length > 3 && this._name.slice(-3) === '...') {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }

  /**
   * Return argument name.
   *
   * @return {string}
   */

  name() {
    return this._name;
  }

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Argument}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   *
   * @param {Function} [fn]
   * @return {Argument}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Only allow argument value to be one of choices.
   *
   * @param {string[]} values
   * @return {Argument}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Make argument required.
   */
  argRequired() {
    this.required = true;
    return this;
  }

  /**
   * Make argument optional.
   */
  argOptional() {
    this.required = false;
    return this;
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Argument} arg
 * @return {string}
 * @api private
 */

function humanReadableArgName(arg) {
  const nameOutput = arg.name() + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']';
}

exports.Argument = Argument;
exports.humanReadableArgName = humanReadableArgName;


/***/ }),

/***/ 552:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const EventEmitter = (__nccwpck_require__(361).EventEmitter);
const childProcess = __nccwpck_require__(81);
const path = __nccwpck_require__(17);
const fs = __nccwpck_require__(147);
const process = __nccwpck_require__(282);

const { Argument, humanReadableArgName } = __nccwpck_require__(414);
const { CommanderError } = __nccwpck_require__(625);
const { Help } = __nccwpck_require__(153);
const { Option, splitOptionFlags, DualOptions } = __nccwpck_require__(558);
const { suggestSimilar } = __nccwpck_require__(592);

// @ts-check

class Command extends EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */

  constructor(name) {
    super();
    /** @type {Command[]} */
    this.commands = [];
    /** @type {Option[]} */
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;
    /** @type {Argument[]} */
    this._args = [];
    /** @type {string[]} */
    this.args = []; // cli args with options removed
    this.rawArgs = [];
    this.processedArgs = []; // like .args but after custom processing and collecting variadic
    this._scriptPath = null;
    this._name = name || '';
    this._optionValues = {};
    this._optionValueSources = {}; // default, env, cli etc
    this._storeOptionsAsProperties = false;
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null; // custom name for executable
    this._executableDir = null; // custom search directory for subcommands
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = '';
    this._summary = '';
    this._argsDescription = undefined; // legacy
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;
    this._lifeCycleHooks = {}; // a hash of arrays
    /** @type {boolean | string} */
    this._showHelpAfterError = false;
    this._showSuggestionAfterError = true;

    // see .configureOutput() for docs
    this._outputConfiguration = {
      writeOut: (str) => process.stdout.write(str),
      writeErr: (str) => process.stderr.write(str),
      getOutHelpWidth: () => process.stdout.isTTY ? process.stdout.columns : undefined,
      getErrHelpWidth: () => process.stderr.isTTY ? process.stderr.columns : undefined,
      outputError: (str, write) => write(str)
    };

    this._hidden = false;
    this._hasHelpOption = true;
    this._helpFlags = '-h, --help';
    this._helpDescription = 'display help for command';
    this._helpShortFlag = '-h';
    this._helpLongFlag = '--help';
    this._addImplicitHelpCommand = undefined; // Deliberately undefined, not decided whether true or false
    this._helpCommandName = 'help';
    this._helpCommandnameAndArgs = 'help [command]';
    this._helpCommandDescription = 'display help for command';
    this._helpConfiguration = {};
  }

  /**
   * Copy settings that are useful to have in common across root command and subcommands.
   *
   * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
   *
   * @param {Command} sourceCommand
   * @return {Command} `this` command for chaining
   */
  copyInheritedSettings(sourceCommand) {
    this._outputConfiguration = sourceCommand._outputConfiguration;
    this._hasHelpOption = sourceCommand._hasHelpOption;
    this._helpFlags = sourceCommand._helpFlags;
    this._helpDescription = sourceCommand._helpDescription;
    this._helpShortFlag = sourceCommand._helpShortFlag;
    this._helpLongFlag = sourceCommand._helpLongFlag;
    this._helpCommandName = sourceCommand._helpCommandName;
    this._helpCommandnameAndArgs = sourceCommand._helpCommandnameAndArgs;
    this._helpCommandDescription = sourceCommand._helpCommandDescription;
    this._helpConfiguration = sourceCommand._helpConfiguration;
    this._exitCallback = sourceCommand._exitCallback;
    this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
    this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
    this._allowExcessArguments = sourceCommand._allowExcessArguments;
    this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
    this._showHelpAfterError = sourceCommand._showHelpAfterError;
    this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;

    return this;
  }

  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * @example
   * // Command implemented using action handler (description is supplied separately to `.command`)
   * program
   *   .command('clone <source> [destination]')
   *   .description('clone a repository into a newly created directory')
   *   .action((source, destination) => {
   *     console.log('clone command called');
   *   });
   *
   * // Command implemented using separate executable file (description is second parameter to `.command`)
   * program
   *   .command('start <service>', 'start named service')
   *   .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {Object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */

  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);

    const cmd = this.createCommand(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    if (args) cmd.arguments(args);
    this.commands.push(cmd);
    cmd.parent = this;
    cmd.copyInheritedSettings(this);

    if (desc) return this;
    return cmd;
  }

  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new Command(name);
  }

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  }

  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureHelp(configuration) {
    if (configuration === undefined) return this._helpConfiguration;

    this._helpConfiguration = configuration;
    return this;
  }

  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *     // functions to change where being written, stdout and stderr
   *     writeOut(str)
   *     writeErr(str)
   *     // matching functions to specify width for wrapping help
   *     getOutHelpWidth()
   *     getErrHelpWidth()
   *     // functions based on what is being written out
   *     outputError(str, write) // used for displaying errors, and not used for displaying help
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureOutput(configuration) {
    if (configuration === undefined) return this._outputConfiguration;

    Object.assign(this._outputConfiguration, configuration);
    return this;
  }

  /**
   * Display the help or a custom message after an error occurs.
   *
   * @param {boolean|string} [displayHelp]
   * @return {Command} `this` command for chaining
   */
  showHelpAfterError(displayHelp = true) {
    if (typeof displayHelp !== 'string') displayHelp = !!displayHelp;
    this._showHelpAfterError = displayHelp;
    return this;
  }

  /**
   * Display suggestion of similar commands for unknown commands, or options for unknown options.
   *
   * @param {boolean} [displaySuggestion]
   * @return {Command} `this` command for chaining
   */
  showSuggestionAfterError(displaySuggestion = true) {
    this._showSuggestionAfterError = !!displaySuggestion;
    return this;
  }

  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {Object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */

  addCommand(cmd, opts) {
    if (!cmd._name) {
      throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
    }

    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

    this.commands.push(cmd);
    cmd.parent = this;
    return this;
  }

  /**
   * Factory routine to create a new unattached argument.
   *
   * See .argument() for creating an attached argument, which uses this routine to
   * create the argument. You can override createArgument to return a custom argument.
   *
   * @param {string} name
   * @param {string} [description]
   * @return {Argument} new argument
   */

  createArgument(name, description) {
    return new Argument(name, description);
  }

  /**
   * Define argument syntax for command.
   *
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @example
   * program.argument('<input-file>');
   * program.argument('[output-file]');
   *
   * @param {string} name
   * @param {string} [description]
   * @param {Function|*} [fn] - custom argument processing function
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  argument(name, description, fn, defaultValue) {
    const argument = this.createArgument(name, description);
    if (typeof fn === 'function') {
      argument.default(defaultValue).argParser(fn);
    } else {
      argument.default(fn);
    }
    this.addArgument(argument);
    return this;
  }

  /**
   * Define argument syntax for command, adding multiple at once (without descriptions).
   *
   * See also .argument().
   *
   * @example
   * program.arguments('<cmd> [env]');
   *
   * @param {string} names
   * @return {Command} `this` command for chaining
   */

  arguments(names) {
    names.split(/ +/).forEach((detail) => {
      this.argument(detail);
    });
    return this;
  }

  /**
   * Define argument syntax for command, adding a prepared argument.
   *
   * @param {Argument} argument
   * @return {Command} `this` command for chaining
   */
  addArgument(argument) {
    const previousArgument = this._args.slice(-1)[0];
    if (previousArgument && previousArgument.variadic) {
      throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
    }
    if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
      throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
    }
    this._args.push(argument);
    return this;
  }

  /**
   * Override default decision whether to add implicit help command.
   *
   *    addHelpCommand() // force on
   *    addHelpCommand(false); // force off
   *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom details
   *
   * @return {Command} `this` command for chaining
   */

  addHelpCommand(enableOrNameAndArgs, description) {
    if (enableOrNameAndArgs === false) {
      this._addImplicitHelpCommand = false;
    } else {
      this._addImplicitHelpCommand = true;
      if (typeof enableOrNameAndArgs === 'string') {
        this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
        this._helpCommandnameAndArgs = enableOrNameAndArgs;
      }
      this._helpCommandDescription = description || this._helpCommandDescription;
    }
    return this;
  }

  /**
   * @return {boolean}
   * @api private
   */

  _hasImplicitHelpCommand() {
    if (this._addImplicitHelpCommand === undefined) {
      return this.commands.length && !this._actionHandler && !this._findCommand('help');
    }
    return this._addImplicitHelpCommand;
  }

  /**
   * Add hook for life cycle event.
   *
   * @param {string} event
   * @param {Function} listener
   * @return {Command} `this` command for chaining
   */

  hook(event, listener) {
    const allowedValues = ['preSubcommand', 'preAction', 'postAction'];
    if (!allowedValues.includes(event)) {
      throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    if (this._lifeCycleHooks[event]) {
      this._lifeCycleHooks[event].push(listener);
    } else {
      this._lifeCycleHooks[event] = [listener];
    }
    return this;
  }

  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */

  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== 'commander.executeSubCommandAsync') {
          throw err;
        } else {
          // Async callback from spawn events, not useful to throw.
        }
      };
    }
    return this;
  }

  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @api private
   */

  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
      // Expecting this line is not reached.
    }
    process.exit(exitCode);
  }

  /**
   * Register callback `fn` for the command.
   *
   * @example
   * program
   *   .command('serve')
   *   .description('start service')
   *   .action(function() {
   *      // do work here
   *   });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */

  action(fn) {
    const listener = (args) => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this._args.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);

      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  }

  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */

  createOption(flags, description) {
    return new Option(flags, description);
  }

  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    const oname = option.name();
    const name = option.attributeName();

    // store default value
    if (option.negate) {
      // --no-foo is special and defaults foo to true, unless a --foo option is already defined
      const positiveLongFlag = option.long.replace(/^--no-/, '--');
      if (!this._findOption(positiveLongFlag)) {
        this.setOptionValueWithSource(name, option.defaultValue === undefined ? true : option.defaultValue, 'default');
      }
    } else if (option.defaultValue !== undefined) {
      this.setOptionValueWithSource(name, option.defaultValue, 'default');
    }

    // register the option
    this.options.push(option);

    // handler for cli and env supplied values
    const handleOptionValue = (val, invalidValueMessage, valueSource) => {
      // val is null for optional option used without an optional-argument.
      // val is undefined for boolean and negated option.
      if (val == null && option.presetArg !== undefined) {
        val = option.presetArg;
      }

      // custom processing
      const oldValue = this.getOptionValue(name);
      if (val !== null && option.parseArg) {
        try {
          val = option.parseArg(val, oldValue);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `${invalidValueMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      } else if (val !== null && option.variadic) {
        val = option._concatValue(val, oldValue);
      }

      // Fill-in appropriate missing values. Long winded but easy to follow.
      if (val == null) {
        if (option.negate) {
          val = false;
        } else if (option.isBoolean() || option.optional) {
          val = true;
        } else {
          val = ''; // not normal, parseArg might have failed or be a mock function for testing
        }
      }
      this.setOptionValueWithSource(name, val, valueSource);
    };

    this.on('option:' + oname, (val) => {
      const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
      handleOptionValue(val, invalidValueMessage, 'cli');
    });

    if (option.envVar) {
      this.on('optionEnv:' + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, 'env');
      });
    }

    return this;
  }

  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @api private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    if (typeof flags === 'object' && flags instanceof Option) {
      throw new Error('To add an Option object use addOption() instead of option() or requiredOption()');
    }
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string contains the short and/or long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *     "-p, --pepper"
   *     "-p|--pepper"
   *     "-p --pepper"
   *
   * @example
   * // simple boolean defaulting to undefined
   * program.option('-p, --pepper', 'add pepper');
   *
   * program.pepper
   * // => undefined
   *
   * --pepper
   * program.pepper
   * // => true
   *
   * // simple boolean defaulting to true (unless non-negated option is also defined)
   * program.option('-C, --no-cheese', 'remove cheese');
   *
   * program.cheese
   * // => true
   *
   * --no-cheese
   * program.cheese
   * // => false
   *
   * // required argument
   * program.option('-C, --chdir <path>', 'change the working directory');
   *
   * --chdir /tmp
   * program.chdir
   * // => "/tmp"
   *
   * // optional argument
   * program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {Function|*} [fn] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  option(flags, description, fn, defaultValue) {
    return this._optionEx({}, flags, description, fn, defaultValue);
  }

  /**
  * Add a required option which must have a value after parsing. This usually means
  * the option must be specified on the command line. (Otherwise the same as .option().)
  *
  * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
  *
  * @param {string} flags
  * @param {string} [description]
  * @param {Function|*} [fn] - custom option processing function or default value
  * @param {*} [defaultValue]
  * @return {Command} `this` command for chaining
  */

  requiredOption(flags, description, fn, defaultValue) {
    return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
  }

  /**
   * Alter parsing of short flags with optional values.
   *
   * @example
   * // for `.option('-f,--flag [value]'):
   * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
   * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {Boolean} [combine=true] - if `true` or omitted, an optional value can be specified directly after the flag.
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  }

  /**
   * Allow unknown options on the command line.
   *
   * @param {Boolean} [allowUnknown=true] - if `true` or omitted, no error will be thrown
   * for unknown options.
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  }

  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {Boolean} [allowExcess=true] - if `true` or omitted, no error will be thrown
   * for excess arguments.
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  }

  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {Boolean} [positional=true]
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  }

  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {Boolean} [passThrough=true]
   * for unknown options.
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
      throw new Error('passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)');
    }
    return this;
  }

  /**
    * Whether to store option values as properties on command object,
    * or store separately (specify false). In both cases the option values can be accessed using .opts().
    *
    * @param {boolean} [storeAsProperties=true]
    * @return {Command} `this` command for chaining
    */

  storeOptionsAsProperties(storeAsProperties = true) {
    this._storeOptionsAsProperties = !!storeAsProperties;
    if (this.options.length) {
      throw new Error('call .storeOptionsAsProperties() before adding options');
    }
    return this;
  }

  /**
   * Retrieve option value.
   *
   * @param {string} key
   * @return {Object} value
   */

  getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  }

  /**
   * Store option value.
   *
   * @param {string} key
   * @param {Object} value
   * @return {Command} `this` command for chaining
   */

  setOptionValue(key, value) {
    return this.setOptionValueWithSource(key, value, undefined);
  }

  /**
    * Store option value and where the value came from.
    *
    * @param {string} key
    * @param {Object} value
    * @param {string} source - expected values are default/config/env/cli/implied
    * @return {Command} `this` command for chaining
    */

  setOptionValueWithSource(key, value, source) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
    this._optionValueSources[key] = source;
    return this;
  }

  /**
    * Get source of option value.
    * Expected values are default | config | env | cli | implied
    *
    * @param {string} key
    * @return {string}
    */

  getOptionValueSource(key) {
    return this._optionValueSources[key];
  }

  /**
    * Get source of option value. See also .optsWithGlobals().
    * Expected values are default | config | env | cli | implied
    *
    * @param {string} key
    * @return {string}
    */

  getOptionValueSourceWithGlobals(key) {
    // global overwrites local, like optsWithGlobals
    let source;
    getCommandAndParents(this).forEach((cmd) => {
      if (cmd.getOptionValueSource(key) !== undefined) {
        source = cmd.getOptionValueSource(key);
      }
    });
    return source;
  }

  /**
   * Get user arguments from implied or explicit arguments.
   * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
   *
   * @api private
   */

  _prepareUserArgs(argv, parseOptions) {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};

    // Default to using process.argv
    if (argv === undefined) {
      argv = process.argv;
      // @ts-ignore: unknown property
      if (process.versions && process.versions.electron) {
        parseOptions.from = 'electron';
      }
    }
    this.rawArgs = argv.slice();

    // make it a little easier for callers by supporting various argv conventions
    let userArgs;
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        // @ts-ignore: unknown property
        if (process.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      default:
        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
    }

    // Find default name for program from arguments.
    if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
    this._name = this._name || 'program';

    return userArgs;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * program.parse(process.argv);
   * program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
   * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */

  parse(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);

    return this;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * await program.parseAsync(process.argv);
   * await program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
   * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {Object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */

  async parseAsync(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    await this._parseCommand([], userArgs);

    return this;
  }

  /**
   * Execute a sub-command executable.
   *
   * @api private
   */

  _executeSubCommand(subcommand, args) {
    args = args.slice();
    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
    const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];

    function findFile(baseDir, baseName) {
      // Look for specified file
      const localBin = path.resolve(baseDir, baseName);
      if (fs.existsSync(localBin)) return localBin;

      // Stop looking if candidate already has an expected extension.
      if (sourceExt.includes(path.extname(baseName))) return undefined;

      // Try all the extensions.
      const foundExt = sourceExt.find(ext => fs.existsSync(`${localBin}${ext}`));
      if (foundExt) return `${localBin}${foundExt}`;

      return undefined;
    }

    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // executableFile and executableDir might be full path, or just a name
    let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
    let executableDir = this._executableDir || '';
    if (this._scriptPath) {
      let resolvedScriptPath; // resolve possible symlink for installed npm binary
      try {
        resolvedScriptPath = fs.realpathSync(this._scriptPath);
      } catch (err) {
        resolvedScriptPath = this._scriptPath;
      }
      executableDir = path.resolve(path.dirname(resolvedScriptPath), executableDir);
    }

    // Look for a local file in preference to a command in PATH.
    if (executableDir) {
      let localFile = findFile(executableDir, executableFile);

      // Legacy search using prefix of script name instead of command name
      if (!localFile && !subcommand._executableFile && this._scriptPath) {
        const legacyName = path.basename(this._scriptPath, path.extname(this._scriptPath));
        if (legacyName !== this._name) {
          localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
        }
      }
      executableFile = localFile || executableFile;
    }

    launchWithNode = sourceExt.includes(path.extname(executableFile));

    let proc;
    if (process.platform !== 'win32') {
      if (launchWithNode) {
        args.unshift(executableFile);
        // add executable arguments to spawn
        args = incrementNodeInspectorPort(process.execArgv).concat(args);

        proc = childProcess.spawn(process.argv[0], args, { stdio: 'inherit' });
      } else {
        proc = childProcess.spawn(executableFile, args, { stdio: 'inherit' });
      }
    } else {
      args.unshift(executableFile);
      // add executable arguments to spawn
      args = incrementNodeInspectorPort(process.execArgv).concat(args);
      proc = childProcess.spawn(process.execPath, args, { stdio: 'inherit' });
    }

    if (!proc.killed) { // testing mainly to avoid leak warnings during unit tests with mocked spawn
      const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
      signals.forEach((signal) => {
        // @ts-ignore
        process.on(signal, () => {
          if (proc.killed === false && proc.exitCode === null) {
            proc.kill(signal);
          }
        });
      });
    }

    // By default terminate process when spawned process terminates.
    // Suppressing the exit if exitCallback defined is a bit messy and of limited use, but does allow process to stay running!
    const exitCallback = this._exitCallback;
    if (!exitCallback) {
      proc.on('close', process.exit.bind(process));
    } else {
      proc.on('close', () => {
        exitCallback(new CommanderError(process.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
      });
    }
    proc.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'ENOENT') {
        const executableDirMessage = executableDir
          ? `searched for local subcommand relative to directory '${executableDir}'`
          : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory';
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      // @ts-ignore
      } else if (err.code === 'EACCES') {
        throw new Error(`'${executableFile}' not executable`);
      }
      if (!exitCallback) {
        process.exit(1);
      } else {
        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  }

  /**
   * @api private
   */

  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });

    let hookResult;
    hookResult = this._chainOrCallSubCommandHook(hookResult, subCommand, 'preSubcommand');
    hookResult = this._chainOrCall(hookResult, () => {
      if (subCommand._executableHandler) {
        this._executeSubCommand(subCommand, operands.concat(unknown));
      } else {
        return subCommand._parseCommand(operands, unknown);
      }
    });
    return hookResult;
  }

  /**
   * Check this.args against expected this._args.
   *
   * @api private
   */

  _checkNumberOfArguments() {
    // too few
    this._args.forEach((arg, i) => {
      if (arg.required && this.args[i] == null) {
        this.missingArgument(arg.name());
      }
    });
    // too many
    if (this._args.length > 0 && this._args[this._args.length - 1].variadic) {
      return;
    }
    if (this.args.length > this._args.length) {
      this._excessArguments(this.args);
    }
  }

  /**
   * Process this.args using this._args and save as this.processedArgs!
   *
   * @api private
   */

  _processArguments() {
    const myParseArg = (argument, value, previous) => {
      // Extra processing for nice error message on parsing failure.
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        try {
          parsedValue = argument.parseArg(value, previous);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      return parsedValue;
    };

    this._checkNumberOfArguments();

    const processedArgs = [];
    this._args.forEach((declaredArg, index) => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        // Collect together remaining arguments for passing together as an array.
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed, v) => {
              return myParseArg(declaredArg, v, processed);
            }, declaredArg.defaultValue);
          }
        } else if (value === undefined) {
          value = [];
        }
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) {
          value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }

  /**
   * Once we have a promise we chain, but call synchronously until then.
   *
   * @param {Promise|undefined} promise
   * @param {Function} fn
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCall(promise, fn) {
    // thenable
    if (promise && promise.then && typeof promise.then === 'function') {
      // already have a promise, chain callback
      return promise.then(() => fn());
    }
    // callback might return a promise
    return fn();
  }

  /**
   *
   * @param {Promise|undefined} promise
   * @param {string} event
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCallHooks(promise, event) {
    let result = promise;
    const hooks = [];
    getCommandAndParents(this)
      .reverse()
      .filter(cmd => cmd._lifeCycleHooks[event] !== undefined)
      .forEach(hookedCommand => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
    if (event === 'postAction') {
      hooks.reverse();
    }

    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => {
        return hookDetail.callback(hookDetail.hookedCommand, this);
      });
    });
    return result;
  }

  /**
   *
   * @param {Promise|undefined} promise
   * @param {Command} subCommand
   * @param {string} event
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCallSubCommandHook(promise, subCommand, event) {
    let result = promise;
    if (this._lifeCycleHooks[event] !== undefined) {
      this._lifeCycleHooks[event].forEach((hook) => {
        result = this._chainOrCall(result, () => {
          return hook(this, subCommand);
        });
      });
    }
    return result;
  }

  /**
   * Process arguments in context of this command.
   * Returns action result, in case it is a promise.
   *
   * @api private
   */

  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    this._parseOptionsEnv(); // after cli, so parseArg not called on both cli and env
    this._parseOptionsImplied();
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);

    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
      if (operands.length === 1) {
        this.help();
      }
      return this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
    }
    if (this._defaultCommandName) {
      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
      return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
    }
    if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
      // probably missing subcommand and no handler, user needs help (and exit)
      this.help({ error: true });
    }

    outputHelpIfRequested(this, parsed.unknown);
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // We do not always call this check to avoid masking a "better" error, like unknown command.
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }
    };

    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();

      let actionResult;
      actionResult = this._chainOrCallHooks(actionResult, 'preAction');
      actionResult = this._chainOrCall(actionResult, () => this._actionHandler(this.processedArgs));
      if (this.parent) {
        actionResult = this._chainOrCall(actionResult, () => {
          this.parent.emit(commandEvent, operands, unknown); // legacy
        });
      }
      actionResult = this._chainOrCallHooks(actionResult, 'postAction');
      return actionResult;
    }
    if (this.parent && this.parent.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown); // legacy
    } else if (operands.length) {
      if (this._findCommand('*')) { // legacy default command
        return this._dispatchSubcommand('*', operands, unknown);
      }
      if (this.listenerCount('command:*')) {
        // skip option check, emit event for possible misspelling suggestion
        this.emit('command:*', operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      checkForUnknownOptions();
      // This command has subcommands and nothing hooked up at this level, so display help (and exit).
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
      // fall through for caller to handle after calling .parse()
    }
  }

  /**
   * Find matching command.
   *
   * @api private
   */
  _findCommand(name) {
    if (!name) return undefined;
    return this.commands.find(cmd => cmd._name === name || cmd._aliases.includes(name));
  }

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @api private
   */

  _findOption(arg) {
    return this.options.find(option => option.is(arg));
  }

  /**
   * Display an error message if a mandatory option does not have a value.
   * Called after checking for help flags in leaf subcommand.
   *
   * @api private
   */

  _checkForMissingMandatoryOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && (cmd.getOptionValue(anOption.attributeName()) === undefined)) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    }
  }

  /**
   * Display an error message if conflicting options are used together in this.
   *
   * @api private
   */
  _checkForConflictingLocalOptions() {
    const definedNonDefaultOptions = this.options.filter(
      (option) => {
        const optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === undefined) {
          return false;
        }
        return this.getOptionValueSource(optionKey) !== 'default';
      }
    );

    const optionsWithConflicting = definedNonDefaultOptions.filter(
      (option) => option.conflictsWith.length > 0
    );

    optionsWithConflicting.forEach((option) => {
      const conflictingAndDefined = definedNonDefaultOptions.find((defined) =>
        option.conflictsWith.includes(defined.attributeName())
      );
      if (conflictingAndDefined) {
        this._conflictingOption(option, conflictingAndDefined);
      }
    });
  }

  /**
   * Display an error message if conflicting options are used together.
   * Called after checking for help flags in leaf subcommand.
   *
   * @api private
   */
  _checkForConflictingOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd._checkForConflictingLocalOptions();
    }
  }

  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Examples:
   *
   *     argv => operands, unknown
   *     --known kkk op => [op], []
   *     op --known kkk => [op], []
   *     sub --unknown uuu op => [sub], [--unknown uuu op]
   *     sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {String[]} argv
   * @return {{operands: String[], unknown: String[]}}
   */

  parseOptions(argv) {
    const operands = []; // operands, not options or values
    const unknown = []; // first unknown option and remaining unknown args
    let dest = operands;
    const args = argv.slice();

    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === '-';
    }

    // parse options
    let activeVariadicOption = null;
    while (args.length) {
      const arg = args.shift();

      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args);
        break;
      }

      if (activeVariadicOption && !maybeOption(arg)) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;

      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args.shift();
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (args.length > 0 && !maybeOption(args[0])) {
              value = args.shift();
            }
            this.emit(`option:${option.name()}`, value);
          } else { // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }

      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option, emit and put back remainder of arg for further processing
            this.emit(`option:${option.name()}`);
            args.unshift(`-${arg.slice(2)}`);
          }
          continue;
        }
      }

      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }

      // Not a recognised option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

      // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
      if (maybeOption(arg)) {
        dest = unknown;
      }

      // If using positionalOptions, stop processing our options at subcommand.
      if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
          operands.push(arg);
          if (args.length > 0) operands.push(...args);
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        }
      }

      // If using passThroughOptions, stop processing options at first command-argument.
      if (this._passThroughOptions) {
        dest.push(arg);
        if (args.length > 0) dest.push(...args);
        break;
      }

      // add arg
      dest.push(arg);
    }

    return { operands, unknown };
  }

  /**
   * Return an object containing local option values as key-value pairs.
   *
   * @return {Object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result = {};
      const len = this.options.length;

      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }

    return this._optionValues;
  }

  /**
   * Return an object containing merged local and global option values as key-value pairs.
   *
   * @return {Object}
   */
  optsWithGlobals() {
    // globals overwrite locals
    return getCommandAndParents(this).reduce(
      (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
      {}
    );
  }

  /**
   * Display error message and exit (or call exitOverride).
   *
   * @param {string} message
   * @param {Object} [errorOptions]
   * @param {string} [errorOptions.code] - an id string representing the error
   * @param {number} [errorOptions.exitCode] - used with process.exit
   */
  error(message, errorOptions) {
    // output handling
    this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
    if (typeof this._showHelpAfterError === 'string') {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr('\n');
      this.outputHelp({ error: true });
    }

    // exit handling
    const config = errorOptions || {};
    const exitCode = config.exitCode || 1;
    const code = config.code || 'commander.error';
    this._exit(exitCode, code, message);
  }

  /**
   * Apply any option related environment variables, if option does
   * not have a value from cli or client code.
   *
   * @api private
   */
  _parseOptionsEnv() {
    this.options.forEach((option) => {
      if (option.envVar && option.envVar in process.env) {
        const optionKey = option.attributeName();
        // Priority check. Do not overwrite cli or options from unknown source (client-code).
        if (this.getOptionValue(optionKey) === undefined || ['default', 'config', 'env'].includes(this.getOptionValueSource(optionKey))) {
          if (option.required || option.optional) { // option can take a value
            // keep very simple, optional always takes value
            this.emit(`optionEnv:${option.name()}`, process.env[option.envVar]);
          } else { // boolean
            // keep very simple, only care that envVar defined and not the value
            this.emit(`optionEnv:${option.name()}`);
          }
        }
      }
    });
  }

  /**
   * Apply any implied option values, if option is undefined or default value.
   *
   * @api private
   */
  _parseOptionsImplied() {
    const dualHelper = new DualOptions(this.options);
    const hasCustomOptionValue = (optionKey) => {
      return this.getOptionValue(optionKey) !== undefined && !['default', 'implied'].includes(this.getOptionValueSource(optionKey));
    };
    this.options
      .filter(option => (option.implied !== undefined) &&
        hasCustomOptionValue(option.attributeName()) &&
        dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option))
      .forEach((option) => {
        Object.keys(option.implied)
          .filter(impliedKey => !hasCustomOptionValue(impliedKey))
          .forEach(impliedKey => {
            this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], 'implied');
          });
      });
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @api private
   */

  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this.error(message, { code: 'commander.missingArgument' });
  }

  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @api private
   */

  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this.error(message, { code: 'commander.optionMissingArgument' });
  }

  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @api private
   */

  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this.error(message, { code: 'commander.missingMandatoryOptionValue' });
  }

  /**
   * `Option` conflicts with another option.
   *
   * @param {Option} option
   * @param {Option} conflictingOption
   * @api private
   */
  _conflictingOption(option, conflictingOption) {
    // The calling code does not know whether a negated option is the source of the
    // value, so do some work to take an educated guess.
    const findBestOptionFromValue = (option) => {
      const optionKey = option.attributeName();
      const optionValue = this.getOptionValue(optionKey);
      const negativeOption = this.options.find(target => target.negate && optionKey === target.attributeName());
      const positiveOption = this.options.find(target => !target.negate && optionKey === target.attributeName());
      if (negativeOption && (
        (negativeOption.presetArg === undefined && optionValue === false) ||
        (negativeOption.presetArg !== undefined && optionValue === negativeOption.presetArg)
      )) {
        return negativeOption;
      }
      return positiveOption || option;
    };

    const getErrorMessage = (option) => {
      const bestOption = findBestOptionFromValue(option);
      const optionKey = bestOption.attributeName();
      const source = this.getOptionValueSource(optionKey);
      if (source === 'env') {
        return `environment variable '${bestOption.envVar}'`;
      }
      return `option '${bestOption.flags}'`;
    };

    const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
    this.error(message, { code: 'commander.conflictingOption' });
  }

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @api private
   */

  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    let suggestion = '';

    if (flag.startsWith('--') && this._showSuggestionAfterError) {
      // Looping to pick up the global options too
      let candidateFlags = [];
      let command = this;
      do {
        const moreFlags = command.createHelp().visibleOptions(command)
          .filter(option => option.long)
          .map(option => option.long);
        candidateFlags = candidateFlags.concat(moreFlags);
        command = command.parent;
      } while (command && !command._enablePositionalOptions);
      suggestion = suggestSimilar(flag, candidateFlags);
    }

    const message = `error: unknown option '${flag}'${suggestion}`;
    this.error(message, { code: 'commander.unknownOption' });
  }

  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @api private
   */

  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;

    const expected = this._args.length;
    const s = (expected === 1) ? '' : 's';
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
    this.error(message, { code: 'commander.excessArguments' });
  }

  /**
   * Unknown command.
   *
   * @api private
   */

  unknownCommand() {
    const unknownName = this.args[0];
    let suggestion = '';

    if (this._showSuggestionAfterError) {
      const candidateNames = [];
      this.createHelp().visibleCommands(this).forEach((command) => {
        candidateNames.push(command.name());
        // just visible alias
        if (command.alias()) candidateNames.push(command.alias());
      });
      suggestion = suggestSimilar(unknownName, candidateNames);
    }

    const message = `error: unknown command '${unknownName}'${suggestion}`;
    this.error(message, { code: 'commander.unknownCommand' });
  }

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * You can optionally supply the  flags and description to override the defaults.
   *
   * @param {string} str
   * @param {string} [flags]
   * @param {string} [description]
   * @return {this | string} `this` command for chaining, or version string if no arguments
   */

  version(str, flags, description) {
    if (str === undefined) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this.options.push(versionOption);
    this.on('option:' + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'commander.version', str);
    });
    return this;
  }

  /**
   * Set the description.
   *
   * @param {string} [str]
   * @param {Object} [argsDescription]
   * @return {string|Command}
   */
  description(str, argsDescription) {
    if (str === undefined && argsDescription === undefined) return this._description;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  }

  /**
   * Set the summary. Used when listed as subcommand of parent.
   *
   * @param {string} [str]
   * @return {string|Command}
   */
  summary(str) {
    if (str === undefined) return this._summary;
    this._summary = str;
    return this;
  }

  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {string|Command}
   */

  alias(alias) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

    /** @type {Command} */
    let command = this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }

    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

    command._aliases.push(alias);
    return this;
  }

  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {string[]|Command}
   */

  aliases(aliases) {
    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
    if (aliases === undefined) return this._aliases;

    aliases.forEach((alias) => this.alias(alias));
    return this;
  }

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {String|Command}
   */

  usage(str) {
    if (str === undefined) {
      if (this._usage) return this._usage;

      const args = this._args.map((arg) => {
        return humanReadableArgName(arg);
      });
      return [].concat(
        (this.options.length || this._hasHelpOption ? '[options]' : []),
        (this.commands.length ? '[command]' : []),
        (this._args.length ? args : [])
      ).join(' ');
    }

    this._usage = str;
    return this;
  }

  /**
   * Get or set the name of the command.
   *
   * @param {string} [str]
   * @return {string|Command}
   */

  name(str) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  }

  /**
   * Set the name of the command from script filename, such as process.argv[1],
   * or require.main.filename, or __filename.
   *
   * (Used internally and public although not documented in README.)
   *
   * @example
   * program.nameFromFilename(require.main.filename);
   *
   * @param {string} filename
   * @return {Command}
   */

  nameFromFilename(filename) {
    this._name = path.basename(filename, path.extname(filename));

    return this;
  }

  /**
   * Get or set the directory for searching for executable subcommands of this command.
   *
   * @example
   * program.executableDir(__dirname);
   * // or
   * program.executableDir('subcommands');
   *
   * @param {string} [path]
   * @return {string|Command}
   */

  executableDir(path) {
    if (path === undefined) return this._executableDir;
    this._executableDir = path;
    return this;
  }

  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */

  helpInformation(contextOptions) {
    const helper = this.createHelp();
    if (helper.helpWidth === undefined) {
      helper.helpWidth = (contextOptions && contextOptions.error) ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
    }
    return helper.formatHelp(this, helper);
  }

  /**
   * @api private
   */

  _getHelpContext(contextOptions) {
    contextOptions = contextOptions || {};
    const context = { error: !!contextOptions.error };
    let write;
    if (context.error) {
      write = (arg) => this._outputConfiguration.writeErr(arg);
    } else {
      write = (arg) => this._outputConfiguration.writeOut(arg);
    }
    context.write = contextOptions.write || write;
    context.command = this;
    return context;
  }

  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }
    const context = this._getHelpContext(contextOptions);

    getCommandAndParents(this).reverse().forEach(command => command.emit('beforeAllHelp', context));
    this.emit('beforeHelp', context);

    let helpInformation = this.helpInformation(context);
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    context.write(helpInformation);

    this.emit(this._helpLongFlag); // deprecated
    this.emit('afterHelp', context);
    getCommandAndParents(this).forEach(command => command.emit('afterAllHelp', context));
  }

  /**
   * You can pass in flags and a description to override the help
   * flags and help description for your command. Pass in false to
   * disable the built-in help option.
   *
   * @param {string | boolean} [flags]
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */

  helpOption(flags, description) {
    if (typeof flags === 'boolean') {
      this._hasHelpOption = flags;
      return this;
    }
    this._helpFlags = flags || this._helpFlags;
    this._helpDescription = description || this._helpDescription;

    const helpFlags = splitOptionFlags(this._helpFlags);
    this._helpShortFlag = helpFlags.shortFlag;
    this._helpLongFlag = helpFlags.longFlag;

    return this;
  }

  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = process.exitCode || 0;
    if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) {
      exitCode = 1;
    }
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'commander.help', '(outputHelp)');
  }

  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {string | Function} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */
  addHelpText(position, text) {
    const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    const helpEvent = `${position}Help`;
    this.on(helpEvent, (context) => {
      let helpStr;
      if (typeof text === 'function') {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      // Ignore falsy value when nothing to output.
      if (helpStr) {
        context.write(`${helpStr}\n`);
      }
    });
    return this;
  }
}

/**
 * Output help information if help flags specified
 *
 * @param {Command} cmd - command to output help for
 * @param {Array} args - array of options to search for help flags
 * @api private
 */

function outputHelpIfRequested(cmd, args) {
  const helpOption = cmd._hasHelpOption && args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
  if (helpOption) {
    cmd.outputHelp();
    // (Do not have all displayed text available so only passing placeholder.)
    cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
  }
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @api private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    if (!arg.startsWith('--inspect')) {
      return arg;
    }
    let debugOption;
    let debugHost = '127.0.0.1';
    let debugPort = '9229';
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      // e.g. --inspect
      debugOption = match[1];
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        // e.g. --inspect=1234
        debugPort = match[3];
      } else {
        // e.g. --inspect=localhost
        debugHost = match[3];
      }
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
      // e.g. --inspect=localhost:1234
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }

    if (debugOption && debugPort !== '0') {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}

/**
 * @param {Command} startCommand
 * @returns {Command[]}
 * @api private
 */

function getCommandAndParents(startCommand) {
  const result = [];
  for (let command = startCommand; command; command = command.parent) {
    result.push(command);
  }
  return result;
}

exports.Command = Command;


/***/ }),

/***/ 625:
/***/ ((__unused_webpack_module, exports) => {

// @ts-check

/**
 * CommanderError class
 * @class
 */
class CommanderError extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @constructor
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidArgumentError class
 * @class
 */
class InvalidArgumentError extends CommanderError {
  /**
   * Constructs the InvalidArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.invalidArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

exports.CommanderError = CommanderError;
exports.InvalidArgumentError = InvalidArgumentError;


/***/ }),

/***/ 153:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const { humanReadableArgName } = __nccwpck_require__(414);

/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */

// @ts-check

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help {
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
    this.showGlobalOptions = false;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
      const helpCommand = cmd.createCommand(helpName)
        .helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      if (helpArgs) helpCommand.arguments(helpArgs);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Compare options for sort.
   *
   * @param {Option} a
   * @param {Option} b
   * @returns number
   */
  compareOptions(a, b) {
    const getSortKey = (option) => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
    };
    return getSortKey(a).localeCompare(getSortKey(b));
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions);
    }
    return visibleOptions;
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleGlobalOptions(cmd) {
    if (!this.showGlobalOptions) return [];

    const globalOptions = [];
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      const visibleOptions = parentCmd.options.filter((option) => !option.hidden);
      globalOptions.push(...visibleOptions);
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions);
    }
    return globalOptions;
  }

  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */

  visibleArguments(cmd) {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd._args.forEach(argument => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }

    // If there are any arguments with a description then return all the arguments.
    if (cmd._args.find(argument => argument.description)) {
      return cmd._args;
    }
    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '');
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */

  argumentTerm(argument) {
    return argument.name();
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(max, helper.subcommandTerm(command).length);
    }, 0);
  }

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest global option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestGlobalOptionTermLength(cmd, helper) {
    return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(max, helper.argumentTerm(argument).length);
    }, 0);
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
    }
    return parentCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.summary() || cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    const extraInfo = [];

    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      // default for boolean and negated more for programmer than end user,
      // but show true/false for boolean option as may be for hand-rolled env or config processing.
      const showDefault = option.required || option.optional ||
        (option.isBoolean() && typeof option.defaultValue === 'boolean');
      if (showDefault) {
        extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
      }
    }
    // preset for boolean and negated are more for programmer than end user
    if (option.presetArg !== undefined && option.optional) {
      extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
    }
    if (option.envVar !== undefined) {
      extraInfo.push(`env: ${option.envVar}`);
    }
    if (extraInfo.length > 0) {
      return `${option.description} (${extraInfo.join(', ')})`;
    }

    return option.description;
  }

  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */

  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      const extraDescripton = `(${extraInfo.join(', ')})`;
      if (argument.description) {
        return `${argument.description} ${extraDescripton}`;
      }
      return extraDescripton;
    }
    return argument.description;
  }

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    function formatItem(term, description) {
      if (description) {
        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
      }
      return term;
    }
    function formatList(textArray) {
      return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
    }

    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([commandDescription, '']);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
    });
    if (argumentList.length > 0) {
      output = output.concat(['Arguments:', formatList(argumentList), '']);
    }

    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => {
      return formatItem(helper.optionTerm(option), helper.optionDescription(option));
    });
    if (optionList.length > 0) {
      output = output.concat(['Options:', formatList(optionList), '']);
    }

    if (this.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (globalOptionList.length > 0) {
        output = output.concat(['Global Options:', formatList(globalOptionList), '']);
      }
    }

    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => {
      return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
    });
    if (commandList.length > 0) {
      output = output.concat(['Commands:', formatList(commandList), '']);
    }

    return output.join('\n');
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  }

  /**
   * Wrap the given string to width characters per line, with lines after the first indented.
   * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
   *
   * @param {string} str
   * @param {number} width
   * @param {number} indent
   * @param {number} [minColumnWidth=40]
   * @return {string}
   *
   */

  wrap(str, width, indent, minColumnWidth = 40) {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap if not enough room for a wrapped column of text (as could end up with a word per line).
    const columnWidth = width - indent;
    if (columnWidth < minColumnWidth) return str;

    const leadingStr = str.slice(0, indent);
    const columnText = str.slice(indent);

    const indentString = ' '.repeat(indent);
    const regex = new RegExp('.{1,' + (columnWidth - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = columnText.match(regex) || [];
    return leadingStr + lines.map((line, i) => {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1);
      }
      return ((i > 0) ? indentString : '') + line.trimRight();
    }).join('\n');
  }
}

exports.Help = Help;


/***/ }),

/***/ 558:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

const { InvalidArgumentError } = __nccwpck_require__(625);

// @ts-check

class Option {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */

  constructor(flags, description) {
    this.flags = flags;
    this.description = description || '';

    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    const optionFlags = splitOptionFlags(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith('--no-');
    }
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.presetArg = undefined;
    this.envVar = undefined;
    this.parseArg = undefined;
    this.hidden = false;
    this.argChoices = undefined;
    this.conflictsWith = [];
    this.implied = undefined;
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Option}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Preset to use when option used without option-argument, especially optional but also boolean and negated.
   * The custom processing (parseArg) is called.
   *
   * @example
   * new Option('--color').default('GREYSCALE').preset('RGB');
   * new Option('--donate [amount]').preset('20').argParser(parseFloat);
   *
   * @param {any} arg
   * @return {Option}
   */

  preset(arg) {
    this.presetArg = arg;
    return this;
  }

  /**
   * Add option name(s) that conflict with this option.
   * An error will be displayed if conflicting options are found during parsing.
   *
   * @example
   * new Option('--rgb').conflicts('cmyk');
   * new Option('--js').conflicts(['ts', 'jsx']);
   *
   * @param {string | string[]} names
   * @return {Option}
   */

  conflicts(names) {
    this.conflictsWith = this.conflictsWith.concat(names);
    return this;
  }

  /**
   * Specify implied option values for when this option is set and the implied options are not.
   *
   * The custom processing (parseArg) is not called on the implied values.
   *
   * @example
   * program
   *   .addOption(new Option('--log', 'write logging information to file'))
   *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
   *
   * @param {Object} impliedOptionValues
   * @return {Option}
   */
  implies(impliedOptionValues) {
    this.implied = Object.assign(this.implied || {}, impliedOptionValues);
    return this;
  }

  /**
   * Set environment variable to check for option value.
   *
   * An environment variable is only used if when processed the current option value is
   * undefined, or the source of the current value is 'default' or 'config' or 'env'.
   *
   * @param {string} name
   * @return {Option}
   */

  env(name) {
    this.envVar = name;
    return this;
  }

  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */

  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  }

  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */

  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  }

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Return option name.
   *
   * @return {string}
   */

  name() {
    if (this.long) {
      return this.long.replace(/^--/, '');
    }
    return this.short.replace(/^-/, '');
  }

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {string}
   * @api private
   */

  attributeName() {
    return camelcase(this.name().replace(/^no-/, ''));
  }

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @api private
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  }

  /**
   * Return whether a boolean option.
   *
   * Options are one of boolean, negated, required argument, or optional argument.
   *
   * @return {boolean}
   * @api private
   */

  isBoolean() {
    return !this.required && !this.optional && !this.negate;
  }
}

/**
 * This class is to make it easier to work with dual options, without changing the existing
 * implementation. We support separate dual options for separate positive and negative options,
 * like `--build` and `--no-build`, which share a single option value. This works nicely for some
 * use cases, but is tricky for others where we want separate behaviours despite
 * the single shared option value.
 */
class DualOptions {
  /**
   * @param {Option[]} options
   */
  constructor(options) {
    this.positiveOptions = new Map();
    this.negativeOptions = new Map();
    this.dualOptions = new Set();
    options.forEach(option => {
      if (option.negate) {
        this.negativeOptions.set(option.attributeName(), option);
      } else {
        this.positiveOptions.set(option.attributeName(), option);
      }
    });
    this.negativeOptions.forEach((value, key) => {
      if (this.positiveOptions.has(key)) {
        this.dualOptions.add(key);
      }
    });
  }

  /**
   * Did the value come from the option, and not from possible matching dual option?
   *
   * @param {any} value
   * @param {Option} option
   * @returns {boolean}
   */
  valueFromOption(value, option) {
    const optionKey = option.attributeName();
    if (!this.dualOptions.has(optionKey)) return true;

    // Use the value to deduce if (probably) came from the option.
    const preset = this.negativeOptions.get(optionKey).presetArg;
    const negativeValue = (preset !== undefined) ? preset : false;
    return option.negate === (negativeValue === value);
  }
}

/**
 * Convert string from kebab-case to camelCase.
 *
 * @param {string} str
 * @return {string}
 * @api private
 */

function camelcase(str) {
  return str.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Split the short and long flag out of something like '-m,--mixed <value>'
 *
 * @api private
 */

function splitOptionFlags(flags) {
  let shortFlag;
  let longFlag;
  // Use original very loose parsing to maintain backwards compatibility for now,
  // which allowed for example unintended `-sw, --short-word` [sic].
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
  longFlag = flagParts.shift();
  // Add support for lone short flag without significantly changing parsing!
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
}

exports.Option = Option;
exports.splitOptionFlags = splitOptionFlags;
exports.DualOptions = DualOptions;


/***/ }),

/***/ 592:
/***/ ((__unused_webpack_module, exports) => {

const maxDistance = 3;

function editDistance(a, b) {
  // https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
  // Calculating optimal string alignment distance, no substring is edited more than once.
  // (Simple implementation.)

  // Quick early exit, return worst case.
  if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);

  // distance between prefix substrings of a and b
  const d = [];

  // pure deletions turn a into empty string
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  // pure insertions turn empty string into b
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }

  // fill matrix
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      let cost = 1;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[a.length][b.length];
}

/**
 * Find close matches, restricted to same number of edits.
 *
 * @param {string} word
 * @param {string[]} candidates
 * @returns {string}
 */

function suggestSimilar(word, candidates) {
  if (!candidates || candidates.length === 0) return '';
  // remove possible duplicates
  candidates = Array.from(new Set(candidates));

  const searchingOptions = word.startsWith('--');
  if (searchingOptions) {
    word = word.slice(2);
    candidates = candidates.map(candidate => candidate.slice(2));
  }

  let similar = [];
  let bestDistance = maxDistance;
  const minSimilarity = 0.4;
  candidates.forEach((candidate) => {
    if (candidate.length <= 1) return; // no one character guesses

    const distance = editDistance(word, candidate);
    const length = Math.max(word.length, candidate.length);
    const similarity = (length - distance) / length;
    if (similarity > minSimilarity) {
      if (distance < bestDistance) {
        // better edit distance, throw away previous worse matches
        bestDistance = distance;
        similar = [candidate];
      } else if (distance === bestDistance) {
        similar.push(candidate);
      }
    }
  });

  similar.sort((a, b) => a.localeCompare(b));
  if (searchingOptions) {
    similar = similar.map(candidate => `--${candidate}`);
  }

  if (similar.length > 1) {
    return `\n(Did you mean one of ${similar.join(', ')}?)`;
  }
  if (similar.length === 1) {
    return `\n(Did you mean ${similar[0]}?)`;
  }
  return '';
}

exports.suggestSimilar = suggestSimilar;


/***/ }),

/***/ 370:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

(()=>{"use strict";var t={d:(e,n)=>{for(var s in n)t.o(n,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:n[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{ATN:()=>j,ATNDeserializer:()=>It,BailErrorStrategy:()=>_e,CharStream:()=>Ae,CharStreams:()=>Le,CommonToken:()=>vt,CommonTokenStream:()=>we,DFA:()=>oe,DefaultErrorStrategy:()=>Ee,DiagnosticErrorListener:()=>Te,ErrorListener:()=>yt,FailedPredicateException:()=>fe,FileStream:()=>ye,InputMismatchException:()=>pe,InputStream:()=>Ne,Interval:()=>S,IntervalSet:()=>m,LL1Analyzer:()=>G,Lexer:()=>Ft,LexerATNSimulator:()=>Wt,NoViableAltException:()=>Zt,ParseTreeListener:()=>ce,ParseTreeVisitor:()=>ue,ParseTreeWalker:()=>de,Parser:()=>be,ParserATNSimulator:()=>ee,ParserRuleContext:()=>Me,PredictionContextCache:()=>ne,PredictionMode:()=>Qt,RecognitionException:()=>bt,RuleContext:()=>F,RuleNode:()=>v,TerminalNode:()=>w,Token:()=>n,TokenStreamRewriter:()=>Ue,arrayToString:()=>c,default:()=>He});class n{constructor(){this.source=null,this.type=null,this.channel=null,this.start=null,this.stop=null,this.tokenIndex=null,this.line=null,this.column=null,this._text=null}getTokenSource(){return this.source[0]}getInputStream(){return this.source[1]}get text(){return this._text}set text(t){this._text=t}}function s(t,e){if(!Array.isArray(t)||!Array.isArray(e))return!1;if(t===e)return!0;if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(!(t[n]===e[n]||t[n].equals&&t[n].equals(e[n])))return!1;return!0}n.INVALID_TYPE=0,n.EPSILON=-2,n.MIN_USER_TOKEN_TYPE=1,n.EOF=-1,n.DEFAULT_CHANNEL=0,n.HIDDEN_CHANNEL=1;const i=Math.round(Math.random()*Math.pow(2,32));function r(t){if(!t)return 0;const e=typeof t,n="string"===e?t:!("object"!==e||!t.toString)&&t.toString();if(!n)return 0;let s,r;const o=3&n.length,l=n.length-o;let a=i;const h=3432918353,c=461845907;let u=0;for(;u<l;)r=255&n.charCodeAt(u)|(255&n.charCodeAt(++u))<<8|(255&n.charCodeAt(++u))<<16|(255&n.charCodeAt(++u))<<24,++u,r=(65535&r)*h+(((r>>>16)*h&65535)<<16)&4294967295,r=r<<15|r>>>17,r=(65535&r)*c+(((r>>>16)*c&65535)<<16)&4294967295,a^=r,a=a<<13|a>>>19,s=5*(65535&a)+((5*(a>>>16)&65535)<<16)&4294967295,a=27492+(65535&s)+((58964+(s>>>16)&65535)<<16);switch(r=0,o){case 3:r^=(255&n.charCodeAt(u+2))<<16;case 2:r^=(255&n.charCodeAt(u+1))<<8;case 1:r^=255&n.charCodeAt(u),r=(65535&r)*h+(((r>>>16)*h&65535)<<16)&4294967295,r=r<<15|r>>>17,r=(65535&r)*c+(((r>>>16)*c&65535)<<16)&4294967295,a^=r}return a^=n.length,a^=a>>>16,a=2246822507*(65535&a)+((2246822507*(a>>>16)&65535)<<16)&4294967295,a^=a>>>13,a=3266489909*(65535&a)+((3266489909*(a>>>16)&65535)<<16)&4294967295,a^=a>>>16,a>>>0}class o{constructor(){this.count=0,this.hash=0}update(){for(let t=0;t<arguments.length;t++){const e=arguments[t];if(null!=e)if(Array.isArray(e))this.update.apply(this,e);else{let t=0;switch(typeof e){case"undefined":case"function":continue;case"number":case"boolean":t=e;break;case"string":t=r(e);break;default:e.updateHashCode?e.updateHashCode(this):console.log("No updateHashCode for "+e.toString());continue}t*=3432918353,t=t<<15|t>>>17,t*=461845907,this.count=this.count+1;let n=this.hash^t;n=n<<13|n>>>19,n=5*n+3864292196,this.hash=n}}}finish(){let t=this.hash^4*this.count;return t^=t>>>16,t*=2246822507,t^=t>>>13,t*=3266489909,t^=t>>>16,t}static hashStuff(){const t=new o;return t.update.apply(t,arguments),t.finish()}}function l(t){return t?"string"==typeof t?r(t):t.hashCode():-1}function a(t,e){return t&&t.equals?t.equals(e):t===e}function h(t){return null===t?"null":t}function c(t){return Array.isArray(t)?"["+t.map(h).join(", ")+"]":"null"}class u{constructor(t,e){this.buckets=new Array(16),this.threshold=Math.floor(12),this.itemCount=0,this.hashFunction=t||l,this.equalsFunction=e||a}get(t){if(null==t)return t;const e=this._getBucket(t);if(!e)return null;for(const n of e)if(this.equalsFunction(n,t))return n;return null}add(t){return this.getOrAdd(t)===t}getOrAdd(t){this._expand();const e=this._getSlot(t);let n=this.buckets[e];if(!n)return n=[t],this.buckets[e]=n,this.itemCount++,t;for(const e of n)if(this.equalsFunction(e,t))return e;return n.push(t),this.itemCount++,t}has(t){return null!=this.get(t)}values(){return this.buckets.filter((t=>null!=t)).flat(1)}toString(){return c(this.values())}get length(){return this.itemCount}_getSlot(t){return this.hashFunction(t)&this.buckets.length-1}_getBucket(t){return this.buckets[this._getSlot(t)]}_expand(){if(this.itemCount<=this.threshold)return;const t=this.buckets,e=2*this.buckets.length;this.buckets=new Array(e),this.threshold=Math.floor(.75*e);for(const e of t)if(e)for(const t of e){const e=this._getSlot(t);let n=this.buckets[e];n||(n=[],this.buckets[e]=n),n.push(t)}}}class d{hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}evaluate(t,e){}evalPrecedence(t,e){return this}static andContext(t,e){if(null===t||t===d.NONE)return e;if(null===e||e===d.NONE)return t;const n=new g(t,e);return 1===n.opnds.length?n.opnds[0]:n}static orContext(t,e){if(null===t)return e;if(null===e)return t;if(t===d.NONE||e===d.NONE)return d.NONE;const n=new p(t,e);return 1===n.opnds.length?n.opnds[0]:n}}class g extends d{constructor(t,e){super();const n=new u;t instanceof g?t.opnds.map((function(t){n.add(t)})):n.add(t),e instanceof g?e.opnds.map((function(t){n.add(t)})):n.add(e);const s=f(n);if(s.length>0){let t=null;s.map((function(e){(null===t||e.precedence<t.precedence)&&(t=e)})),n.add(t)}this.opnds=Array.from(n.values())}equals(t){return this===t||t instanceof g&&s(this.opnds,t.opnds)}updateHashCode(t){t.update(this.opnds,"AND")}evaluate(t,e){for(let n=0;n<this.opnds.length;n++)if(!this.opnds[n].evaluate(t,e))return!1;return!0}evalPrecedence(t,e){let n=!1;const s=[];for(let i=0;i<this.opnds.length;i++){const r=this.opnds[i],o=r.evalPrecedence(t,e);if(n|=o!==r,null===o)return null;o!==d.NONE&&s.push(o)}if(!n)return this;if(0===s.length)return d.NONE;let i=null;return s.map((function(t){i=null===i?t:d.andContext(i,t)})),i}toString(){const t=this.opnds.map((t=>t.toString()));return(t.length>3?t.slice(3):t).join("&&")}}class p extends d{constructor(t,e){super();const n=new u;t instanceof p?t.opnds.map((function(t){n.add(t)})):n.add(t),e instanceof p?e.opnds.map((function(t){n.add(t)})):n.add(e);const s=f(n);if(s.length>0){const t=s.sort((function(t,e){return t.compareTo(e)})),e=t[t.length-1];n.add(e)}this.opnds=Array.from(n.values())}equals(t){return this===t||t instanceof p&&s(this.opnds,t.opnds)}updateHashCode(t){t.update(this.opnds,"OR")}evaluate(t,e){for(let n=0;n<this.opnds.length;n++)if(this.opnds[n].evaluate(t,e))return!0;return!1}evalPrecedence(t,e){let n=!1;const s=[];for(let i=0;i<this.opnds.length;i++){const r=this.opnds[i],o=r.evalPrecedence(t,e);if(n|=o!==r,o===d.NONE)return d.NONE;null!==o&&s.push(o)}if(!n)return this;if(0===s.length)return null;return s.map((function(t){return t})),null}toString(){const t=this.opnds.map((t=>t.toString()));return(t.length>3?t.slice(3):t).join("||")}}function f(t){const e=[];return t.values().map((function(t){t instanceof d.PrecedencePredicate&&e.push(t)})),e}function x(t,e){if(null===t){const t={state:null,alt:null,context:null,semanticContext:null};return e&&(t.reachesIntoOuterContext=0),t}{const n={};return n.state=t.state||null,n.alt=void 0===t.alt?null:t.alt,n.context=t.context||null,n.semanticContext=t.semanticContext||null,e&&(n.reachesIntoOuterContext=t.reachesIntoOuterContext||0,n.precedenceFilterSuppressed=t.precedenceFilterSuppressed||!1),n}}class T{constructor(t,e){this.checkContext(t,e),t=x(t),e=x(e,!0),this.state=null!==t.state?t.state:e.state,this.alt=null!==t.alt?t.alt:e.alt,this.context=null!==t.context?t.context:e.context,this.semanticContext=null!==t.semanticContext?t.semanticContext:null!==e.semanticContext?e.semanticContext:d.NONE,this.reachesIntoOuterContext=e.reachesIntoOuterContext,this.precedenceFilterSuppressed=e.precedenceFilterSuppressed}checkContext(t,e){null!==t.context&&void 0!==t.context||null!==e&&null!==e.context&&void 0!==e.context||(this.context=null)}hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}updateHashCode(t){t.update(this.state.stateNumber,this.alt,this.context,this.semanticContext)}equals(t){return this===t||t instanceof T&&this.state.stateNumber===t.state.stateNumber&&this.alt===t.alt&&(null===this.context?null===t.context:this.context.equals(t.context))&&this.semanticContext.equals(t.semanticContext)&&this.precedenceFilterSuppressed===t.precedenceFilterSuppressed}hashCodeForConfigSet(){const t=new o;return t.update(this.state.stateNumber,this.alt,this.semanticContext),t.finish()}equalsForConfigSet(t){return this===t||t instanceof T&&this.state.stateNumber===t.state.stateNumber&&this.alt===t.alt&&this.semanticContext.equals(t.semanticContext)}toString(){return"("+this.state+","+this.alt+(null!==this.context?",["+this.context.toString()+"]":"")+(this.semanticContext!==d.NONE?","+this.semanticContext.toString():"")+(this.reachesIntoOuterContext>0?",up="+this.reachesIntoOuterContext:"")+")"}}class S{constructor(t,e){this.start=t,this.stop=e}clone(){return new S(this.start,this.stop)}contains(t){return t>=this.start&&t<this.stop}toString(){return this.start===this.stop-1?this.start.toString():this.start.toString()+".."+(this.stop-1).toString()}get length(){return this.stop-this.start}}S.INVALID_INTERVAL=new S(-1,-2);class m{constructor(){this.intervals=null,this.readOnly=!1}first(t){return null===this.intervals||0===this.intervals.length?n.INVALID_TYPE:this.intervals[0].start}addOne(t){this.addInterval(new S(t,t+1))}addRange(t,e){this.addInterval(new S(t,e+1))}addInterval(t){if(null===this.intervals)this.intervals=[],this.intervals.push(t.clone());else{for(let e=0;e<this.intervals.length;e++){const n=this.intervals[e];if(t.stop<n.start)return void this.intervals.splice(e,0,t);if(t.stop===n.start)return void(this.intervals[e]=new S(t.start,n.stop));if(t.start<=n.stop)return this.intervals[e]=new S(Math.min(n.start,t.start),Math.max(n.stop,t.stop)),void this.reduce(e)}this.intervals.push(t.clone())}}addSet(t){return null!==t.intervals&&t.intervals.forEach((t=>this.addInterval(t)),this),this}reduce(t){if(t<this.intervals.length-1){const e=this.intervals[t],n=this.intervals[t+1];e.stop>=n.stop?(this.intervals.splice(t+1,1),this.reduce(t)):e.stop>=n.start&&(this.intervals[t]=new S(e.start,n.stop),this.intervals.splice(t+1,1))}}complement(t,e){const n=new m;return n.addInterval(new S(t,e+1)),null!==this.intervals&&this.intervals.forEach((t=>n.removeRange(t))),n}contains(t){if(null===this.intervals)return!1;for(let e=0;e<this.intervals.length;e++)if(this.intervals[e].contains(t))return!0;return!1}removeRange(t){if(t.start===t.stop-1)this.removeOne(t.start);else if(null!==this.intervals){let e=0;for(let n=0;n<this.intervals.length;n++){const n=this.intervals[e];if(t.stop<=n.start)return;if(t.start>n.start&&t.stop<n.stop){this.intervals[e]=new S(n.start,t.start);const s=new S(t.stop,n.stop);return void this.intervals.splice(e,0,s)}t.start<=n.start&&t.stop>=n.stop?(this.intervals.splice(e,1),e-=1):t.start<n.stop?this.intervals[e]=new S(n.start,t.start):t.stop<n.stop&&(this.intervals[e]=new S(t.stop,n.stop)),e+=1}}}removeOne(t){if(null!==this.intervals)for(let e=0;e<this.intervals.length;e++){const n=this.intervals[e];if(t<n.start)return;if(t===n.start&&t===n.stop-1)return void this.intervals.splice(e,1);if(t===n.start)return void(this.intervals[e]=new S(n.start+1,n.stop));if(t===n.stop-1)return void(this.intervals[e]=new S(n.start,n.stop-1));if(t<n.stop-1){const s=new S(n.start,t);return n.start=t+1,void this.intervals.splice(e,0,s)}}}toString(t,e,n){return t=t||null,e=e||null,n=n||!1,null===this.intervals?"{}":null!==t||null!==e?this.toTokenString(t,e):n?this.toCharString():this.toIndexString()}toCharString(){const t=[];for(let e=0;e<this.intervals.length;e++){const s=this.intervals[e];s.stop===s.start+1?s.start===n.EOF?t.push("<EOF>"):t.push("'"+String.fromCharCode(s.start)+"'"):t.push("'"+String.fromCharCode(s.start)+"'..'"+String.fromCharCode(s.stop-1)+"'")}return t.length>1?"{"+t.join(", ")+"}":t[0]}toIndexString(){const t=[];for(let e=0;e<this.intervals.length;e++){const s=this.intervals[e];s.stop===s.start+1?s.start===n.EOF?t.push("<EOF>"):t.push(s.start.toString()):t.push(s.start.toString()+".."+(s.stop-1).toString())}return t.length>1?"{"+t.join(", ")+"}":t[0]}toTokenString(t,e){const n=[];for(let s=0;s<this.intervals.length;s++){const i=this.intervals[s];for(let s=i.start;s<i.stop;s++)n.push(this.elementName(t,e,s))}return n.length>1?"{"+n.join(", ")+"}":n[0]}elementName(t,e,s){return s===n.EOF?"<EOF>":s===n.EPSILON?"<EPSILON>":t[s]||e[s]}get length(){return this.intervals.map((t=>t.length)).reduce(((t,e)=>t+e))}}class E{constructor(){this.atn=null,this.stateNumber=E.INVALID_STATE_NUMBER,this.stateType=null,this.ruleIndex=0,this.epsilonOnlyTransitions=!1,this.transitions=[],this.nextTokenWithinRule=null}toString(){return this.stateNumber}equals(t){return t instanceof E&&this.stateNumber===t.stateNumber}isNonGreedyExitState(){return!1}addTransition(t,e){void 0===e&&(e=-1),0===this.transitions.length?this.epsilonOnlyTransitions=t.isEpsilon:this.epsilonOnlyTransitions!==t.isEpsilon&&(this.epsilonOnlyTransitions=!1),-1===e?this.transitions.push(t):this.transitions.splice(e,1,t)}}E.INVALID_TYPE=0,E.BASIC=1,E.RULE_START=2,E.BLOCK_START=3,E.PLUS_BLOCK_START=4,E.STAR_BLOCK_START=5,E.TOKEN_START=6,E.RULE_STOP=7,E.BLOCK_END=8,E.STAR_LOOP_BACK=9,E.STAR_LOOP_ENTRY=10,E.PLUS_LOOP_BACK=11,E.LOOP_END=12,E.serializationNames=["INVALID","BASIC","RULE_START","BLOCK_START","PLUS_BLOCK_START","STAR_BLOCK_START","TOKEN_START","RULE_STOP","BLOCK_END","STAR_LOOP_BACK","STAR_LOOP_ENTRY","PLUS_LOOP_BACK","LOOP_END"],E.INVALID_STATE_NUMBER=-1;class _ extends E{constructor(){return super(),this.stateType=E.RULE_STOP,this}}class C{constructor(t){if(null==t)throw"target cannot be null.";this.target=t,this.isEpsilon=!1,this.label=null}}C.EPSILON=1,C.RANGE=2,C.RULE=3,C.PREDICATE=4,C.ATOM=5,C.ACTION=6,C.SET=7,C.NOT_SET=8,C.WILDCARD=9,C.PRECEDENCE=10,C.serializationNames=["INVALID","EPSILON","RANGE","RULE","PREDICATE","ATOM","ACTION","SET","NOT_SET","WILDCARD","PRECEDENCE"],C.serializationTypes={EpsilonTransition:C.EPSILON,RangeTransition:C.RANGE,RuleTransition:C.RULE,PredicateTransition:C.PREDICATE,AtomTransition:C.ATOM,ActionTransition:C.ACTION,SetTransition:C.SET,NotSetTransition:C.NOT_SET,WildcardTransition:C.WILDCARD,PrecedencePredicateTransition:C.PRECEDENCE};class A extends C{constructor(t,e,n,s){super(t),this.ruleIndex=e,this.precedence=n,this.followState=s,this.serializationType=C.RULE,this.isEpsilon=!0}matches(t,e,n){return!1}}class N extends C{constructor(t,e){super(t),this.serializationType=C.SET,null!=e?this.label=e:(this.label=new m,this.label.addOne(n.INVALID_TYPE))}matches(t,e,n){return this.label.contains(t)}toString(){return this.label.toString()}}class k extends N{constructor(t,e){super(t,e),this.serializationType=C.NOT_SET}matches(t,e,n){return t>=e&&t<=n&&!super.matches(t,e,n)}toString(){return"~"+super.toString()}}class I extends C{constructor(t){super(t),this.serializationType=C.WILDCARD}matches(t,e,n){return t>=e&&t<=n}toString(){return"."}}class y extends C{constructor(t){super(t)}}class L{}class O extends L{}class R extends O{}class v extends R{get ruleContext(){throw new Error("missing interface implementation")}}class w extends R{}class P extends w{}const b={toStringTree:function(t,e,n){e=e||null,null!==(n=n||null)&&(e=n.ruleNames);let s=b.getNodeText(t,e);s=function(t){return t=t.replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}(s);const i=t.getChildCount();if(0===i)return s;let r="("+s+" ";i>0&&(s=b.toStringTree(t.getChild(0),e),r=r.concat(s));for(let n=1;n<i;n++)s=b.toStringTree(t.getChild(n),e),r=r.concat(" "+s);return r=r.concat(")"),r},getNodeText:function(t,e,s){if(e=e||null,null!==(s=s||null)&&(e=s.ruleNames),null!==e){if(t instanceof v){const n=t.ruleContext.getAltNumber();return 0!=n?e[t.ruleIndex]+":"+n:e[t.ruleIndex]}if(t instanceof P)return t.toString();if(t instanceof w&&null!==t.symbol)return t.symbol.text}const i=t.getPayload();return i instanceof n?i.text:t.getPayload().toString()},getChildren:function(t){const e=[];for(let n=0;n<t.getChildCount();n++)e.push(t.getChild(n));return e},getAncestors:function(t){let e=[];for(t=t.getParent();null!==t;)e=[t].concat(e),t=t.getParent();return e},findAllTokenNodes:function(t,e){return b.findAllNodes(t,e,!0)},findAllRuleNodes:function(t,e){return b.findAllNodes(t,e,!1)},findAllNodes:function(t,e,n){const s=[];return b._findAllNodes(t,e,n,s),s},_findAllNodes:function(t,e,n,s){n&&t instanceof w?t.symbol.type===e&&s.push(t):!n&&t instanceof v&&t.ruleIndex===e&&s.push(t);for(let i=0;i<t.getChildCount();i++)b._findAllNodes(t.getChild(i),e,n,s)},descendants:function(t){let e=[t];for(let n=0;n<t.getChildCount();n++)e=e.concat(b.descendants(t.getChild(n)));return e}},D=b;class F extends v{constructor(t,e){super(),this.parentCtx=t||null,this.invokingState=e||-1}depth(){let t=0,e=this;for(;null!==e;)e=e.parentCtx,t+=1;return t}isEmpty(){return-1===this.invokingState}getSourceInterval(){return S.INVALID_INTERVAL}get ruleContext(){return this}getPayload(){return this}getText(){return 0===this.getChildCount()?"":this.children.map((function(t){return t.getText()})).join("")}getAltNumber(){return 0}setAltNumber(t){}getChild(t){return null}getChildCount(){return 0}accept(t){return t.visitChildren(this)}toStringTree(t,e){return D.toStringTree(this,t,e)}toString(t,e){t=t||null,e=e||null;let n=this,s="[";for(;null!==n&&n!==e;){if(null===t)n.isEmpty()||(s+=n.invokingState);else{const e=n.ruleIndex;s+=e>=0&&e<t.length?t[e]:""+e}null===n.parentCtx||null===t&&n.parentCtx.isEmpty()||(s+=" "),n=n.parentCtx}return s+="]",s}}class M{constructor(t){this.cachedHashCode=t}isEmpty(){return this===M.EMPTY}hasEmptyPath(){return this.getReturnState(this.length-1)===M.EMPTY_RETURN_STATE}hashCode(){return this.cachedHashCode}updateHashCode(t){t.update(this.cachedHashCode)}}M.EMPTY=null,M.EMPTY_RETURN_STATE=2147483647,M.globalNodeCount=1,M.id=M.globalNodeCount,M.trace_atn_sim=!1;class U extends M{constructor(t,e){const n=new o;return n.update(t,e),super(n.finish()),this.parents=t,this.returnStates=e,this}isEmpty(){return this.returnStates[0]===M.EMPTY_RETURN_STATE}getParent(t){return this.parents[t]}getReturnState(t){return this.returnStates[t]}equals(t){return this===t||t instanceof U&&this.hashCode()===t.hashCode()&&s(this.returnStates,t.returnStates)&&s(this.parents,t.parents)}toString(){if(this.isEmpty())return"[]";{let t="[";for(let e=0;e<this.returnStates.length;e++)e>0&&(t+=", "),this.returnStates[e]!==M.EMPTY_RETURN_STATE?(t+=this.returnStates[e],null!==this.parents[e]?t=t+" "+this.parents[e]:t+="null"):t+="$";return t+"]"}}get length(){return this.returnStates.length}}class B extends M{constructor(t,e){let n=0;const s=new o;null!==t?s.update(t,e):s.update(1),n=s.finish(),super(n),this.parentCtx=t,this.returnState=e}getParent(t){return this.parentCtx}getReturnState(t){return this.returnState}equals(t){return this===t||t instanceof B&&this.hashCode()===t.hashCode()&&this.returnState===t.returnState&&(null==this.parentCtx?null==t.parentCtx:this.parentCtx.equals(t.parentCtx))}toString(){const t=null===this.parentCtx?"":this.parentCtx.toString();return 0===t.length?this.returnState===M.EMPTY_RETURN_STATE?"$":""+this.returnState:this.returnState+" "+t}get length(){return 1}static create(t,e){return e===M.EMPTY_RETURN_STATE&&null===t?M.EMPTY:new B(t,e)}}class V extends B{constructor(){super(null,M.EMPTY_RETURN_STATE)}isEmpty(){return!0}getParent(t){return null}getReturnState(t){return this.returnState}equals(t){return this===t}toString(){return"$"}}M.EMPTY=new V;class z{constructor(t,e){this.buckets=new Array(16),this.threshold=Math.floor(12),this.itemCount=0,this.hashFunction=t||l,this.equalsFunction=e||a}set(t,e){this._expand();const n=this._getSlot(t);let s=this.buckets[n];if(!s)return s=[[t,e]],this.buckets[n]=s,this.itemCount++,e;const i=s.find((e=>this.equalsFunction(e[0],t)),this);if(i){const t=i[1];return i[1]=e,t}return s.push([t,e]),this.itemCount++,e}containsKey(t){const e=this._getBucket(t);return!!e&&!!e.find((e=>this.equalsFunction(e[0],t)),this)}get(t){const e=this._getBucket(t);if(!e)return null;const n=e.find((e=>this.equalsFunction(e[0],t)),this);return n?n[1]:null}entries(){return this.buckets.filter((t=>null!=t)).flat(1)}getKeys(){return this.entries().map((t=>t[0]))}getValues(){return this.entries().map((t=>t[1]))}toString(){return"["+this.entries().map((t=>"{"+t[0]+":"+t[1]+"}")).join(", ")+"]"}get length(){return this.itemCount}_getSlot(t){return this.hashFunction(t)&this.buckets.length-1}_getBucket(t){return this.buckets[this._getSlot(t)]}_expand(){if(this.itemCount<=this.threshold)return;const t=this.buckets,e=2*this.buckets.length;this.buckets=new Array(e),this.threshold=Math.floor(.75*e);for(const e of t)if(e)for(const t of e){const e=this._getSlot(t[0]);let n=this.buckets[e];n||(n=[],this.buckets[e]=n),n.push(t)}}}function q(t,e){if(null==e&&(e=F.EMPTY),null===e.parentCtx||e===F.EMPTY)return M.EMPTY;const n=q(t,e.parentCtx),s=t.states[e.invokingState].transitions[0];return B.create(n,s.followState.stateNumber)}function H(t,e,n){if(t.isEmpty())return t;let s=n.get(t)||null;if(null!==s)return s;if(s=e.get(t),null!==s)return n.set(t,s),s;let i=!1,r=[];for(let s=0;s<r.length;s++){const o=H(t.getParent(s),e,n);if(i||o!==t.getParent(s)){if(!i){r=[];for(let e=0;e<t.length;e++)r[e]=t.getParent(e);i=!0}r[s]=o}}if(!i)return e.add(t),n.set(t,t),t;let o=null;return o=0===r.length?M.EMPTY:1===r.length?B.create(r[0],t.getReturnState(0)):new U(r,t.returnStates),e.add(o),n.set(o,o),n.set(t,o),o}function K(t,e,n,s){if(t===e)return t;if(t instanceof B&&e instanceof B)return function(t,e,n,s){if(null!==s){let n=s.get(t,e);if(null!==n)return n;if(n=s.get(e,t),null!==n)return n}const i=function(t,e,n){if(n){if(t===M.EMPTY)return M.EMPTY;if(e===M.EMPTY)return M.EMPTY}else{if(t===M.EMPTY&&e===M.EMPTY)return M.EMPTY;if(t===M.EMPTY){const t=[e.returnState,M.EMPTY_RETURN_STATE],n=[e.parentCtx,null];return new U(n,t)}if(e===M.EMPTY){const e=[t.returnState,M.EMPTY_RETURN_STATE],n=[t.parentCtx,null];return new U(n,e)}}return null}(t,e,n);if(null!==i)return null!==s&&s.set(t,e,i),i;if(t.returnState===e.returnState){const i=K(t.parentCtx,e.parentCtx,n,s);if(i===t.parentCtx)return t;if(i===e.parentCtx)return e;const r=B.create(i,t.returnState);return null!==s&&s.set(t,e,r),r}{let n=null;if((t===e||null!==t.parentCtx&&t.parentCtx===e.parentCtx)&&(n=t.parentCtx),null!==n){const i=[t.returnState,e.returnState];t.returnState>e.returnState&&(i[0]=e.returnState,i[1]=t.returnState);const r=new U([n,n],i);return null!==s&&s.set(t,e,r),r}const i=[t.returnState,e.returnState];let r=[t.parentCtx,e.parentCtx];t.returnState>e.returnState&&(i[0]=e.returnState,i[1]=t.returnState,r=[e.parentCtx,t.parentCtx]);const o=new U(r,i);return null!==s&&s.set(t,e,o),o}}(t,e,n,s);if(n){if(t instanceof V)return t;if(e instanceof V)return e}return t instanceof B&&(t=new U([t.getParent()],[t.returnState])),e instanceof B&&(e=new U([e.getParent()],[e.returnState])),function(t,e,n,s){if(null!==s){let n=s.get(t,e);if(null!==n)return M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> previous"),n;if(n=s.get(e,t),null!==n)return M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> previous"),n}let i=0,r=0,o=0,l=new Array(t.returnStates.length+e.returnStates.length).fill(0),a=new Array(t.returnStates.length+e.returnStates.length).fill(null);for(;i<t.returnStates.length&&r<e.returnStates.length;){const h=t.parents[i],c=e.parents[r];if(t.returnStates[i]===e.returnStates[r]){const e=t.returnStates[i];e===M.EMPTY_RETURN_STATE&&null===h&&null===c||null!==h&&null!==c&&h===c?(a[o]=h,l[o]=e):(a[o]=K(h,c,n,s),l[o]=e),i+=1,r+=1}else t.returnStates[i]<e.returnStates[r]?(a[o]=h,l[o]=t.returnStates[i],i+=1):(a[o]=c,l[o]=e.returnStates[r],r+=1);o+=1}if(i<t.returnStates.length)for(let e=i;e<t.returnStates.length;e++)a[o]=t.parents[e],l[o]=t.returnStates[e],o+=1;else for(let t=r;t<e.returnStates.length;t++)a[o]=e.parents[t],l[o]=e.returnStates[t],o+=1;if(o<a.length){if(1===o){const n=B.create(a[0],l[0]);return null!==s&&s.set(t,e,n),n}a=a.slice(0,o),l=l.slice(0,o)}const h=new U(a,l);return h.equals(t)?(null!==s&&s.set(t,e,t),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> a"),t):h.equals(e)?(null!==s&&s.set(t,e,e),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> b"),e):(function(t){const e=new z;for(let n=0;n<t.length;n++){const s=t[n];e.containsKey(s)||e.set(s,s)}for(let n=0;n<t.length;n++)t[n]=e.get(t[n])}(a),null!==s&&s.set(t,e,h),M.trace_atn_sim&&console.log("mergeArrays a="+t+",b="+e+" -> "+h),h)}(t,e,n,s)}class Y{constructor(){this.data=new Uint32Array(1)}set(t){Y._checkIndex(t),this._resize(t),this.data[t>>>5]|=1<<t%32}get(t){Y._checkIndex(t);const e=t>>>5;return!(e>=this.data.length||!(this.data[e]&1<<t%32))}clear(t){Y._checkIndex(t);const e=t>>>5;e<this.data.length&&(this.data[e]&=~(1<<t))}or(t){const e=Math.min(this.data.length,t.data.length);for(let n=0;n<e;++n)this.data[n]|=t.data[n];if(this.data.length<t.data.length){this._resize((t.data.length<<5)-1);const n=t.data.length;for(let s=e;s<n;++s)this.data[s]=t.data[s]}}values(){const t=new Array(this.length);let e=0;const n=this.data.length;for(let s=0;s<n;++s){let n=this.data[s];for(;0!==n;){const i=n&-n;t[e++]=(s<<5)+Y._bitCount(i-1),n^=i}}return t}minValue(){for(let t=0;t<this.data.length;++t){let e=this.data[t];if(0!==e){let n=0;for(;!(1&e);)n++,e>>=1;return n+32*t}}return 0}hashCode(){return o.hashStuff(this.values())}equals(t){return t instanceof Y&&s(this.data,t.data)}toString(){return"{"+this.values().join(", ")+"}"}get length(){return this.data.map((t=>Y._bitCount(t))).reduce(((t,e)=>t+e),0)}_resize(t){const e=t+32>>>5;if(e<=this.data.length)return;const n=new Uint32Array(e);n.set(this.data),n.fill(0,this.data.length),this.data=n}static _checkIndex(t){if(t<0)throw new RangeError("index cannot be negative")}static _bitCount(t){return t=(t=(858993459&(t-=t>>1&1431655765))+(t>>2&858993459))+(t>>4)&252645135,t+=t>>8,0+(t+=t>>16)&63}}class G{constructor(t){this.atn=t}getDecisionLookahead(t){if(null===t)return null;const e=t.transitions.length,n=[];for(let s=0;s<e;s++){n[s]=new m;const e=new u,i=!1;this._LOOK(t.transition(s).target,null,M.EMPTY,n[s],e,new Y,i,!1),(0===n[s].length||n[s].contains(G.HIT_PRED))&&(n[s]=null)}return n}LOOK(t,e,n){const s=new m,i=null!==(n=n||null)?q(t.atn,n):null;return this._LOOK(t,e,i,s,new u,new Y,!0,!0),s}_LOOK(t,e,s,i,r,o,l,a){const h=new T({state:t,alt:0,context:s},null);if(!r.has(h)){if(r.add(h),t===e){if(null===s)return void i.addOne(n.EPSILON);if(s.isEmpty()&&a)return void i.addOne(n.EOF)}if(t instanceof _){if(null===s)return void i.addOne(n.EPSILON);if(s.isEmpty()&&a)return void i.addOne(n.EOF);if(s!==M.EMPTY){const n=o.get(t.ruleIndex);try{o.clear(t.ruleIndex);for(let t=0;t<s.length;t++){const n=this.atn.states[s.getReturnState(t)];this._LOOK(n,e,s.getParent(t),i,r,o,l,a)}}finally{n&&o.set(t.ruleIndex)}return}}for(let h=0;h<t.transitions.length;h++){const c=t.transitions[h];if(c.constructor===A){if(o.get(c.target.ruleIndex))continue;const t=B.create(s,c.followState.stateNumber);try{o.set(c.target.ruleIndex),this._LOOK(c.target,e,t,i,r,o,l,a)}finally{o.clear(c.target.ruleIndex)}}else if(c instanceof y)l?this._LOOK(c.target,e,s,i,r,o,l,a):i.addOne(G.HIT_PRED);else if(c.isEpsilon)this._LOOK(c.target,e,s,i,r,o,l,a);else if(c.constructor===I)i.addRange(n.MIN_USER_TOKEN_TYPE,this.atn.maxTokenType);else{let t=c.label;null!==t&&(c instanceof k&&(t=t.complement(n.MIN_USER_TOKEN_TYPE,this.atn.maxTokenType)),i.addSet(t))}}}}}G.HIT_PRED=n.INVALID_TYPE;class j{constructor(t,e){this.grammarType=t,this.maxTokenType=e,this.states=[],this.decisionToState=[],this.ruleToStartState=[],this.ruleToStopState=null,this.modeNameToStartState={},this.ruleToTokenType=null,this.lexerActions=null,this.modeToStartState=[]}nextTokensInContext(t,e){return new G(this).LOOK(t,null,e)}nextTokensNoContext(t){return null!==t.nextTokenWithinRule||(t.nextTokenWithinRule=this.nextTokensInContext(t,null),t.nextTokenWithinRule.readOnly=!0),t.nextTokenWithinRule}nextTokens(t,e){return void 0===e?this.nextTokensNoContext(t):this.nextTokensInContext(t,e)}addState(t){null!==t&&(t.atn=this,t.stateNumber=this.states.length),this.states.push(t)}removeState(t){this.states[t.stateNumber]=null}defineDecisionState(t){return this.decisionToState.push(t),t.decision=this.decisionToState.length-1,t.decision}getDecisionState(t){return 0===this.decisionToState.length?null:this.decisionToState[t]}getExpectedTokens(t,e){if(t<0||t>=this.states.length)throw"Invalid state number.";const s=this.states[t];let i=this.nextTokens(s);if(!i.contains(n.EPSILON))return i;const r=new m;for(r.addSet(i),r.removeOne(n.EPSILON);null!==e&&e.invokingState>=0&&i.contains(n.EPSILON);){const t=this.states[e.invokingState].transitions[0];i=this.nextTokens(t.followState),r.addSet(i),r.removeOne(n.EPSILON),e=e.parentCtx}return i.contains(n.EPSILON)&&r.addOne(n.EOF),r}}j.INVALID_ALT_NUMBER=0;class W extends E{constructor(){super(),this.stateType=E.BASIC}}class $ extends E{constructor(){return super(),this.decision=-1,this.nonGreedy=!1,this}}class X extends ${constructor(){return super(),this.endState=null,this}}class J extends E{constructor(){return super(),this.stateType=E.BLOCK_END,this.startState=null,this}}class Q extends E{constructor(){return super(),this.stateType=E.LOOP_END,this.loopBackState=null,this}}class Z extends E{constructor(){return super(),this.stateType=E.RULE_START,this.stopState=null,this.isPrecedenceRule=!1,this}}class tt extends ${constructor(){return super(),this.stateType=E.TOKEN_START,this}}class et extends ${constructor(){return super(),this.stateType=E.PLUS_LOOP_BACK,this}}class nt extends E{constructor(){return super(),this.stateType=E.STAR_LOOP_BACK,this}}class st extends ${constructor(){return super(),this.stateType=E.STAR_LOOP_ENTRY,this.loopBackState=null,this.isPrecedenceDecision=null,this}}class it extends X{constructor(){return super(),this.stateType=E.PLUS_BLOCK_START,this.loopBackState=null,this}}class rt extends X{constructor(){return super(),this.stateType=E.STAR_BLOCK_START,this}}class ot extends X{constructor(){return super(),this.stateType=E.BLOCK_START,this}}class lt extends C{constructor(t,e){super(t),this.label_=e,this.label=this.makeLabel(),this.serializationType=C.ATOM}makeLabel(){const t=new m;return t.addOne(this.label_),t}matches(t,e,n){return this.label_===t}toString(){return this.label_}}class at extends C{constructor(t,e,n){super(t),this.serializationType=C.RANGE,this.start=e,this.stop=n,this.label=this.makeLabel()}makeLabel(){const t=new m;return t.addRange(this.start,this.stop),t}matches(t,e,n){return t>=this.start&&t<=this.stop}toString(){return"'"+String.fromCharCode(this.start)+"'..'"+String.fromCharCode(this.stop)+"'"}}class ht extends C{constructor(t,e,n,s){super(t),this.serializationType=C.ACTION,this.ruleIndex=e,this.actionIndex=void 0===n?-1:n,this.isCtxDependent=void 0!==s&&s,this.isEpsilon=!0}matches(t,e,n){return!1}toString(){return"action_"+this.ruleIndex+":"+this.actionIndex}}class ct extends C{constructor(t,e){super(t),this.serializationType=C.EPSILON,this.isEpsilon=!0,this.outermostPrecedenceReturn=e}matches(t,e,n){return!1}toString(){return"epsilon"}}class ut extends d{constructor(t,e,n){super(),this.ruleIndex=void 0===t?-1:t,this.predIndex=void 0===e?-1:e,this.isCtxDependent=void 0!==n&&n}evaluate(t,e){const n=this.isCtxDependent?e:null;return t.sempred(n,this.ruleIndex,this.predIndex)}updateHashCode(t){t.update(this.ruleIndex,this.predIndex,this.isCtxDependent)}equals(t){return this===t||t instanceof ut&&this.ruleIndex===t.ruleIndex&&this.predIndex===t.predIndex&&this.isCtxDependent===t.isCtxDependent}toString(){return"{"+this.ruleIndex+":"+this.predIndex+"}?"}}d.NONE=new ut;class dt extends y{constructor(t,e,n,s){super(t),this.serializationType=C.PREDICATE,this.ruleIndex=e,this.predIndex=n,this.isCtxDependent=s,this.isEpsilon=!0}matches(t,e,n){return!1}getPredicate(){return new ut(this.ruleIndex,this.predIndex,this.isCtxDependent)}toString(){return"pred_"+this.ruleIndex+":"+this.predIndex}}class gt extends d{constructor(t){super(),this.precedence=void 0===t?0:t}evaluate(t,e){return t.precpred(e,this.precedence)}evalPrecedence(t,e){return t.precpred(e,this.precedence)?d.NONE:null}compareTo(t){return this.precedence-t.precedence}updateHashCode(t){t.update(this.precedence)}equals(t){return this===t||t instanceof gt&&this.precedence===t.precedence}toString(){return"{"+this.precedence+">=prec}?"}}d.PrecedencePredicate=gt;class pt extends y{constructor(t,e){super(t),this.serializationType=C.PRECEDENCE,this.precedence=e,this.isEpsilon=!0}matches(t,e,n){return!1}getPredicate(){return new gt(this.precedence)}toString(){return this.precedence+" >= _p"}}class ft{constructor(t){void 0===t&&(t=null),this.readOnly=!1,this.verifyATN=null===t||t.verifyATN,this.generateRuleBypassTransitions=null!==t&&t.generateRuleBypassTransitions}}ft.defaultOptions=new ft,ft.defaultOptions.readOnly=!0;class xt{constructor(t){this.actionType=t,this.isPositionDependent=!1}hashCode(){const t=new o;return this.updateHashCode(t),t.finish()}updateHashCode(t){t.update(this.actionType)}equals(t){return this===t}}class Tt extends xt{constructor(){super(6)}execute(t){t.skip()}toString(){return"skip"}}Tt.INSTANCE=new Tt;class St extends xt{constructor(t){super(0),this.channel=t}execute(t){t._channel=this.channel}updateHashCode(t){t.update(this.actionType,this.channel)}equals(t){return this===t||t instanceof St&&this.channel===t.channel}toString(){return"channel("+this.channel+")"}}class mt extends xt{constructor(t,e){super(1),this.ruleIndex=t,this.actionIndex=e,this.isPositionDependent=!0}execute(t){t.action(null,this.ruleIndex,this.actionIndex)}updateHashCode(t){t.update(this.actionType,this.ruleIndex,this.actionIndex)}equals(t){return this===t||t instanceof mt&&this.ruleIndex===t.ruleIndex&&this.actionIndex===t.actionIndex}}class Et extends xt{constructor(){super(3)}execute(t){t.more()}toString(){return"more"}}Et.INSTANCE=new Et;class _t extends xt{constructor(t){super(7),this.type=t}execute(t){t.type=this.type}updateHashCode(t){t.update(this.actionType,this.type)}equals(t){return this===t||t instanceof _t&&this.type===t.type}toString(){return"type("+this.type+")"}}class Ct extends xt{constructor(t){super(5),this.mode=t}execute(t){t.pushMode(this.mode)}updateHashCode(t){t.update(this.actionType,this.mode)}equals(t){return this===t||t instanceof Ct&&this.mode===t.mode}toString(){return"pushMode("+this.mode+")"}}class At extends xt{constructor(){super(4)}execute(t){t.popMode()}toString(){return"popMode"}}At.INSTANCE=new At;class Nt extends xt{constructor(t){super(2),this.mode=t}execute(t){t.setMode(this.mode)}updateHashCode(t){t.update(this.actionType,this.mode)}equals(t){return this===t||t instanceof Nt&&this.mode===t.mode}toString(){return"mode("+this.mode+")"}}function kt(t,e){const n=[];return n[t-1]=e,n.map((function(t){return e}))}class It{constructor(t){null==t&&(t=ft.defaultOptions),this.deserializationOptions=t,this.stateFactories=null,this.actionFactories=null}deserialize(t){const e=this.reset(t);this.checkVersion(e),e&&this.skipUUID();const n=this.readATN();this.readStates(n,e),this.readRules(n,e),this.readModes(n);const s=[];return this.readSets(n,s,this.readInt.bind(this)),e&&this.readSets(n,s,this.readInt32.bind(this)),this.readEdges(n,s),this.readDecisions(n),this.readLexerActions(n,e),this.markPrecedenceDecisions(n),this.verifyATN(n),this.deserializationOptions.generateRuleBypassTransitions&&1===n.grammarType&&(this.generateRuleBypassTransitions(n),this.verifyATN(n)),n}reset(t){if(3===(t.charCodeAt?t.charCodeAt(0):t[0])){const e=function(t){const e=t.charCodeAt(0);return e>1?e-2:e+65534},n=t.split("").map(e);return n[0]=t.charCodeAt(0),this.data=n,this.pos=0,!0}return this.data=t,this.pos=0,!1}skipUUID(){let t=0;for(;t++<8;)this.readInt()}checkVersion(t){const e=this.readInt();if(!t&&4!==e)throw"Could not deserialize ATN with version "+e+" (expected 4)."}readATN(){const t=this.readInt(),e=this.readInt();return new j(t,e)}readStates(t,e){let n,s,i;const r=[],o=[],l=this.readInt();for(let n=0;n<l;n++){const n=this.readInt();if(n===E.INVALID_TYPE){t.addState(null);continue}let s=this.readInt();e&&65535===s&&(s=-1);const i=this.stateFactory(n,s);if(n===E.LOOP_END){const t=this.readInt();r.push([i,t])}else if(i instanceof X){const t=this.readInt();o.push([i,t])}t.addState(i)}for(n=0;n<r.length;n++)s=r[n],s[0].loopBackState=t.states[s[1]];for(n=0;n<o.length;n++)s=o[n],s[0].endState=t.states[s[1]];let a=this.readInt();for(n=0;n<a;n++)i=this.readInt(),t.states[i].nonGreedy=!0;let h=this.readInt();for(n=0;n<h;n++)i=this.readInt(),t.states[i].isPrecedenceRule=!0}readRules(t,e){let s;const i=this.readInt();for(0===t.grammarType&&(t.ruleToTokenType=kt(i,0)),t.ruleToStartState=kt(i,0),s=0;s<i;s++){const i=this.readInt();if(t.ruleToStartState[s]=t.states[i],0===t.grammarType){let i=this.readInt();e&&65535===i&&(i=n.EOF),t.ruleToTokenType[s]=i}}for(t.ruleToStopState=kt(i,0),s=0;s<t.states.length;s++){const e=t.states[s];e instanceof _&&(t.ruleToStopState[e.ruleIndex]=e,t.ruleToStartState[e.ruleIndex].stopState=e)}}readModes(t){const e=this.readInt();for(let n=0;n<e;n++){let e=this.readInt();t.modeToStartState.push(t.states[e])}}readSets(t,e,n){const s=this.readInt();for(let t=0;t<s;t++){const t=new m;e.push(t);const s=this.readInt();0!==this.readInt()&&t.addOne(-1);for(let e=0;e<s;e++){const e=n(),s=n();t.addRange(e,s)}}}readEdges(t,e){let n,s,i,r,o;const l=this.readInt();for(n=0;n<l;n++){const n=this.readInt(),s=this.readInt(),i=this.readInt(),o=this.readInt(),l=this.readInt(),a=this.readInt();r=this.edgeFactory(t,i,n,s,o,l,a,e),t.states[n].addTransition(r)}for(n=0;n<t.states.length;n++)for(i=t.states[n],s=0;s<i.transitions.length;s++){const e=i.transitions[s];if(!(e instanceof A))continue;let n=-1;t.ruleToStartState[e.target.ruleIndex].isPrecedenceRule&&0===e.precedence&&(n=e.target.ruleIndex),r=new ct(e.followState,n),t.ruleToStopState[e.target.ruleIndex].addTransition(r)}for(n=0;n<t.states.length;n++){if(i=t.states[n],i instanceof X){if(null===i.endState)throw"IllegalState";if(null!==i.endState.startState)throw"IllegalState";i.endState.startState=i}if(i instanceof et)for(s=0;s<i.transitions.length;s++)o=i.transitions[s].target,o instanceof it&&(o.loopBackState=i);else if(i instanceof nt)for(s=0;s<i.transitions.length;s++)o=i.transitions[s].target,o instanceof st&&(o.loopBackState=i)}}readDecisions(t){const e=this.readInt();for(let n=0;n<e;n++){const e=this.readInt(),s=t.states[e];t.decisionToState.push(s),s.decision=n}}readLexerActions(t,e){if(0===t.grammarType){const n=this.readInt();t.lexerActions=kt(n,null);for(let s=0;s<n;s++){const n=this.readInt();let i=this.readInt();e&&65535===i&&(i=-1);let r=this.readInt();e&&65535===r&&(r=-1),t.lexerActions[s]=this.lexerActionFactory(n,i,r)}}}generateRuleBypassTransitions(t){let e;const n=t.ruleToStartState.length;for(e=0;e<n;e++)t.ruleToTokenType[e]=t.maxTokenType+e+1;for(e=0;e<n;e++)this.generateRuleBypassTransition(t,e)}generateRuleBypassTransition(t,e){let n,s;const i=new ot;i.ruleIndex=e,t.addState(i);const r=new J;r.ruleIndex=e,t.addState(r),i.endState=r,t.defineDecisionState(i),r.startState=i;let o=null,l=null;if(t.ruleToStartState[e].isPrecedenceRule){for(l=null,n=0;n<t.states.length;n++)if(s=t.states[n],this.stateIsEndStateFor(s,e)){l=s,o=s.loopBackState.transitions[0];break}if(null===o)throw"Couldn't identify final state of the precedence rule prefix section."}else l=t.ruleToStopState[e];for(n=0;n<t.states.length;n++){s=t.states[n];for(let t=0;t<s.transitions.length;t++){const e=s.transitions[t];e!==o&&e.target===l&&(e.target=r)}}const a=t.ruleToStartState[e],h=a.transitions.length;for(;h>0;)i.addTransition(a.transitions[h-1]),a.transitions=a.transitions.slice(-1);t.ruleToStartState[e].addTransition(new ct(i)),r.addTransition(new ct(l));const c=new W;t.addState(c),c.addTransition(new lt(r,t.ruleToTokenType[e])),i.addTransition(new ct(c))}stateIsEndStateFor(t,e){if(t.ruleIndex!==e)return null;if(!(t instanceof st))return null;const n=t.transitions[t.transitions.length-1].target;return n instanceof Q&&n.epsilonOnlyTransitions&&n.transitions[0].target instanceof _?t:null}markPrecedenceDecisions(t){for(let e=0;e<t.states.length;e++){const n=t.states[e];if(n instanceof st&&t.ruleToStartState[n.ruleIndex].isPrecedenceRule){const t=n.transitions[n.transitions.length-1].target;t instanceof Q&&t.epsilonOnlyTransitions&&t.transitions[0].target instanceof _&&(n.isPrecedenceDecision=!0)}}}verifyATN(t){if(this.deserializationOptions.verifyATN)for(let e=0;e<t.states.length;e++){const n=t.states[e];if(null!==n)if(this.checkCondition(n.epsilonOnlyTransitions||n.transitions.length<=1),n instanceof it)this.checkCondition(null!==n.loopBackState);else if(n instanceof st)if(this.checkCondition(null!==n.loopBackState),this.checkCondition(2===n.transitions.length),n.transitions[0].target instanceof rt)this.checkCondition(n.transitions[1].target instanceof Q),this.checkCondition(!n.nonGreedy);else{if(!(n.transitions[0].target instanceof Q))throw"IllegalState";this.checkCondition(n.transitions[1].target instanceof rt),this.checkCondition(n.nonGreedy)}else n instanceof nt?(this.checkCondition(1===n.transitions.length),this.checkCondition(n.transitions[0].target instanceof st)):n instanceof Q?this.checkCondition(null!==n.loopBackState):n instanceof Z?this.checkCondition(null!==n.stopState):n instanceof X?this.checkCondition(null!==n.endState):n instanceof J?this.checkCondition(null!==n.startState):n instanceof $?this.checkCondition(n.transitions.length<=1||n.decision>=0):this.checkCondition(n.transitions.length<=1||n instanceof _)}}checkCondition(t,e){if(!t)throw null==e&&(e="IllegalState"),e}readInt(){return this.data[this.pos++]}readInt32(){return this.readInt()|this.readInt()<<16}edgeFactory(t,e,s,i,r,o,l,a){const h=t.states[i];switch(e){case C.EPSILON:return new ct(h);case C.RANGE:return new at(h,0!==l?n.EOF:r,o);case C.RULE:return new A(t.states[r],o,l,h);case C.PREDICATE:return new dt(h,r,o,0!==l);case C.PRECEDENCE:return new pt(h,r);case C.ATOM:return new lt(h,0!==l?n.EOF:r);case C.ACTION:return new ht(h,r,o,0!==l);case C.SET:return new N(h,a[r]);case C.NOT_SET:return new k(h,a[r]);case C.WILDCARD:return new I(h);default:throw"The specified transition type: "+e+" is not valid."}}stateFactory(t,e){if(null===this.stateFactories){const t=[];t[E.INVALID_TYPE]=null,t[E.BASIC]=()=>new W,t[E.RULE_START]=()=>new Z,t[E.BLOCK_START]=()=>new ot,t[E.PLUS_BLOCK_START]=()=>new it,t[E.STAR_BLOCK_START]=()=>new rt,t[E.TOKEN_START]=()=>new tt,t[E.RULE_STOP]=()=>new _,t[E.BLOCK_END]=()=>new J,t[E.STAR_LOOP_BACK]=()=>new nt,t[E.STAR_LOOP_ENTRY]=()=>new st,t[E.PLUS_LOOP_BACK]=()=>new et,t[E.LOOP_END]=()=>new Q,this.stateFactories=t}if(t>this.stateFactories.length||null===this.stateFactories[t])throw"The specified state type "+t+" is not valid.";{const n=this.stateFactories[t]();if(null!==n)return n.ruleIndex=e,n}}lexerActionFactory(t,e,n){if(null===this.actionFactories){const t=[];t[0]=(t,e)=>new St(t),t[1]=(t,e)=>new mt(t,e),t[2]=(t,e)=>new Nt(t),t[3]=(t,e)=>Et.INSTANCE,t[4]=(t,e)=>At.INSTANCE,t[5]=(t,e)=>new Ct(t),t[6]=(t,e)=>Tt.INSTANCE,t[7]=(t,e)=>new _t(t),this.actionFactories=t}if(t>this.actionFactories.length||null===this.actionFactories[t])throw"The specified lexer action type "+t+" is not valid.";return this.actionFactories[t](e,n)}}class yt{syntaxError(t,e,n,s,i,r){}reportAmbiguity(t,e,n,s,i,r,o){}reportAttemptingFullContext(t,e,n,s,i,r){}reportContextSensitivity(t,e,n,s,i,r){}}class Lt extends yt{constructor(){super()}syntaxError(t,e,n,s,i,r){console.error("line "+n+":"+s+" "+i)}}Lt.INSTANCE=new Lt;class Ot extends yt{constructor(t){if(super(),null===t)throw"delegates";return this.delegates=t,this}syntaxError(t,e,n,s,i,r){this.delegates.map((o=>o.syntaxError(t,e,n,s,i,r)))}reportAmbiguity(t,e,n,s,i,r,o){this.delegates.map((l=>l.reportAmbiguity(t,e,n,s,i,r,o)))}reportAttemptingFullContext(t,e,n,s,i,r){this.delegates.map((o=>o.reportAttemptingFullContext(t,e,n,s,i,r)))}reportContextSensitivity(t,e,n,s,i,r){this.delegates.map((o=>o.reportContextSensitivity(t,e,n,s,i,r)))}}class Rt{constructor(){this._listeners=[Lt.INSTANCE],this._interp=null,this._stateNumber=-1}checkVersion(t){const e="4.13.2";e!==t&&console.log("ANTLR runtime and generated code versions disagree: "+e+"!="+t)}addErrorListener(t){this._listeners.push(t)}removeErrorListeners(){this._listeners=[]}getLiteralNames(){return Object.getPrototypeOf(this).constructor.literalNames||[]}getSymbolicNames(){return Object.getPrototypeOf(this).constructor.symbolicNames||[]}getTokenNames(){if(!this.tokenNames){const t=this.getLiteralNames(),e=this.getSymbolicNames(),n=t.length>e.length?t.length:e.length;this.tokenNames=[];for(let s=0;s<n;s++)this.tokenNames[s]=t[s]||e[s]||"<INVALID"}return this.tokenNames}getTokenTypeMap(){const t=this.getTokenNames();if(null===t)throw"The current recognizer does not provide a list of token names.";let e=this.tokenTypeMapCache[t];return void 0===e&&(e=t.reduce((function(t,e,n){t[e]=n})),e.EOF=n.EOF,this.tokenTypeMapCache[t]=e),e}getRuleIndexMap(){const t=this.ruleNames;if(null===t)throw"The current recognizer does not provide a list of rule names.";let e=this.ruleIndexMapCache[t];return void 0===e&&(e=t.reduce((function(t,e,n){t[e]=n})),this.ruleIndexMapCache[t]=e),e}getTokenType(t){const e=this.getTokenTypeMap()[t];return void 0!==e?e:n.INVALID_TYPE}getErrorHeader(t){return"line "+t.getOffendingToken().line+":"+t.getOffendingToken().column}getTokenErrorDisplay(t){if(null===t)return"<no token>";let e=t.text;return null===e&&(e=t.type===n.EOF?"<EOF>":"<"+t.type+">"),e=e.replace("\n","\\n").replace("\r","\\r").replace("\t","\\t"),"'"+e+"'"}getErrorListenerDispatch(){return console.warn("Calling deprecated method in Recognizer class: getErrorListenerDispatch()"),this.getErrorListener()}getErrorListener(){return new Ot(this._listeners)}sempred(t,e,n){return!0}precpred(t,e){return!0}get atn(){return this._interp.atn}get state(){return this._stateNumber}set state(t){this._stateNumber=t}}Rt.tokenTypeMapCache={},Rt.ruleIndexMapCache={};class vt extends n{constructor(t,e,s,i,r){super(),this.source=void 0!==t?t:vt.EMPTY_SOURCE,this.type=void 0!==e?e:null,this.channel=void 0!==s?s:n.DEFAULT_CHANNEL,this.start=void 0!==i?i:-1,this.stop=void 0!==r?r:-1,this.tokenIndex=-1,null!==this.source[0]?(this.line=t[0].line,this.column=t[0].column):this.column=-1}clone(){const t=new vt(this.source,this.type,this.channel,this.start,this.stop);return t.tokenIndex=this.tokenIndex,t.line=this.line,t.column=this.column,t.text=this.text,t}cloneWithType(t){const e=new vt(this.source,t,this.channel,this.start,this.stop);return e.tokenIndex=this.tokenIndex,e.line=this.line,e.column=this.column,t===n.EOF&&(e.text=""),e}toString(){let t=this.text;return t=null!==t?t.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"):"<no text>","[@"+this.tokenIndex+","+this.start+":"+this.stop+"='"+t+"',<"+this.type+">"+(this.channel>0?",channel="+this.channel:"")+","+this.line+":"+this.column+"]"}get text(){if(null!==this._text)return this._text;const t=this.getInputStream();if(null===t)return null;const e=t.size;return this.start<e&&this.stop<e?t.getText(this.start,this.stop):"<EOF>"}set text(t){this._text=t}}vt.EMPTY_SOURCE=[null,null];class wt{}class Pt extends wt{constructor(t){super(),this.copyText=void 0!==t&&t}create(t,e,n,s,i,r,o,l){const a=new vt(t,e,s,i,r);return a.line=o,a.column=l,null!==n?a.text=n:this.copyText&&null!==t[1]&&(a.text=t[1].getText(i,r)),a}createThin(t,e){const n=new vt(null,t);return n.text=e,n}}Pt.DEFAULT=new Pt;class bt extends Error{constructor(t){super(t.message),Error.captureStackTrace&&Error.captureStackTrace(this,bt),this.message=t.message,this.recognizer=t.recognizer,this.input=t.input,this.ctx=t.ctx,this.offendingToken=null,this.offendingState=-1,null!==this.recognizer&&(this.offendingState=this.recognizer.state)}getExpectedTokens(){return null!==this.recognizer?this.recognizer.atn.getExpectedTokens(this.offendingState,this.ctx):null}toString(){return this.message}}class Dt extends bt{constructor(t,e,n,s){super({message:"",recognizer:t,input:e,ctx:null}),this.startIndex=n,this.deadEndConfigs=s}toString(){let t="";return this.startIndex>=0&&this.startIndex<this.input.size&&(t=this.input.getText(new S(this.startIndex,this.startIndex))),"LexerNoViableAltException"+t}}class Ft extends Rt{constructor(t){super(),this._input=t,this._factory=Pt.DEFAULT,this._tokenFactorySourcePair=[this,t],this._interp=null,this._token=null,this._tokenStartCharIndex=-1,this._tokenStartLine=-1,this._tokenStartColumn=-1,this._hitEOF=!1,this._channel=n.DEFAULT_CHANNEL,this._type=n.INVALID_TYPE,this._modeStack=[],this._mode=Ft.DEFAULT_MODE,this._text=null}reset(){null!==this._input&&this._input.seek(0),this._token=null,this._type=n.INVALID_TYPE,this._channel=n.DEFAULT_CHANNEL,this._tokenStartCharIndex=-1,this._tokenStartColumn=-1,this._tokenStartLine=-1,this._text=null,this._hitEOF=!1,this._mode=Ft.DEFAULT_MODE,this._modeStack=[],this._interp.reset()}nextToken(){if(null===this._input)throw"nextToken requires a non-null input stream.";const t=this._input.mark();try{for(;;){if(this._hitEOF)return this.emitEOF(),this._token;this._token=null,this._channel=n.DEFAULT_CHANNEL,this._tokenStartCharIndex=this._input.index,this._tokenStartColumn=this._interp.column,this._tokenStartLine=this._interp.line,this._text=null;let t=!1;for(;;){this._type=n.INVALID_TYPE;let e=Ft.SKIP;try{e=this._interp.match(this._input,this._mode)}catch(t){if(!(t instanceof bt))throw console.log(t.stack),t;this.notifyListeners(t),this.recover(t)}if(this._input.LA(1)===n.EOF&&(this._hitEOF=!0),this._type===n.INVALID_TYPE&&(this._type=e),this._type===Ft.SKIP){t=!0;break}if(this._type!==Ft.MORE)break}if(!t)return null===this._token&&this.emit(),this._token}}finally{this._input.release(t)}}skip(){this._type=Ft.SKIP}more(){this._type=Ft.MORE}mode(t){console.warn("Calling deprecated method in Lexer class: mode(...)"),this.setMode(t)}setMode(t){this._mode=t}getMode(){return this._mode}getModeStack(){return this._modeStack}pushMode(t){this._interp.debug&&console.log("pushMode "+t),this._modeStack.push(this._mode),this.setMode(t)}popMode(){if(0===this._modeStack.length)throw"Empty Stack";return this._interp.debug&&console.log("popMode back to "+this._modeStack.slice(0,-1)),this.setMode(this._modeStack.pop()),this._mode}emitToken(t){this._token=t}emit(){const t=this._factory.create(this._tokenFactorySourcePair,this._type,this._text,this._channel,this._tokenStartCharIndex,this.getCharIndex()-1,this._tokenStartLine,this._tokenStartColumn);return this.emitToken(t),t}emitEOF(){const t=this.column,e=this.line,s=this._factory.create(this._tokenFactorySourcePair,n.EOF,null,n.DEFAULT_CHANNEL,this._input.index,this._input.index-1,e,t);return this.emitToken(s),s}getCharIndex(){return this._input.index}getAllTokens(){const t=[];let e=this.nextToken();for(;e.type!==n.EOF;)t.push(e),e=this.nextToken();return t}notifyListeners(t){const e=this._tokenStartCharIndex,n=this._input.index,s=this._input.getText(e,n),i="token recognition error at: '"+this.getErrorDisplay(s)+"'";this.getErrorListener().syntaxError(this,null,this._tokenStartLine,this._tokenStartColumn,i,t)}getErrorDisplay(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n]);return e.join("")}getErrorDisplayForChar(t){return t.charCodeAt(0)===n.EOF?"<EOF>":"\n"===t?"\\n":"\t"===t?"\\t":"\r"===t?"\\r":t}getCharErrorDisplay(t){return"'"+this.getErrorDisplayForChar(t)+"'"}recover(t){this._input.LA(1)!==n.EOF&&(t instanceof Dt?this._interp.consume(this._input):this._input.consume())}get inputStream(){return this._input}set inputStream(t){this._input=null,this._tokenFactorySourcePair=[this,this._input],this.reset(),this._input=t,this._tokenFactorySourcePair=[this,this._input]}get sourceName(){return this._input.sourceName}get type(){return this._type}set type(t){this._type=t}get line(){return this._interp.line}set line(t){this._interp.line=t}get column(){return this._interp.column}set column(t){this._interp.column=t}get text(){return null!==this._text?this._text:this._interp.getText(this._input)}set text(t){this._text=t}}function Mt(t){return t.hashCodeForConfigSet()}function Ut(t,e){return t===e||null!==t&&null!==e&&t.equalsForConfigSet(e)}Ft.DEFAULT_MODE=0,Ft.MORE=-2,Ft.SKIP=-3,Ft.DEFAULT_TOKEN_CHANNEL=n.DEFAULT_CHANNEL,Ft.HIDDEN=n.HIDDEN_CHANNEL,Ft.MIN_CHAR_VALUE=0,Ft.MAX_CHAR_VALUE=1114111;class Bt{constructor(t){this.configLookup=new u(Mt,Ut),this.fullCtx=void 0===t||t,this.readOnly=!1,this.configs=[],this.uniqueAlt=0,this.conflictingAlts=null,this.hasSemanticContext=!1,this.dipsIntoOuterContext=!1,this.cachedHashCode=-1}add(t,e){if(void 0===e&&(e=null),this.readOnly)throw"This set is readonly";t.semanticContext!==d.NONE&&(this.hasSemanticContext=!0),t.reachesIntoOuterContext>0&&(this.dipsIntoOuterContext=!0);const n=this.configLookup.getOrAdd(t);if(n===t)return this.cachedHashCode=-1,this.configs.push(t),!0;const s=!this.fullCtx,i=K(n.context,t.context,s,e);return n.reachesIntoOuterContext=Math.max(n.reachesIntoOuterContext,t.reachesIntoOuterContext),t.precedenceFilterSuppressed&&(n.precedenceFilterSuppressed=!0),n.context=i,!0}getStates(){const t=new u;for(let e=0;e<this.configs.length;e++)t.add(this.configs[e].state);return t}getPredicates(){const t=[];for(let e=0;e<this.configs.length;e++){const n=this.configs[e].semanticContext;n!==d.NONE&&t.push(n.semanticContext)}return t}optimizeConfigs(t){if(this.readOnly)throw"This set is readonly";if(0!==this.configLookup.length)for(let e=0;e<this.configs.length;e++){const n=this.configs[e];n.context=t.getCachedContext(n.context)}}addAll(t){for(let e=0;e<t.length;e++)this.add(t[e]);return!1}equals(t){return this===t||t instanceof Bt&&s(this.configs,t.configs)&&this.fullCtx===t.fullCtx&&this.uniqueAlt===t.uniqueAlt&&this.conflictingAlts===t.conflictingAlts&&this.hasSemanticContext===t.hasSemanticContext&&this.dipsIntoOuterContext===t.dipsIntoOuterContext}hashCode(){const t=new o;return t.update(this.configs),t.finish()}updateHashCode(t){this.readOnly?(-1===this.cachedHashCode&&(this.cachedHashCode=this.hashCode()),t.update(this.cachedHashCode)):t.update(this.hashCode())}isEmpty(){return 0===this.configs.length}contains(t){if(null===this.configLookup)throw"This method is not implemented for readonly sets.";return this.configLookup.contains(t)}containsFast(t){if(null===this.configLookup)throw"This method is not implemented for readonly sets.";return this.configLookup.containsFast(t)}clear(){if(this.readOnly)throw"This set is readonly";this.configs=[],this.cachedHashCode=-1,this.configLookup=new u}setReadonly(t){this.readOnly=t,t&&(this.configLookup=null)}toString(){return c(this.configs)+(this.hasSemanticContext?",hasSemanticContext="+this.hasSemanticContext:"")+(this.uniqueAlt!==j.INVALID_ALT_NUMBER?",uniqueAlt="+this.uniqueAlt:"")+(null!==this.conflictingAlts?",conflictingAlts="+this.conflictingAlts:"")+(this.dipsIntoOuterContext?",dipsIntoOuterContext":"")}get items(){return this.configs}get length(){return this.configs.length}}class Vt{constructor(t,e){return null===t&&(t=-1),null===e&&(e=new Bt),this.stateNumber=t,this.configs=e,this.edges=null,this.isAcceptState=!1,this.prediction=0,this.lexerActionExecutor=null,this.requiresFullContext=!1,this.predicates=null,this}getAltSet(){const t=new u;if(null!==this.configs)for(let e=0;e<this.configs.length;e++){const n=this.configs[e];t.add(n.alt)}return 0===t.length?null:t}equals(t){return this===t||t instanceof Vt&&this.configs.equals(t.configs)}toString(){let t=this.stateNumber+":"+this.configs;return this.isAcceptState&&(t+="=>",null!==this.predicates?t+=this.predicates:t+=this.prediction),t}hashCode(){const t=new o;return t.update(this.configs),t.finish()}}class zt{constructor(t,e){return this.atn=t,this.sharedContextCache=e,this}getCachedContext(t){if(null===this.sharedContextCache)return t;const e=new z;return H(t,this.sharedContextCache,e)}}zt.ERROR=new Vt(2147483647,new Bt);class qt extends Bt{constructor(){super(),this.configLookup=new u}}class Ht extends T{constructor(t,e){super(t,e);const n=t.lexerActionExecutor||null;return this.lexerActionExecutor=n||(null!==e?e.lexerActionExecutor:null),this.passedThroughNonGreedyDecision=null!==e&&this.checkNonGreedyDecision(e,this.state),this.hashCodeForConfigSet=Ht.prototype.hashCode,this.equalsForConfigSet=Ht.prototype.equals,this}updateHashCode(t){t.update(this.state.stateNumber,this.alt,this.context,this.semanticContext,this.passedThroughNonGreedyDecision,this.lexerActionExecutor)}equals(t){return this===t||t instanceof Ht&&this.passedThroughNonGreedyDecision===t.passedThroughNonGreedyDecision&&(this.lexerActionExecutor?this.lexerActionExecutor.equals(t.lexerActionExecutor):!t.lexerActionExecutor)&&super.equals(t)}checkNonGreedyDecision(t,e){return t.passedThroughNonGreedyDecision||e instanceof $&&e.nonGreedy}}class Kt extends xt{constructor(t,e){super(e.actionType),this.offset=t,this.action=e,this.isPositionDependent=!0}execute(t){this.action.execute(t)}updateHashCode(t){t.update(this.actionType,this.offset,this.action)}equals(t){return this===t||t instanceof Kt&&this.offset===t.offset&&this.action===t.action}}class Yt{constructor(t){return this.lexerActions=null===t?[]:t,this.cachedHashCode=o.hashStuff(t),this}fixOffsetBeforeMatch(t){let e=null;for(let n=0;n<this.lexerActions.length;n++)!this.lexerActions[n].isPositionDependent||this.lexerActions[n]instanceof Kt||(null===e&&(e=this.lexerActions.concat([])),e[n]=new Kt(t,this.lexerActions[n]));return null===e?this:new Yt(e)}execute(t,e,n){let s=!1;const i=e.index;try{for(let r=0;r<this.lexerActions.length;r++){let o=this.lexerActions[r];if(o instanceof Kt){const t=o.offset;e.seek(n+t),o=o.action,s=n+t!==i}else o.isPositionDependent&&(e.seek(i),s=!1);o.execute(t)}}finally{s&&e.seek(i)}}hashCode(){return this.cachedHashCode}updateHashCode(t){t.update(this.cachedHashCode)}equals(t){if(this===t)return!0;if(t instanceof Yt){if(this.cachedHashCode!=t.cachedHashCode)return!1;if(this.lexerActions.length!=t.lexerActions.length)return!1;{const e=this.lexerActions.length;for(let n=0;n<e;++n)if(!this.lexerActions[n].equals(t.lexerActions[n]))return!1;return!0}}return!1}static append(t,e){if(null===t)return new Yt([e]);const n=t.lexerActions.concat([e]);return new Yt(n)}}function Gt(t){t.index=-1,t.line=0,t.column=-1,t.dfaState=null}class jt{constructor(){Gt(this)}reset(){Gt(this)}}class Wt extends zt{constructor(t,e,n,s){super(e,s),this.decisionToDFA=n,this.recog=t,this.startIndex=-1,this.line=1,this.column=0,this.mode=Ft.DEFAULT_MODE,this.prevAccept=new jt}copyState(t){this.column=t.column,this.line=t.line,this.mode=t.mode,this.startIndex=t.startIndex}match(t,e){this.mode=e;const n=t.mark();try{this.startIndex=t.index,this.prevAccept.reset();const n=this.decisionToDFA[e];return null===n.s0?this.matchATN(t):this.execATN(t,n.s0)}finally{t.release(n)}}reset(){this.prevAccept.reset(),this.startIndex=-1,this.line=1,this.column=0,this.mode=Ft.DEFAULT_MODE}matchATN(t){const e=this.atn.modeToStartState[this.mode];Wt.debug&&console.log("matchATN mode "+this.mode+" start: "+e);const n=this.mode,s=this.computeStartState(t,e),i=s.hasSemanticContext;s.hasSemanticContext=!1;const r=this.addDFAState(s);i||(this.decisionToDFA[this.mode].s0=r);const o=this.execATN(t,r);return Wt.debug&&console.log("DFA after matchATN: "+this.decisionToDFA[n].toLexerString()),o}execATN(t,e){Wt.debug&&console.log("start state closure="+e.configs),e.isAcceptState&&this.captureSimState(this.prevAccept,t,e);let s=t.LA(1),i=e;for(;;){Wt.debug&&console.log("execATN loop starting closure: "+i.configs);let e=this.getExistingTargetState(i,s);if(null===e&&(e=this.computeTargetState(t,i,s)),e===zt.ERROR)break;if(s!==n.EOF&&this.consume(t),e.isAcceptState&&(this.captureSimState(this.prevAccept,t,e),s===n.EOF))break;s=t.LA(1),i=e}return this.failOrAccept(this.prevAccept,t,i.configs,s)}getExistingTargetState(t,e){if(null===t.edges||e<Wt.MIN_DFA_EDGE||e>Wt.MAX_DFA_EDGE)return null;let n=t.edges[e-Wt.MIN_DFA_EDGE];return void 0===n&&(n=null),Wt.debug&&null!==n&&console.log("reuse state "+t.stateNumber+" edge to "+n.stateNumber),n}computeTargetState(t,e,n){const s=new qt;return this.getReachableConfigSet(t,e.configs,s,n),0===s.items.length?(s.hasSemanticContext||this.addDFAEdge(e,n,zt.ERROR),zt.ERROR):this.addDFAEdge(e,n,null,s)}failOrAccept(t,e,s,i){if(null!==this.prevAccept.dfaState){const n=t.dfaState.lexerActionExecutor;return this.accept(e,n,this.startIndex,t.index,t.line,t.column),t.dfaState.prediction}if(i===n.EOF&&e.index===this.startIndex)return n.EOF;throw new Dt(this.recog,e,this.startIndex,s)}getReachableConfigSet(t,e,s,i){let r=j.INVALID_ALT_NUMBER;for(let o=0;o<e.items.length;o++){const l=e.items[o],a=l.alt===r;if(!a||!l.passedThroughNonGreedyDecision){Wt.debug&&console.log("testing %s at %s\n",this.getTokenName(i),l.toString(this.recog,!0));for(let e=0;e<l.state.transitions.length;e++){const o=l.state.transitions[e],h=this.getReachableTarget(o,i);if(null!==h){let e=l.lexerActionExecutor;null!==e&&(e=e.fixOffsetBeforeMatch(t.index-this.startIndex));const o=i===n.EOF,c=new Ht({state:h,lexerActionExecutor:e},l);this.closure(t,c,s,a,!0,o)&&(r=l.alt)}}}}}accept(t,e,n,s,i,r){Wt.debug&&console.log("ACTION %s\n",e),t.seek(s),this.line=i,this.column=r,null!==e&&null!==this.recog&&e.execute(this.recog,t,n)}getReachableTarget(t,e){return t.matches(e,0,Ft.MAX_CHAR_VALUE)?t.target:null}computeStartState(t,e){const n=M.EMPTY,s=new qt;for(let i=0;i<e.transitions.length;i++){const r=e.transitions[i].target,o=new Ht({state:r,alt:i+1,context:n},null);this.closure(t,o,s,!1,!1,!1)}return s}closure(t,e,n,s,i,r){let o=null;if(Wt.debug&&console.log("closure("+e.toString(this.recog,!0)+")"),e.state instanceof _){if(Wt.debug&&(null!==this.recog?console.log("closure at %s rule stop %s\n",this.recog.ruleNames[e.state.ruleIndex],e):console.log("closure at rule stop %s\n",e)),null===e.context||e.context.hasEmptyPath()){if(null===e.context||e.context.isEmpty())return n.add(e),!0;n.add(new Ht({state:e.state,context:M.EMPTY},e)),s=!0}if(null!==e.context&&!e.context.isEmpty())for(let l=0;l<e.context.length;l++)if(e.context.getReturnState(l)!==M.EMPTY_RETURN_STATE){const a=e.context.getParent(l),h=this.atn.states[e.context.getReturnState(l)];o=new Ht({state:h,context:a},e),s=this.closure(t,o,n,s,i,r)}return s}e.state.epsilonOnlyTransitions||s&&e.passedThroughNonGreedyDecision||n.add(e);for(let l=0;l<e.state.transitions.length;l++){const a=e.state.transitions[l];o=this.getEpsilonTarget(t,e,a,n,i,r),null!==o&&(s=this.closure(t,o,n,s,i,r))}return s}getEpsilonTarget(t,e,s,i,r,o){let l=null;if(s.serializationType===C.RULE){const t=B.create(e.context,s.followState.stateNumber);l=new Ht({state:s.target,context:t},e)}else{if(s.serializationType===C.PRECEDENCE)throw"Precedence predicates are not supported in lexers.";if(s.serializationType===C.PREDICATE)Wt.debug&&console.log("EVAL rule "+s.ruleIndex+":"+s.predIndex),i.hasSemanticContext=!0,this.evaluatePredicate(t,s.ruleIndex,s.predIndex,r)&&(l=new Ht({state:s.target},e));else if(s.serializationType===C.ACTION)if(null===e.context||e.context.hasEmptyPath()){const t=Yt.append(e.lexerActionExecutor,this.atn.lexerActions[s.actionIndex]);l=new Ht({state:s.target,lexerActionExecutor:t},e)}else l=new Ht({state:s.target},e);else s.serializationType===C.EPSILON?l=new Ht({state:s.target},e):s.serializationType!==C.ATOM&&s.serializationType!==C.RANGE&&s.serializationType!==C.SET||o&&s.matches(n.EOF,0,Ft.MAX_CHAR_VALUE)&&(l=new Ht({state:s.target},e))}return l}evaluatePredicate(t,e,n,s){if(null===this.recog)return!0;if(!s)return this.recog.sempred(null,e,n);const i=this.column,r=this.line,o=t.index,l=t.mark();try{return this.consume(t),this.recog.sempred(null,e,n)}finally{this.column=i,this.line=r,t.seek(o),t.release(l)}}captureSimState(t,e,n){t.index=e.index,t.line=this.line,t.column=this.column,t.dfaState=n}addDFAEdge(t,e,n,s){if(void 0===n&&(n=null),void 0===s&&(s=null),null===n&&null!==s){const t=s.hasSemanticContext;if(s.hasSemanticContext=!1,n=this.addDFAState(s),t)return n}return e<Wt.MIN_DFA_EDGE||e>Wt.MAX_DFA_EDGE||(Wt.debug&&console.log("EDGE "+t+" -> "+n+" upon "+e),null===t.edges&&(t.edges=[]),t.edges[e-Wt.MIN_DFA_EDGE]=n),n}addDFAState(t){const e=new Vt(null,t);let n=null;for(let e=0;e<t.items.length;e++){const s=t.items[e];if(s.state instanceof _){n=s;break}}null!==n&&(e.isAcceptState=!0,e.lexerActionExecutor=n.lexerActionExecutor,e.prediction=this.atn.ruleToTokenType[n.state.ruleIndex]);const s=this.decisionToDFA[this.mode],i=s.states.get(e);if(null!==i)return i;const r=e;return r.stateNumber=s.states.length,t.setReadonly(!0),r.configs=t,s.states.add(r),r}getDFA(t){return this.decisionToDFA[t]}getText(t){return t.getText(this.startIndex,t.index-1)}consume(t){t.LA(1)==="\n".charCodeAt(0)?(this.line+=1,this.column=0):this.column+=1,t.consume()}getTokenName(t){return-1===t?"EOF":"'"+String.fromCharCode(t)+"'"}}Wt.debug=!1,Wt.dfa_debug=!1,Wt.MIN_DFA_EDGE=0,Wt.MAX_DFA_EDGE=127;class $t{constructor(t,e){this.alt=e,this.pred=t}toString(){return"("+this.pred+", "+this.alt+")"}}class Xt{constructor(){this.data={}}get(t){return this.data["k-"+t]||null}set(t,e){this.data["k-"+t]=e}values(){return Object.keys(this.data).filter((t=>t.startsWith("k-"))).map((t=>this.data[t]),this)}}const Jt={SLL:0,LL:1,LL_EXACT_AMBIG_DETECTION:2,hasSLLConflictTerminatingPrediction:function(t,e){if(Jt.allConfigsInRuleStopStates(e))return!0;if(t===Jt.SLL&&e.hasSemanticContext){const t=new Bt;for(let n=0;n<e.items.length;n++){let s=e.items[n];s=new T({semanticContext:d.NONE},s),t.add(s)}e=t}const n=Jt.getConflictingAltSubsets(e);return Jt.hasConflictingAltSet(n)&&!Jt.hasStateAssociatedWithOneAlt(e)},hasConfigInRuleStopState:function(t){for(let e=0;e<t.items.length;e++)if(t.items[e].state instanceof _)return!0;return!1},allConfigsInRuleStopStates:function(t){for(let e=0;e<t.items.length;e++)if(!(t.items[e].state instanceof _))return!1;return!0},resolvesToJustOneViableAlt:function(t){return Jt.getSingleViableAlt(t)},allSubsetsConflict:function(t){return!Jt.hasNonConflictingAltSet(t)},hasNonConflictingAltSet:function(t){for(let e=0;e<t.length;e++)if(1===t[e].length)return!0;return!1},hasConflictingAltSet:function(t){for(let e=0;e<t.length;e++)if(t[e].length>1)return!0;return!1},allSubsetsEqual:function(t){let e=null;for(let n=0;n<t.length;n++){const s=t[n];if(null===e)e=s;else if(s!==e)return!1}return!0},getUniqueAlt:function(t){const e=Jt.getAlts(t);return 1===e.length?e.minValue():j.INVALID_ALT_NUMBER},getAlts:function(t){const e=new Y;return t.map((function(t){e.or(t)})),e},getConflictingAltSubsets:function(t){const e=new z;return e.hashFunction=function(t){o.hashStuff(t.state.stateNumber,t.context)},e.equalsFunction=function(t,e){return t.state.stateNumber===e.state.stateNumber&&t.context.equals(e.context)},t.items.map((function(t){let n=e.get(t);null===n&&(n=new Y,e.set(t,n)),n.set(t.alt)})),e.getValues()},getStateToAltMap:function(t){const e=new Xt;return t.items.map((function(t){let n=e.get(t.state);null===n&&(n=new Y,e.set(t.state,n)),n.set(t.alt)})),e},hasStateAssociatedWithOneAlt:function(t){const e=Jt.getStateToAltMap(t).values();for(let t=0;t<e.length;t++)if(1===e[t].length)return!0;return!1},getSingleViableAlt:function(t){let e=null;for(let n=0;n<t.length;n++){const s=t[n].minValue();if(null===e)e=s;else if(e!==s)return j.INVALID_ALT_NUMBER}return e}},Qt=Jt;class Zt extends bt{constructor(t,e,n,s,i,r){r=r||t._ctx,s=s||t.getCurrentToken(),n=n||t.getCurrentToken(),e=e||t.getInputStream(),super({message:"",recognizer:t,input:e,ctx:r}),this.deadEndConfigs=i,this.startToken=n,this.offendingToken=s}}class te{constructor(t){this.defaultMapCtor=t||z,this.cacheMap=new this.defaultMapCtor}get(t,e){const n=this.cacheMap.get(t)||null;return null===n?null:n.get(e)||null}set(t,e,n){let s=this.cacheMap.get(t)||null;null===s&&(s=new this.defaultMapCtor,this.cacheMap.set(t,s)),s.set(e,n)}}class ee extends zt{constructor(t,e,n,s){super(e,s),this.parser=t,this.decisionToDFA=n,this.predictionMode=Qt.LL,this._input=null,this._startIndex=0,this._outerContext=null,this._dfa=null,this.mergeCache=null,this.debug=!1,this.debug_closure=!1,this.debug_add=!1,this.trace_atn_sim=!1,this.dfa_debug=!1,this.retry_debug=!1}reset(){}adaptivePredict(t,e,n){(this.debug||this.trace_atn_sim)&&console.log("adaptivePredict decision "+e+" exec LA(1)=="+this.getLookaheadName(t)+" line "+t.LT(1).line+":"+t.LT(1).column),this._input=t,this._startIndex=t.index,this._outerContext=n;const s=this.decisionToDFA[e];this._dfa=s;const i=t.mark(),r=t.index;try{let e;if(e=s.precedenceDfa?s.getPrecedenceStartState(this.parser.getPrecedence()):s.s0,null===e){null===n&&(n=F.EMPTY),this.debug&&console.log("predictATN decision "+s.decision+" exec LA(1)=="+this.getLookaheadName(t)+", outerContext="+n.toString(this.parser.ruleNames));const i=!1;let r=this.computeStartState(s.atnStartState,F.EMPTY,i);s.precedenceDfa?(s.s0.configs=r,r=this.applyPrecedenceFilter(r),e=this.addDFAState(s,new Vt(null,r)),s.setPrecedenceStartState(this.parser.getPrecedence(),e)):(e=this.addDFAState(s,new Vt(null,r)),s.s0=e)}const i=this.execATN(s,e,t,r,n);return this.debug&&console.log("DFA after predictATN: "+s.toString(this.parser.literalNames,this.parser.symbolicNames)),i}finally{this._dfa=null,this.mergeCache=null,t.seek(r),t.release(i)}}execATN(t,e,s,i,r){let o;(this.debug||this.trace_atn_sim)&&console.log("execATN decision "+t.decision+", DFA state "+e+", LA(1)=="+this.getLookaheadName(s)+" line "+s.LT(1).line+":"+s.LT(1).column);let l=e;this.debug&&console.log("s0 = "+e);let a=s.LA(1);for(;;){let e=this.getExistingTargetState(l,a);if(null===e&&(e=this.computeTargetState(t,l,a)),e===zt.ERROR){const t=this.noViableAlt(s,r,l.configs,i);if(s.seek(i),o=this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(l.configs,r),o!==j.INVALID_ALT_NUMBER)return o;throw t}if(e.requiresFullContext&&this.predictionMode!==Qt.SLL){let n=null;if(null!==e.predicates){this.debug&&console.log("DFA state has preds in DFA sim LL failover");const t=s.index;if(t!==i&&s.seek(i),n=this.evalSemanticContext(e.predicates,r,!0),1===n.length)return this.debug&&console.log("Full LL avoided"),n.minValue();t!==i&&s.seek(t)}this.dfa_debug&&console.log("ctx sensitive state "+r+" in "+e);const l=!0,a=this.computeStartState(t.atnStartState,r,l);return this.reportAttemptingFullContext(t,n,e.configs,i,s.index),o=this.execATNWithFullContext(t,e,a,s,i,r),o}if(e.isAcceptState){if(null===e.predicates)return e.prediction;const n=s.index;s.seek(i);const o=this.evalSemanticContext(e.predicates,r,!0);if(0===o.length)throw this.noViableAlt(s,r,e.configs,i);return 1===o.length||this.reportAmbiguity(t,e,i,n,!1,o,e.configs),o.minValue()}l=e,a!==n.EOF&&(s.consume(),a=s.LA(1))}}getExistingTargetState(t,e){const n=t.edges;return null===n?null:n[e+1]||null}computeTargetState(t,e,n){const s=this.computeReachSet(e.configs,n,!1);if(null===s)return this.addDFAEdge(t,e,n,zt.ERROR),zt.ERROR;let i=new Vt(null,s);const r=this.getUniqueAlt(s);if(this.debug){const t=Qt.getConflictingAltSubsets(s);console.log("SLL altSubSets="+c(t)+", configs="+s+", predict="+r+", allSubsetsConflict="+Qt.allSubsetsConflict(t)+", conflictingAlts="+this.getConflictingAlts(s))}return r!==j.INVALID_ALT_NUMBER?(i.isAcceptState=!0,i.configs.uniqueAlt=r,i.prediction=r):Qt.hasSLLConflictTerminatingPrediction(this.predictionMode,s)&&(i.configs.conflictingAlts=this.getConflictingAlts(s),i.requiresFullContext=!0,i.isAcceptState=!0,i.prediction=i.configs.conflictingAlts.minValue()),i.isAcceptState&&i.configs.hasSemanticContext&&(this.predicateDFAState(i,this.atn.getDecisionState(t.decision)),null!==i.predicates&&(i.prediction=j.INVALID_ALT_NUMBER)),i=this.addDFAEdge(t,e,n,i),i}predicateDFAState(t,e){const n=e.transitions.length,s=this.getConflictingAltsOrUniqueAlt(t.configs),i=this.getPredsForAmbigAlts(s,t.configs,n);null!==i?(t.predicates=this.getPredicatePredictions(s,i),t.prediction=j.INVALID_ALT_NUMBER):t.prediction=s.minValue()}execATNWithFullContext(t,e,s,i,r,o){(this.debug||this.trace_atn_sim)&&console.log("execATNWithFullContext "+s);let l,a=!1,h=s;i.seek(r);let c=i.LA(1),u=-1;for(;;){if(l=this.computeReachSet(h,c,!0),null===l){const t=this.noViableAlt(i,o,h,r);i.seek(r);const e=this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(h,o);if(e!==j.INVALID_ALT_NUMBER)return e;throw t}const t=Qt.getConflictingAltSubsets(l);if(this.debug&&console.log("LL altSubSets="+t+", predict="+Qt.getUniqueAlt(t)+", resolvesToJustOneViableAlt="+Qt.resolvesToJustOneViableAlt(t)),l.uniqueAlt=this.getUniqueAlt(l),l.uniqueAlt!==j.INVALID_ALT_NUMBER){u=l.uniqueAlt;break}if(this.predictionMode!==Qt.LL_EXACT_AMBIG_DETECTION){if(u=Qt.resolvesToJustOneViableAlt(t),u!==j.INVALID_ALT_NUMBER)break}else if(Qt.allSubsetsConflict(t)&&Qt.allSubsetsEqual(t)){a=!0,u=Qt.getSingleViableAlt(t);break}h=l,c!==n.EOF&&(i.consume(),c=i.LA(1))}return l.uniqueAlt!==j.INVALID_ALT_NUMBER?(this.reportContextSensitivity(t,u,l,r,i.index),u):(this.reportAmbiguity(t,e,r,i.index,a,null,l),u)}computeReachSet(t,e,s){this.debug&&console.log("in computeReachSet, starting closure: "+t),null===this.mergeCache&&(this.mergeCache=new te);const i=new Bt(s);let r=null;for(let o=0;o<t.items.length;o++){const l=t.items[o];if(this.debug&&console.log("testing "+this.getTokenName(e)+" at "+l),l.state instanceof _)(s||e===n.EOF)&&(null===r&&(r=[]),r.push(l),this.debug_add&&console.log("added "+l+" to skippedStopStates"));else for(let t=0;t<l.state.transitions.length;t++){const n=l.state.transitions[t],s=this.getReachableTarget(n,e);if(null!==s){const t=new T({state:s},l);i.add(t,this.mergeCache),this.debug_add&&console.log("added "+t+" to intermediate")}}}let o=null;if(null===r&&e!==n.EOF&&(1===i.items.length||this.getUniqueAlt(i)!==j.INVALID_ALT_NUMBER)&&(o=i),null===o){o=new Bt(s);const t=new u,r=e===n.EOF;for(let e=0;e<i.items.length;e++)this.closure(i.items[e],o,t,!1,s,r)}if(e===n.EOF&&(o=this.removeAllConfigsNotInRuleStopState(o,o===i)),!(null===r||s&&Qt.hasConfigInRuleStopState(o)))for(let t=0;t<r.length;t++)o.add(r[t],this.mergeCache);return this.trace_atn_sim&&console.log("computeReachSet "+t+" -> "+o),0===o.items.length?null:o}removeAllConfigsNotInRuleStopState(t,e){if(Qt.allConfigsInRuleStopStates(t))return t;const s=new Bt(t.fullCtx);for(let i=0;i<t.items.length;i++){const r=t.items[i];if(r.state instanceof _)s.add(r,this.mergeCache);else if(e&&r.state.epsilonOnlyTransitions&&this.atn.nextTokens(r.state).contains(n.EPSILON)){const t=this.atn.ruleToStopState[r.state.ruleIndex];s.add(new T({state:t},r),this.mergeCache)}}return s}computeStartState(t,e,n){const s=q(this.atn,e),i=new Bt(n);this.trace_atn_sim&&console.log("computeStartState from ATN state "+t+" initialContext="+s.toString(this.parser));for(let e=0;e<t.transitions.length;e++){const r=t.transitions[e].target,o=new T({state:r,alt:e+1,context:s},null),l=new u;this.closure(o,i,l,!0,n,!1)}return i}applyPrecedenceFilter(t){let e;const n=[],s=new Bt(t.fullCtx);for(let i=0;i<t.items.length;i++){if(e=t.items[i],1!==e.alt)continue;const r=e.semanticContext.evalPrecedence(this.parser,this._outerContext);null!==r&&(n[e.state.stateNumber]=e.context,r!==e.semanticContext?s.add(new T({semanticContext:r},e),this.mergeCache):s.add(e,this.mergeCache))}for(let i=0;i<t.items.length;i++)if(e=t.items[i],1!==e.alt){if(!e.precedenceFilterSuppressed){const t=n[e.state.stateNumber]||null;if(null!==t&&t.equals(e.context))continue}s.add(e,this.mergeCache)}return s}getReachableTarget(t,e){return t.matches(e,0,this.atn.maxTokenType)?t.target:null}getPredsForAmbigAlts(t,e,n){let s=[];for(let n=0;n<e.items.length;n++){const i=e.items[n];t.get(i.alt)&&(s[i.alt]=d.orContext(s[i.alt]||null,i.semanticContext))}let i=0;for(let t=1;t<n+1;t++){const e=s[t]||null;null===e?s[t]=d.NONE:e!==d.NONE&&(i+=1)}return 0===i&&(s=null),this.debug&&console.log("getPredsForAmbigAlts result "+c(s)),s}getPredicatePredictions(t,e){const n=[];let s=!1;for(let i=1;i<e.length;i++){const r=e[i];null!==t&&t.get(i)&&n.push(new $t(r,i)),r!==d.NONE&&(s=!0)}return s?n:null}getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(t,e){const n=this.splitAccordingToSemanticValidity(t,e),s=n[0],i=n[1];let r=this.getAltThatFinishedDecisionEntryRule(s);return r!==j.INVALID_ALT_NUMBER||i.items.length>0&&(r=this.getAltThatFinishedDecisionEntryRule(i),r!==j.INVALID_ALT_NUMBER)?r:j.INVALID_ALT_NUMBER}getAltThatFinishedDecisionEntryRule(t){const e=[];for(let n=0;n<t.items.length;n++){const s=t.items[n];(s.reachesIntoOuterContext>0||s.state instanceof _&&s.context.hasEmptyPath())&&e.indexOf(s.alt)<0&&e.push(s.alt)}return 0===e.length?j.INVALID_ALT_NUMBER:Math.min.apply(null,e)}splitAccordingToSemanticValidity(t,e){const n=new Bt(t.fullCtx),s=new Bt(t.fullCtx);for(let i=0;i<t.items.length;i++){const r=t.items[i];r.semanticContext!==d.NONE?r.semanticContext.evaluate(this.parser,e)?n.add(r):s.add(r):n.add(r)}return[n,s]}evalSemanticContext(t,e,n){const s=new Y;for(let i=0;i<t.length;i++){const r=t[i];if(r.pred===d.NONE){if(s.set(r.alt),!n)break;continue}const o=r.pred.evaluate(this.parser,e);if((this.debug||this.dfa_debug)&&console.log("eval pred "+r+"="+o),o&&((this.debug||this.dfa_debug)&&console.log("PREDICT "+r.alt),s.set(r.alt),!n))break}return s}closure(t,e,n,s,i,r){this.closureCheckingStopState(t,e,n,s,i,0,r)}closureCheckingStopState(t,e,n,s,i,r,o){if((this.trace_atn_sim||this.debug_closure)&&console.log("closure("+t.toString(this.parser,!0)+")"),t.state instanceof _){if(!t.context.isEmpty()){for(let l=0;l<t.context.length;l++){if(t.context.getReturnState(l)===M.EMPTY_RETURN_STATE){if(i){e.add(new T({state:t.state,context:M.EMPTY},t),this.mergeCache);continue}this.debug&&console.log("FALLING off rule "+this.getRuleName(t.state.ruleIndex)),this.closure_(t,e,n,s,i,r,o);continue}const a=this.atn.states[t.context.getReturnState(l)],h=t.context.getParent(l),c={state:a,alt:t.alt,context:h,semanticContext:t.semanticContext},u=new T(c,null);u.reachesIntoOuterContext=t.reachesIntoOuterContext,this.closureCheckingStopState(u,e,n,s,i,r-1,o)}return}if(i)return void e.add(t,this.mergeCache);this.debug&&console.log("FALLING off rule "+this.getRuleName(t.state.ruleIndex))}this.closure_(t,e,n,s,i,r,o)}closure_(t,e,n,s,i,r,o){const l=t.state;l.epsilonOnlyTransitions||e.add(t,this.mergeCache);for(let a=0;a<l.transitions.length;a++){if(0===a&&this.canDropLoopEntryEdgeInLeftRecursiveRule(t))continue;const h=l.transitions[a],c=s&&!(h instanceof ht),u=this.getEpsilonTarget(t,h,c,0===r,i,o);if(null!==u){let s=r;if(t.state instanceof _){if(null!==this._dfa&&this._dfa.precedenceDfa&&h.outermostPrecedenceReturn===this._dfa.atnStartState.ruleIndex&&(u.precedenceFilterSuppressed=!0),u.reachesIntoOuterContext+=1,n.getOrAdd(u)!==u)continue;e.dipsIntoOuterContext=!0,s-=1,this.debug&&console.log("dips into outer ctx: "+u)}else{if(!h.isEpsilon&&n.getOrAdd(u)!==u)continue;h instanceof A&&s>=0&&(s+=1)}this.closureCheckingStopState(u,e,n,c,i,s,o)}}}canDropLoopEntryEdgeInLeftRecursiveRule(t){const e=t.state;if(e.stateType!==E.STAR_LOOP_ENTRY)return!1;if(e.stateType!==E.STAR_LOOP_ENTRY||!e.isPrecedenceDecision||t.context.isEmpty()||t.context.hasEmptyPath())return!1;const n=t.context.length;for(let s=0;s<n;s++)if(this.atn.states[t.context.getReturnState(s)].ruleIndex!==e.ruleIndex)return!1;const s=e.transitions[0].target.endState.stateNumber,i=this.atn.states[s];for(let s=0;s<n;s++){const n=t.context.getReturnState(s),r=this.atn.states[n];if(1!==r.transitions.length||!r.transitions[0].isEpsilon)return!1;const o=r.transitions[0].target;if(!(r.stateType===E.BLOCK_END&&o===e||r===i||o===i||o.stateType===E.BLOCK_END&&1===o.transitions.length&&o.transitions[0].isEpsilon&&o.transitions[0].target===e))return!1}return!0}getRuleName(t){return null!==this.parser&&t>=0?this.parser.ruleNames[t]:"<rule "+t+">"}getEpsilonTarget(t,e,s,i,r,o){switch(e.serializationType){case C.RULE:return this.ruleTransition(t,e);case C.PRECEDENCE:return this.precedenceTransition(t,e,s,i,r);case C.PREDICATE:return this.predTransition(t,e,s,i,r);case C.ACTION:return this.actionTransition(t,e);case C.EPSILON:return new T({state:e.target},t);case C.ATOM:case C.RANGE:case C.SET:return o&&e.matches(n.EOF,0,1)?new T({state:e.target},t):null;default:return null}}actionTransition(t,e){if(this.debug){const t=-1===e.actionIndex?65535:e.actionIndex;console.log("ACTION edge "+e.ruleIndex+":"+t)}return new T({state:e.target},t)}precedenceTransition(t,e,n,s,i){this.debug&&(console.log("PRED (collectPredicates="+n+") "+e.precedence+">=_p, ctx dependent=true"),null!==this.parser&&console.log("context surrounding pred is "+c(this.parser.getRuleInvocationStack())));let r=null;if(n&&s)if(i){const n=this._input.index;this._input.seek(this._startIndex);const s=e.getPredicate().evaluate(this.parser,this._outerContext);this._input.seek(n),s&&(r=new T({state:e.target},t))}else{const n=d.andContext(t.semanticContext,e.getPredicate());r=new T({state:e.target,semanticContext:n},t)}else r=new T({state:e.target},t);return this.debug&&console.log("config from pred transition="+r),r}predTransition(t,e,n,s,i){this.debug&&(console.log("PRED (collectPredicates="+n+") "+e.ruleIndex+":"+e.predIndex+", ctx dependent="+e.isCtxDependent),null!==this.parser&&console.log("context surrounding pred is "+c(this.parser.getRuleInvocationStack())));let r=null;if(n&&(e.isCtxDependent&&s||!e.isCtxDependent))if(i){const n=this._input.index;this._input.seek(this._startIndex);const s=e.getPredicate().evaluate(this.parser,this._outerContext);this._input.seek(n),s&&(r=new T({state:e.target},t))}else{const n=d.andContext(t.semanticContext,e.getPredicate());r=new T({state:e.target,semanticContext:n},t)}else r=new T({state:e.target},t);return this.debug&&console.log("config from pred transition="+r),r}ruleTransition(t,e){this.debug&&console.log("CALL rule "+this.getRuleName(e.target.ruleIndex)+", ctx="+t.context);const n=e.followState,s=B.create(t.context,n.stateNumber);return new T({state:e.target,context:s},t)}getConflictingAlts(t){const e=Qt.getConflictingAltSubsets(t);return Qt.getAlts(e)}getConflictingAltsOrUniqueAlt(t){let e=null;return t.uniqueAlt!==j.INVALID_ALT_NUMBER?(e=new Y,e.set(t.uniqueAlt)):e=t.conflictingAlts,e}getTokenName(t){if(t===n.EOF)return"EOF";if(null!==this.parser&&null!==this.parser.literalNames){if(!(t>=this.parser.literalNames.length&&t>=this.parser.symbolicNames.length))return(this.parser.literalNames[t]||this.parser.symbolicNames[t])+"<"+t+">";console.log(t+" ttype out of range: "+this.parser.literalNames),console.log(""+this.parser.getInputStream().getTokens())}return""+t}getLookaheadName(t){return this.getTokenName(t.LA(1))}dumpDeadEndConfigs(t){console.log("dead end configs: ");const e=t.getDeadEndConfigs();for(let t=0;t<e.length;t++){const n=e[t];let s="no edges";if(n.state.transitions.length>0){const t=n.state.transitions[0];t instanceof lt?s="Atom "+this.getTokenName(t.label):t instanceof N&&(s=(t instanceof k?"~":"")+"Set "+t.set)}console.error(n.toString(this.parser,!0)+":"+s)}}noViableAlt(t,e,n,s){return new Zt(this.parser,t,t.get(s),t.LT(1),n,e)}getUniqueAlt(t){let e=j.INVALID_ALT_NUMBER;for(let n=0;n<t.items.length;n++){const s=t.items[n];if(e===j.INVALID_ALT_NUMBER)e=s.alt;else if(s.alt!==e)return j.INVALID_ALT_NUMBER}return e}addDFAEdge(t,e,n,s){if(this.debug&&console.log("EDGE "+e+" -> "+s+" upon "+this.getTokenName(n)),null===s)return null;if(s=this.addDFAState(t,s),null===e||n<-1||n>this.atn.maxTokenType)return s;if(null===e.edges&&(e.edges=[]),e.edges[n+1]=s,this.debug){const e=null===this.parser?null:this.parser.literalNames,n=null===this.parser?null:this.parser.symbolicNames;console.log("DFA=\n"+t.toString(e,n))}return s}addDFAState(t,e){if(e===zt.ERROR)return e;const n=t.states.get(e);return null!==n?(this.trace_atn_sim&&console.log("addDFAState "+e+" exists"),n):(e.stateNumber=t.states.length,e.configs.readOnly||(e.configs.optimizeConfigs(this),e.configs.setReadonly(!0)),this.trace_atn_sim&&console.log("addDFAState new "+e),t.states.add(e),this.debug&&console.log("adding new DFA state: "+e),e)}reportAttemptingFullContext(t,e,n,s,i){if(this.debug||this.retry_debug){const e=new S(s,i+1);console.log("reportAttemptingFullContext decision="+t.decision+":"+n+", input="+this.parser.getTokenStream().getText(e))}null!==this.parser&&this.parser.getErrorListener().reportAttemptingFullContext(this.parser,t,s,i,e,n)}reportContextSensitivity(t,e,n,s,i){if(this.debug||this.retry_debug){const e=new S(s,i+1);console.log("reportContextSensitivity decision="+t.decision+":"+n+", input="+this.parser.getTokenStream().getText(e))}null!==this.parser&&this.parser.getErrorListener().reportContextSensitivity(this.parser,t,s,i,e,n)}reportAmbiguity(t,e,n,s,i,r,o){if(this.debug||this.retry_debug){const t=new S(n,s+1);console.log("reportAmbiguity "+r+":"+o+", input="+this.parser.getTokenStream().getText(t))}null!==this.parser&&this.parser.getErrorListener().reportAmbiguity(this.parser,t,n,s,i,r,o)}}class ne{constructor(){this.cache=new z}add(t){if(t===M.EMPTY)return M.EMPTY;const e=this.cache.get(t)||null;return null!==e?e:(this.cache.set(t,t),t)}get(t){return this.cache.get(t)||null}get length(){return this.cache.length}}const se={ATN:j,ATNDeserializer:It,LexerATNSimulator:Wt,ParserATNSimulator:ee,PredictionMode:Qt,PredictionContextCache:ne};class ie{constructor(t,e,n){this.dfa=t,this.literalNames=e||[],this.symbolicNames=n||[]}toString(){if(null===this.dfa.s0)return null;let t="";const e=this.dfa.sortedStates();for(let n=0;n<e.length;n++){const s=e[n];if(null!==s.edges){const e=s.edges.length;for(let n=0;n<e;n++){const e=s.edges[n]||null;null!==e&&2147483647!==e.stateNumber&&(t=t.concat(this.getStateString(s)),t=t.concat("-"),t=t.concat(this.getEdgeLabel(n)),t=t.concat("->"),t=t.concat(this.getStateString(e)),t=t.concat("\n"))}}}return 0===t.length?null:t}getEdgeLabel(t){return 0===t?"EOF":null!==this.literalNames||null!==this.symbolicNames?this.literalNames[t-1]||this.symbolicNames[t-1]:String.fromCharCode(t-1)}getStateString(t){const e=(t.isAcceptState?":":"")+"s"+t.stateNumber+(t.requiresFullContext?"^":"");return t.isAcceptState?null!==t.predicates?e+"=>"+c(t.predicates):e+"=>"+t.prediction.toString():e}}class re extends ie{constructor(t){super(t,null)}getEdgeLabel(t){return"'"+String.fromCharCode(t)+"'"}}class oe{constructor(t,e){if(void 0===e&&(e=0),this.atnStartState=t,this.decision=e,this._states=new u,this.s0=null,this.precedenceDfa=!1,t instanceof st&&t.isPrecedenceDecision){this.precedenceDfa=!0;const t=new Vt(null,new Bt);t.edges=[],t.isAcceptState=!1,t.requiresFullContext=!1,this.s0=t}}getPrecedenceStartState(t){if(!this.precedenceDfa)throw"Only precedence DFAs may contain a precedence start state.";return t<0||t>=this.s0.edges.length?null:this.s0.edges[t]||null}setPrecedenceStartState(t,e){if(!this.precedenceDfa)throw"Only precedence DFAs may contain a precedence start state.";t<0||(this.s0.edges[t]=e)}setPrecedenceDfa(t){if(this.precedenceDfa!==t){if(this._states=new u,t){const t=new Vt(null,new Bt);t.edges=[],t.isAcceptState=!1,t.requiresFullContext=!1,this.s0=t}else this.s0=null;this.precedenceDfa=t}}sortedStates(){return this._states.values().sort((function(t,e){return t.stateNumber-e.stateNumber}))}toString(t,e){return t=t||null,e=e||null,null===this.s0?"":new ie(this,t,e).toString()}toLexerString(){return null===this.s0?"":new re(this).toString()}get states(){return this._states}}const le={DFA:oe,DFASerializer:ie,LexerDFASerializer:re,PredPrediction:$t},ae={PredictionContext:M},he={Interval:S,IntervalSet:m};class ce{visitTerminal(t){}visitErrorNode(t){}enterEveryRule(t){}exitEveryRule(t){}}class ue{visit(t){return Array.isArray(t)?t.map((function(t){return t.accept(this)}),this):t.accept(this)}visitChildren(t){return t.children?this.visit(t.children):null}visitTerminal(t){}visitErrorNode(t){}}class de{walk(t,e){if(e instanceof P||void 0!==e.isErrorNode&&e.isErrorNode())t.visitErrorNode(e);else if(e instanceof w)t.visitTerminal(e);else{this.enterRule(t,e);for(let n=0;n<e.getChildCount();n++){const s=e.getChild(n);this.walk(t,s)}this.exitRule(t,e)}}enterRule(t,e){const n=e.ruleContext;t.enterEveryRule(n),n.enterRule(t)}exitRule(t,e){const n=e.ruleContext;n.exitRule(t),t.exitEveryRule(n)}}de.DEFAULT=new de;const ge={Trees:D,RuleNode:v,ErrorNode:P,TerminalNode:w,ParseTreeListener:ce,ParseTreeVisitor:ue,ParseTreeWalker:de};class pe extends bt{constructor(t){super({message:"",recognizer:t,input:t.getInputStream(),ctx:t._ctx}),this.offendingToken=t.getCurrentToken()}}class fe extends bt{constructor(t,e,n){super({message:xe(e,n||null),recognizer:t,input:t.getInputStream(),ctx:t._ctx});const s=t._interp.atn.states[t.state].transitions[0];s instanceof dt?(this.ruleIndex=s.ruleIndex,this.predicateIndex=s.predIndex):(this.ruleIndex=0,this.predicateIndex=0),this.predicate=e,this.offendingToken=t.getCurrentToken()}}function xe(t,e){return null!==e?e:"failed predicate: {"+t+"}?"}class Te extends yt{constructor(t){super(),t=t||!0,this.exactOnly=t}reportAmbiguity(t,e,n,s,i,r,o){if(this.exactOnly&&!i)return;const l="reportAmbiguity d="+this.getDecisionDescription(t,e)+": ambigAlts="+this.getConflictingAlts(r,o)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(l)}reportAttemptingFullContext(t,e,n,s,i,r){const o="reportAttemptingFullContext d="+this.getDecisionDescription(t,e)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(o)}reportContextSensitivity(t,e,n,s,i,r){const o="reportContextSensitivity d="+this.getDecisionDescription(t,e)+", input='"+t.getTokenStream().getText(new S(n,s))+"'";t.notifyErrorListeners(o)}getDecisionDescription(t,e){const n=e.decision,s=e.atnStartState.ruleIndex,i=t.ruleNames;if(s<0||s>=i.length)return""+n;const r=i[s]||null;return null===r||0===r.length?""+n:`${n} (${r})`}getConflictingAlts(t,e){if(null!==t)return t;const n=new Y;for(let t=0;t<e.items.length;t++)n.set(e.items[t].alt);return`{${n.values().join(", ")}}`}}class Se extends Error{constructor(){super(),Error.captureStackTrace(this,Se)}}class me{reset(t){}recoverInline(t){}recover(t,e){}sync(t){}inErrorRecoveryMode(t){}reportError(t){}}class Ee extends me{constructor(){super(),this.errorRecoveryMode=!1,this.lastErrorIndex=-1,this.lastErrorStates=null,this.nextTokensContext=null,this.nextTokenState=0}reset(t){this.endErrorCondition(t)}beginErrorCondition(t){this.errorRecoveryMode=!0}inErrorRecoveryMode(t){return this.errorRecoveryMode}endErrorCondition(t){this.errorRecoveryMode=!1,this.lastErrorStates=null,this.lastErrorIndex=-1}reportMatch(t){this.endErrorCondition(t)}reportError(t,e){this.inErrorRecoveryMode(t)||(this.beginErrorCondition(t),e instanceof Zt?this.reportNoViableAlternative(t,e):e instanceof pe?this.reportInputMismatch(t,e):e instanceof fe?this.reportFailedPredicate(t,e):(console.log("unknown recognition error type: "+e.constructor.name),console.log(e.stack),t.notifyErrorListeners(e.getOffendingToken(),e.getMessage(),e)))}recover(t,e){this.lastErrorIndex===t.getInputStream().index&&null!==this.lastErrorStates&&this.lastErrorStates.indexOf(t.state)>=0&&t.consume(),this.lastErrorIndex=t._input.index,null===this.lastErrorStates&&(this.lastErrorStates=[]),this.lastErrorStates.push(t.state);const n=this.getErrorRecoverySet(t);this.consumeUntil(t,n)}sync(t){if(this.inErrorRecoveryMode(t))return;const e=t._interp.atn.states[t.state],s=t.getTokenStream().LA(1),i=t.atn.nextTokens(e);if(i.contains(s))return this.nextTokensContext=null,void(this.nextTokenState=E.INVALID_STATE_NUMBER);if(i.contains(n.EPSILON))null===this.nextTokensContext&&(this.nextTokensContext=t._ctx,this.nextTokensState=t._stateNumber);else switch(e.stateType){case E.BLOCK_START:case E.STAR_BLOCK_START:case E.PLUS_BLOCK_START:case E.STAR_LOOP_ENTRY:if(null!==this.singleTokenDeletion(t))return;throw new pe(t);case E.PLUS_LOOP_BACK:case E.STAR_LOOP_BACK:{this.reportUnwantedToken(t);const e=new m;e.addSet(t.getExpectedTokens());const n=e.addSet(this.getErrorRecoverySet(t));this.consumeUntil(t,n)}}}reportNoViableAlternative(t,e){const s=t.getTokenStream();let i;i=null!==s?e.startToken.type===n.EOF?"<EOF>":s.getText(new S(e.startToken.tokenIndex,e.offendingToken.tokenIndex)):"<unknown input>";const r="no viable alternative at input "+this.escapeWSAndQuote(i);t.notifyErrorListeners(r,e.offendingToken,e)}reportInputMismatch(t,e){const n="mismatched input "+this.getTokenErrorDisplay(e.offendingToken)+" expecting "+e.getExpectedTokens().toString(t.literalNames,t.symbolicNames);t.notifyErrorListeners(n,e.offendingToken,e)}reportFailedPredicate(t,e){const n="rule "+t.ruleNames[t._ctx.ruleIndex]+" "+e.message;t.notifyErrorListeners(n,e.offendingToken,e)}reportUnwantedToken(t){if(this.inErrorRecoveryMode(t))return;this.beginErrorCondition(t);const e=t.getCurrentToken(),n="extraneous input "+this.getTokenErrorDisplay(e)+" expecting "+this.getExpectedTokens(t).toString(t.literalNames,t.symbolicNames);t.notifyErrorListeners(n,e,null)}reportMissingToken(t){if(this.inErrorRecoveryMode(t))return;this.beginErrorCondition(t);const e=t.getCurrentToken(),n="missing "+this.getExpectedTokens(t).toString(t.literalNames,t.symbolicNames)+" at "+this.getTokenErrorDisplay(e);t.notifyErrorListeners(n,e,null)}recoverInline(t){const e=this.singleTokenDeletion(t);if(null!==e)return t.consume(),e;if(this.singleTokenInsertion(t))return this.getMissingSymbol(t);throw new pe(t)}singleTokenInsertion(t){const e=t.getTokenStream().LA(1),n=t._interp.atn,s=n.states[t.state].transitions[0].target;return!!n.nextTokens(s,t._ctx).contains(e)&&(this.reportMissingToken(t),!0)}singleTokenDeletion(t){const e=t.getTokenStream().LA(2);if(this.getExpectedTokens(t).contains(e)){this.reportUnwantedToken(t),t.consume();const e=t.getCurrentToken();return this.reportMatch(t),e}return null}getMissingSymbol(t){const e=t.getCurrentToken(),s=this.getExpectedTokens(t).first();let i;i=s===n.EOF?"<missing EOF>":"<missing "+t.literalNames[s]+">";let r=e;const o=t.getTokenStream().LT(-1);return r.type===n.EOF&&null!==o&&(r=o),t.getTokenFactory().create(r.source,s,i,n.DEFAULT_CHANNEL,-1,-1,r.line,r.column)}getExpectedTokens(t){return t.getExpectedTokens()}getTokenErrorDisplay(t){if(null===t)return"<no token>";let e=t.text;return null===e&&(e=t.type===n.EOF?"<EOF>":"<"+t.type+">"),this.escapeWSAndQuote(e)}escapeWSAndQuote(t){return"'"+(t=(t=(t=t.replace(/\n/g,"\\n")).replace(/\r/g,"\\r")).replace(/\t/g,"\\t"))+"'"}getErrorRecoverySet(t){const e=t._interp.atn;let s=t._ctx;const i=new m;for(;null!==s&&s.invokingState>=0;){const t=e.states[s.invokingState].transitions[0],n=e.nextTokens(t.followState);i.addSet(n),s=s.parentCtx}return i.removeOne(n.EPSILON),i}consumeUntil(t,e){let s=t.getTokenStream().LA(1);for(;s!==n.EOF&&!e.contains(s);)t.consume(),s=t.getTokenStream().LA(1)}}class _e extends Ee{constructor(){super()}recover(t,e){let n=t._ctx;for(;null!==n;)n.exception=e,n=n.parentCtx;throw new Se(e)}recoverInline(t){this.recover(t,new pe(t))}sync(t){}}const Ce={RecognitionException:bt,NoViableAltException:Zt,LexerNoViableAltException:Dt,InputMismatchException:pe,FailedPredicateException:fe,DiagnosticErrorListener:Te,BailErrorStrategy:_e,DefaultErrorStrategy:Ee,ErrorListener:yt};class Ae{constructor(t,e){if(this.name="<empty>",this.strdata=t,this.decodeToUnicodeCodePoints=e||!1,this._index=0,this.data=[],this.decodeToUnicodeCodePoints)for(let t=0;t<this.strdata.length;){const e=this.strdata.codePointAt(t);this.data.push(e),t+=e<=65535?1:2}else{this.data=new Array(this.strdata.length);for(let t=0;t<this.strdata.length;t++)this.data[t]=this.strdata.charCodeAt(t)}this._size=this.data.length}reset(){this._index=0}consume(){if(this._index>=this._size)throw"cannot consume EOF";this._index+=1}LA(t){if(0===t)return 0;t<0&&(t+=1);const e=this._index+t-1;return e<0||e>=this._size?n.EOF:this.data[e]}LT(t){return this.LA(t)}mark(){return-1}release(t){}seek(t){t<=this._index?this._index=t:this._index=Math.min(t,this._size)}getText(t,e){if(e>=this._size&&(e=this._size-1),t>=this._size)return"";if(this.decodeToUnicodeCodePoints){let n="";for(let s=t;s<=e;s++)n+=String.fromCodePoint(this.data[s]);return n}return this.strdata.slice(t,e+1)}toString(){return this.strdata}get index(){return this._index}get size(){return this._size}}class Ne extends Ae{constructor(t,e){super(t,e)}}const ke=__nccwpck_require__(147),Ie="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;class ye extends Ne{static fromPath(t,e,n){if(!Ie)throw new Error("FileStream is only available when running in Node!");ke.readFile(t,e,(function(t,e){let s=null;null!==e&&(s=new Ae(e,!0)),n(t,s)}))}constructor(t,e,n){if(!Ie)throw new Error("FileStream is only available when running in Node!");super(ke.readFileSync(t,e||"utf-8"),n),this.fileName=t}}const Le={fromString:function(t){return new Ae(t,!0)},fromBlob:function(t,e,n,s){const i=new window.FileReader;i.onload=function(t){const e=new Ae(t.target.result,!0);n(e)},i.onerror=s,i.readAsText(t,e)},fromBuffer:function(t,e){return new Ae(t.toString(e),!0)},fromPath:function(t,e,n){ye.fromPath(t,e,n)},fromPathSync:function(t,e){return new ye(t,e)}},Oe={arrayToString:c,stringToCharArray:function(t){let e=new Uint16Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}};class Re{}class ve extends Re{constructor(t){super(),this.tokenSource=t,this.tokens=[],this.index=-1,this.fetchedEOF=!1}mark(){return 0}release(t){}reset(){this.seek(0)}seek(t){this.lazyInit(),this.index=this.adjustSeekIndex(t)}get size(){return this.tokens.length}get(t){return this.lazyInit(),this.tokens[t]}consume(){let t=!1;if(t=this.index>=0&&(this.fetchedEOF?this.index<this.tokens.length-1:this.index<this.tokens.length),!t&&this.LA(1)===n.EOF)throw"cannot consume EOF";this.sync(this.index+1)&&(this.index=this.adjustSeekIndex(this.index+1))}sync(t){const e=t-this.tokens.length+1;return!(e>0)||this.fetch(e)>=e}fetch(t){if(this.fetchedEOF)return 0;for(let e=0;e<t;e++){const t=this.tokenSource.nextToken();if(t.tokenIndex=this.tokens.length,this.tokens.push(t),t.type===n.EOF)return this.fetchedEOF=!0,e+1}return t}getTokens(t,e,s){if(void 0===s&&(s=null),t<0||e<0)return null;this.lazyInit();const i=[];e>=this.tokens.length&&(e=this.tokens.length-1);for(let r=t;r<e;r++){const t=this.tokens[r];if(t.type===n.EOF)break;(null===s||s.contains(t.type))&&i.push(t)}return i}LA(t){return this.LT(t).type}LB(t){return this.index-t<0?null:this.tokens[this.index-t]}LT(t){if(this.lazyInit(),0===t)return null;if(t<0)return this.LB(-t);const e=this.index+t-1;return this.sync(e),e>=this.tokens.length?this.tokens[this.tokens.length-1]:this.tokens[e]}adjustSeekIndex(t){return t}lazyInit(){-1===this.index&&this.setup()}setup(){this.sync(0),this.index=this.adjustSeekIndex(0)}setTokenSource(t){this.tokenSource=t,this.tokens=[],this.index=-1,this.fetchedEOF=!1}nextTokenOnChannel(t,e){if(this.sync(t),t>=this.tokens.length)return-1;let s=this.tokens[t];for(;s.channel!==e;){if(s.type===n.EOF)return-1;t+=1,this.sync(t),s=this.tokens[t]}return t}previousTokenOnChannel(t,e){for(;t>=0&&this.tokens[t].channel!==e;)t-=1;return t}getHiddenTokensToRight(t,e){if(void 0===e&&(e=-1),this.lazyInit(),t<0||t>=this.tokens.length)throw t+" not in 0.."+this.tokens.length-1;const n=this.nextTokenOnChannel(t+1,Ft.DEFAULT_TOKEN_CHANNEL),s=t+1,i=-1===n?this.tokens.length-1:n;return this.filterForChannel(s,i,e)}getHiddenTokensToLeft(t,e){if(void 0===e&&(e=-1),this.lazyInit(),t<0||t>=this.tokens.length)throw t+" not in 0.."+this.tokens.length-1;const n=this.previousTokenOnChannel(t-1,Ft.DEFAULT_TOKEN_CHANNEL);if(n===t-1)return null;const s=n+1,i=t-1;return this.filterForChannel(s,i,e)}filterForChannel(t,e,n){const s=[];for(let i=t;i<e+1;i++){const t=this.tokens[i];-1===n?t.channel!==Ft.DEFAULT_TOKEN_CHANNEL&&s.push(t):t.channel===n&&s.push(t)}return 0===s.length?null:s}getSourceName(){return this.tokenSource.getSourceName()}getText(t){this.lazyInit(),this.fill(),t||(t=new S(0,this.tokens.length-1));let e=t.start;e instanceof n&&(e=e.tokenIndex);let s=t.stop;if(s instanceof n&&(s=s.tokenIndex),null===e||null===s||e<0||s<0)return"";s>=this.tokens.length&&(s=this.tokens.length-1);let i="";for(let t=e;t<s+1;t++){const e=this.tokens[t];if(e.type===n.EOF)break;i+=e.text}return i}fill(){for(this.lazyInit();1e3===this.fetch(1e3););}}Object.defineProperty(ve,"size",{get:function(){return this.tokens.length}});class we extends ve{constructor(t,e){super(t),this.channel=void 0===e?n.DEFAULT_CHANNEL:e}adjustSeekIndex(t){return this.nextTokenOnChannel(t,this.channel)}LB(t){if(0===t||this.index-t<0)return null;let e=this.index,n=1;for(;n<=t;)e=this.previousTokenOnChannel(e-1,this.channel),n+=1;return e<0?null:this.tokens[e]}LT(t){if(this.lazyInit(),0===t)return null;if(t<0)return this.LB(-t);let e=this.index,n=1;for(;n<t;)this.sync(e+1)&&(e=this.nextTokenOnChannel(e+1,this.channel)),n+=1;return this.tokens[e]}getNumberOfOnChannelTokens(){let t=0;this.fill();for(let e=0;e<this.tokens.length;e++){const s=this.tokens[e];if(s.channel===this.channel&&(t+=1),s.type===n.EOF)break}return t}}class Pe extends ce{constructor(t){super(),this.parser=t}enterEveryRule(t){console.log("enter   "+this.parser.ruleNames[t.ruleIndex]+", LT(1)="+this.parser._input.LT(1).text)}visitTerminal(t){console.log("consume "+t.symbol+" rule "+this.parser.ruleNames[this.parser._ctx.ruleIndex])}exitEveryRule(t){console.log("exit    "+this.parser.ruleNames[t.ruleIndex]+", LT(1)="+this.parser._input.LT(1).text)}}class be extends Rt{constructor(t){super(),this._input=null,this._errHandler=new Ee,this._precedenceStack=[],this._precedenceStack.push(0),this._ctx=null,this.buildParseTrees=!0,this._tracer=null,this._parseListeners=null,this._syntaxErrors=0,this.setInputStream(t)}reset(){null!==this._input&&this._input.seek(0),this._errHandler.reset(this),this._ctx=null,this._syntaxErrors=0,this.setTrace(!1),this._precedenceStack=[],this._precedenceStack.push(0),null!==this._interp&&this._interp.reset()}match(t){let e=this.getCurrentToken();return e.type===t?(this._errHandler.reportMatch(this),this.consume()):(e=this._errHandler.recoverInline(this),this.buildParseTrees&&-1===e.tokenIndex&&this._ctx.addErrorNode(e)),e}matchWildcard(){let t=this.getCurrentToken();return t.type>0?(this._errHandler.reportMatch(this),this.consume()):(t=this._errHandler.recoverInline(this),this.buildParseTrees&&-1===t.tokenIndex&&this._ctx.addErrorNode(t)),t}getParseListeners(){return this._parseListeners||[]}addParseListener(t){if(null===t)throw"listener";null===this._parseListeners&&(this._parseListeners=[]),this._parseListeners.push(t)}removeParseListener(t){if(null!==this._parseListeners){const e=this._parseListeners.indexOf(t);e>=0&&this._parseListeners.splice(e,1),0===this._parseListeners.length&&(this._parseListeners=null)}}removeParseListeners(){this._parseListeners=null}triggerEnterRuleEvent(){if(null!==this._parseListeners){const t=this._ctx;this._parseListeners.forEach((function(e){e.enterEveryRule(t),t.enterRule(e)}))}}triggerExitRuleEvent(){if(null!==this._parseListeners){const t=this._ctx;this._parseListeners.slice(0).reverse().forEach((function(e){t.exitRule(e),e.exitEveryRule(t)}))}}getTokenFactory(){return this._input.tokenSource._factory}setTokenFactory(t){this._input.tokenSource._factory=t}getATNWithBypassAlts(){const t=this.getSerializedATN();if(null===t)throw"The current parser does not support an ATN with bypass alternatives.";let e=this.bypassAltsAtnCache[t];if(null===e){const n=new ft;n.generateRuleBypassTransitions=!0,e=new It(n).deserialize(t),this.bypassAltsAtnCache[t]=e}return e}getInputStream(){return this.getTokenStream()}setInputStream(t){this.setTokenStream(t)}getTokenStream(){return this._input}setTokenStream(t){this._input=null,this.reset(),this._input=t}get syntaxErrorsCount(){return this._syntaxErrors}getCurrentToken(){return this._input.LT(1)}notifyErrorListeners(t,e,n){n=n||null,null===(e=e||null)&&(e=this.getCurrentToken()),this._syntaxErrors+=1;const s=e.line,i=e.column;this.getErrorListener().syntaxError(this,e,s,i,t,n)}consume(){const t=this.getCurrentToken();t.type!==n.EOF&&this.getInputStream().consume();const e=null!==this._parseListeners&&this._parseListeners.length>0;if(this.buildParseTrees||e){let n;n=this._errHandler.inErrorRecoveryMode(this)?this._ctx.addErrorNode(t):this._ctx.addTokenNode(t),n.invokingState=this.state,e&&this._parseListeners.forEach((function(t){n instanceof P||void 0!==n.isErrorNode&&n.isErrorNode()?t.visitErrorNode(n):n instanceof w&&t.visitTerminal(n)}))}return t}addContextToParseTree(){null!==this._ctx.parentCtx&&this._ctx.parentCtx.addChild(this._ctx)}enterRule(t,e,n){this.state=e,this._ctx=t,this._ctx.start=this._input.LT(1),this.buildParseTrees&&this.addContextToParseTree(),this.triggerEnterRuleEvent()}exitRule(){this._ctx.stop=this._input.LT(-1),this.triggerExitRuleEvent(),this.state=this._ctx.invokingState,this._ctx=this._ctx.parentCtx}enterOuterAlt(t,e){t.setAltNumber(e),this.buildParseTrees&&this._ctx!==t&&null!==this._ctx.parentCtx&&(this._ctx.parentCtx.removeLastChild(),this._ctx.parentCtx.addChild(t)),this._ctx=t}getPrecedence(){return 0===this._precedenceStack.length?-1:this._precedenceStack[this._precedenceStack.length-1]}enterRecursionRule(t,e,n,s){this.state=e,this._precedenceStack.push(s),this._ctx=t,this._ctx.start=this._input.LT(1),this.triggerEnterRuleEvent()}pushNewRecursionContext(t,e,n){const s=this._ctx;s.parentCtx=t,s.invokingState=e,s.stop=this._input.LT(-1),this._ctx=t,this._ctx.start=s.start,this.buildParseTrees&&this._ctx.addChild(s),this.triggerEnterRuleEvent()}unrollRecursionContexts(t){this._precedenceStack.pop(),this._ctx.stop=this._input.LT(-1);const e=this._ctx,n=this.getParseListeners();if(null!==n&&n.length>0)for(;this._ctx!==t;)this.triggerExitRuleEvent(),this._ctx=this._ctx.parentCtx;else this._ctx=t;e.parentCtx=t,this.buildParseTrees&&null!==t&&t.addChild(e)}getInvokingContext(t){let e=this._ctx;for(;null!==e;){if(e.ruleIndex===t)return e;e=e.parentCtx}return null}precpred(t,e){return e>=this._precedenceStack[this._precedenceStack.length-1]}inContext(t){return!1}isExpectedToken(t){const e=this._interp.atn;let s=this._ctx;const i=e.states[this.state];let r=e.nextTokens(i);if(r.contains(t))return!0;if(!r.contains(n.EPSILON))return!1;for(;null!==s&&s.invokingState>=0&&r.contains(n.EPSILON);){const n=e.states[s.invokingState].transitions[0];if(r=e.nextTokens(n.followState),r.contains(t))return!0;s=s.parentCtx}return!(!r.contains(n.EPSILON)||t!==n.EOF)}getExpectedTokens(){return this._interp.atn.getExpectedTokens(this.state,this._ctx)}getExpectedTokensWithinCurrentRule(){const t=this._interp.atn,e=t.states[this.state];return t.nextTokens(e)}getRuleIndex(t){const e=this.getRuleIndexMap()[t];return null!==e?e:-1}getRuleInvocationStack(t){null===(t=t||null)&&(t=this._ctx);const e=[];for(;null!==t;){const n=t.ruleIndex;n<0?e.push("n/a"):e.push(this.ruleNames[n]),t=t.parentCtx}return e}getDFAStrings(){return this._interp.decisionToDFA.toString()}dumpDFA(){let t=!1;for(let e=0;e<this._interp.decisionToDFA.length;e++){const n=this._interp.decisionToDFA[e];n.states.length>0&&(t&&console.log(),this.printer.println("Decision "+n.decision+":"),this.printer.print(n.toString(this.literalNames,this.symbolicNames)),t=!0)}}getSourceName(){return this._input.getSourceName()}setTrace(t){t?(null!==this._tracer&&this.removeParseListener(this._tracer),this._tracer=new Pe(this),this.addParseListener(this._tracer)):(this.removeParseListener(this._tracer),this._tracer=null)}}be.bypassAltsAtnCache={};class De extends w{constructor(t){super(),this.parentCtx=null,this.symbol=t}getChild(t){return null}getSymbol(){return this.symbol}getParent(){return this.parentCtx}getPayload(){return this.symbol}getSourceInterval(){if(null===this.symbol)return S.INVALID_INTERVAL;const t=this.symbol.tokenIndex;return new S(t,t)}getChildCount(){return 0}accept(t){return t.visitTerminal(this)}getText(){return this.symbol.text}toString(){return this.symbol.type===n.EOF?"<EOF>":this.symbol.text}}class Fe extends De{constructor(t){super(t)}isErrorNode(){return!0}accept(t){return t.visitErrorNode(this)}}class Me extends F{constructor(t,e){super(t,e),this.children=null,this.start=null,this.stop=null,this.exception=null}copyFrom(t){this.parentCtx=t.parentCtx,this.invokingState=t.invokingState,this.children=null,this.start=t.start,this.stop=t.stop,t.children&&(this.children=[],t.children.map((function(t){t instanceof Fe&&(this.children.push(t),t.parentCtx=this)}),this))}enterRule(t){}exitRule(t){}addChild(t){return null===this.children&&(this.children=[]),this.children.push(t),t}removeLastChild(){null!==this.children&&this.children.pop()}addTokenNode(t){const e=new De(t);return this.addChild(e),e.parentCtx=this,e}addErrorNode(t){const e=new Fe(t);return this.addChild(e),e.parentCtx=this,e}getChild(t,e){if(e=e||null,null===this.children||t<0||t>=this.children.length)return null;if(null===e)return this.children[t];for(let n=0;n<this.children.length;n++){const s=this.children[n];if(s instanceof e){if(0===t)return s;t-=1}}return null}getToken(t,e){if(null===this.children||e<0||e>=this.children.length)return null;for(let n=0;n<this.children.length;n++){const s=this.children[n];if(s instanceof w&&s.symbol.type===t){if(0===e)return s;e-=1}}return null}getTokens(t){if(null===this.children)return[];{const e=[];for(let n=0;n<this.children.length;n++){const s=this.children[n];s instanceof w&&s.symbol.type===t&&e.push(s)}return e}}getTypedRuleContext(t,e){return this.getChild(e,t)}getTypedRuleContexts(t){if(null===this.children)return[];{const e=[];for(let n=0;n<this.children.length;n++){const s=this.children[n];s instanceof t&&e.push(s)}return e}}getChildCount(){return null===this.children?0:this.children.length}getSourceInterval(){return null===this.start||null===this.stop?S.INVALID_INTERVAL:new S(this.start.tokenIndex,this.stop.tokenIndex)}}F.EMPTY=new Me;class Ue{static DEFAULT_PROGRAM_NAME="default";constructor(t){this.tokens=t,this.programs=new Map}getTokenStream(){return this.tokens}insertAfter(t,e){let n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;n="number"==typeof t?t:t.tokenIndex;let i=this.getProgram(s),r=new ze(this.tokens,n,i.length,e);i.push(r)}insertBefore(t,e){let n,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;n="number"==typeof t?t:t.tokenIndex;const i=this.getProgram(s),r=new Ve(this.tokens,n,i.length,e);i.push(r)}replaceSingle(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;this.replace(t,t,e,n)}replace(t,e,n){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Ue.DEFAULT_PROGRAM_NAME;if("number"!=typeof t&&(t=t.tokenIndex),"number"!=typeof e&&(e=e.tokenIndex),t>e||t<0||e<0||e>=this.tokens.size)throw new RangeError(`replace: range invalid: ${t}..${e}(size=${this.tokens.size})`);let i=this.getProgram(s),r=new qe(this.tokens,t,e,i.length,n);i.push(r)}delete(t,e){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ue.DEFAULT_PROGRAM_NAME;void 0===e&&(e=t),this.replace(t,e,null,n)}getProgram(t){let e=this.programs.get(t);return null==e&&(e=this.initializeProgram(t)),e}initializeProgram(t){const e=[];return this.programs.set(t,e),e}getText(t){let e,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Ue.DEFAULT_PROGRAM_NAME;e=t instanceof S?t:new S(0,this.tokens.size-1),"string"==typeof t&&(s=t);const i=this.programs.get(s);let r=e.start,o=e.stop;if(o>this.tokens.size-1&&(o=this.tokens.size-1),r<0&&(r=0),null==i||0===i.length)return this.tokens.getText(new S(r,o));let l=[],a=this.reduceToSingleOperationPerIndex(i),h=r;for(;h<=o&&h<this.tokens.size;){let t=a.get(h);a.delete(h);let e=this.tokens.get(h);null==t?(e.type!==n.EOF&&l.push(String(e.text)),h++):h=t.execute(l)}if(o===this.tokens.size-1)for(const t of a.values())t.index>=this.tokens.size-1&&l.push(t.text.toString());return l.join("")}reduceToSingleOperationPerIndex(t){for(let e=0;e<t.length;e++){let n=t[e];if(null==n)continue;if(!(n instanceof qe))continue;let s=n,i=this.getKindOfOps(t,Ve,e);for(let e of i)e.index===s.index?(t[e.instructionIndex]=void 0,s.text=e.text.toString()+(null!=s.text?s.text.toString():"")):e.index>s.index&&e.index<=s.lastIndex&&(t[e.instructionIndex]=void 0);let r=this.getKindOfOps(t,qe,e);for(let e of r){if(e.index>=s.index&&e.lastIndex<=s.lastIndex){t[e.instructionIndex]=void 0;continue}let n=e.lastIndex<s.index||e.index>s.lastIndex;if(null!=e.text||null!=s.text||n){if(!n)throw new Error(`replace op boundaries of ${s} overlap with previous ${e}`)}else t[e.instructionIndex]=void 0,s.index=Math.min(e.index,s.index),s.lastIndex=Math.max(e.lastIndex,s.lastIndex)}}for(let e=0;e<t.length;e++){let n=t[e];if(null==n)continue;if(!(n instanceof Ve))continue;let s=n,i=this.getKindOfOps(t,Ve,e);for(let e of i)e.index===s.index&&(e instanceof ze?(s.text=this.catOpText(e.text,s.text),t[e.instructionIndex]=void 0):e instanceof Ve&&(s.text=this.catOpText(s.text,e.text),t[e.instructionIndex]=void 0));let r=this.getKindOfOps(t,qe,e);for(let n of r)if(s.index!==n.index){if(s.index>=n.index&&s.index<=n.lastIndex)throw new Error(`insert op ${s} within boundaries of previous ${n}`)}else n.text=this.catOpText(s.text,n.text),t[e]=void 0}let e=new Map;for(let n of t)if(null!=n){if(null!=e.get(n.index))throw new Error("should only be one op per index");e.set(n.index,n)}return e}catOpText(t,e){let n="",s="";return null!=t&&(n=t.toString()),null!=e&&(s=e.toString()),n+s}getKindOfOps(t,e,n){return t.slice(0,n).filter((t=>t&&t instanceof e))}}class Be{constructor(t,e,n,s){this.tokens=t,this.instructionIndex=n,this.index=e,this.text=void 0===s?"":s}toString(){let t=this.constructor.name;const e=t.indexOf("$");return t=t.substring(e+1,t.length),"<"+t+"@"+this.tokens.get(this.index)+':"'+this.text+'">'}}class Ve extends Be{constructor(t,e,n,s){super(t,e,n,s)}execute(t){return this.text&&t.push(this.text.toString()),this.tokens.get(this.index).type!==n.EOF&&t.push(String(this.tokens.get(this.index).text)),this.index+1}}class ze extends Ve{constructor(t,e,n,s){super(t,e+1,n,s)}}class qe extends Be{constructor(t,e,n,s,i){super(t,e,s,i),this.lastIndex=n}execute(t){return this.text&&t.push(this.text.toString()),this.lastIndex+1}toString(){return null==this.text?"<DeleteOp@"+this.tokens.get(this.index)+".."+this.tokens.get(this.lastIndex)+">":"<ReplaceOp@"+this.tokens.get(this.index)+".."+this.tokens.get(this.lastIndex)+':"'+this.text+'">'}}const He={atn:se,dfa:le,context:ae,misc:he,tree:ge,error:Ce,Token:n,CommonToken:vt,CharStreams:Le,CharStream:Ae,InputStream:Ne,FileStream:ye,CommonTokenStream:we,Lexer:Ft,Parser:be,ParserRuleContext:Me,Interval:S,IntervalSet:m,LL1Analyzer:G,Utils:Oe,TokenStreamRewriter:Ue};var Ke=exports;for(var Ye in e)Ke[Ye]=e[Ye];e.__esModule&&Object.defineProperty(Ke,"__esModule",{value:!0})})();
//# sourceMappingURL=antlr4.node.cjs.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const commander_1 = __nccwpck_require__(379);
const Main_1 = __nccwpck_require__(24);
const CliOperations_1 = __nccwpck_require__(235);
// Main command for policy validation
commander_1.program
    .name('policy-validation-action')
    .description('OCI IAM Policy Validation CLI')
    .version('0.2.7');
commander_1.program
    .command('validate [path]')
    .description('Validate OCI IAM policy statements in files')
    .option('-v, --verbose', 'Enable verbose output')
    .option('-e, --extractor <type>', 'Policy extractor type (regex, hcl)', 'regex')
    .option('-p, --pattern <pattern>', 'Custom regex pattern for policy extraction')
    .option('--files <files>', 'Comma-separated list of specific files to process')
    .option('--exit-on-error <bool>', 'Exit with non-zero status if validation fails', 'true')
    .option('--file-extension <ext>', 'Filter files by specified extension (e.g., .tf)')
    .option('--cis-benchmark', 'Run CIS Benchmark validation', false)
    .action(async (pathArg, cmdOptions) => {
    // Create a CLI-specific platform implementation that handles Commander options
    const cliPlatform = new class extends CliOperations_1.CliOperations {
        // Override getInput to first check command line options, then env vars
        getInput(name) {
            // Map CLI option names to input names
            const optionMap = {
                'path': pathArg,
                'extractor': cmdOptions.extractor,
                'pattern': cmdOptions.pattern,
                'files': cmdOptions.files,
                'exit-on-error': cmdOptions.exitOnError,
                'file-extension': cmdOptions.fileExtension,
                'cis-benchmark': cmdOptions.cisBenchmark
            };
            // First check explicit command options
            if (name in optionMap && optionMap[name] !== undefined) {
                return String(optionMap[name]);
            }
            // Then check environment variables with POLICY_ prefix
            return process.env[`POLICY_${name.replace(/-/g, '_').toUpperCase()}`] || '';
        }
        // Override setResult to handle CLI exit codes
        setResult(success, message) {
            if (message) {
                if (success) {
                    console.log(message);
                }
                else {
                    console.error(message);
                    // Only exit on error if specified by action
                    if (this.getInput('exit-on-error') === 'true') {
                        process.exit(1);
                    }
                }
            }
        }
    };
    // Set verbose mode from option
    if (cmdOptions.verbose) {
        process.env.POLICY_VERBOSE = 'true';
    }
    // Run the action with our CLI platform implementation
    await (0, Main_1.runAction)(cliPlatform);
});
// Parse CLI arguments
commander_1.program.parse(process.argv);
// If no arguments, show help
if (process.argv.length < 3) {
    commander_1.program.help();
}

})();

module.exports = __webpack_exports__;
/******/ })()
;