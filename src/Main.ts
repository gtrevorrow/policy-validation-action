import * as fs from 'fs';
import * as path from 'path';
import { Logger, PolicyError, PlatformOperations, ValidationOptions, ValidationPipelineResult } from './types'; // Added ValidationPipelineResult
import { ExtractorFactory, ExtractorType } from './extractors/ExtractorFactory';
import { ValidationPipeline } from './validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from './validators/OciCisBenchmarkValidator';
import { OciSyntaxValidator } from './validators/OciSyntaxValidator';
import { FileValidationResult } from './types';

/**
 * Function to format policy statements for output
 * This function ensures that each statement is on its own line and properly formatted.
 * It is used to prepare the output for better readability.
 * @param expressions 
 * @returns  Formatted string of policy statements
 * Each statement is separated by a newline character.
 */
function formatPolicyStatements(expressions: string[]): string {
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
async function findPolicyFiles(
  dir: string,
  options?: { fileNames?: string[]; fileExtension?: string },
  logger?: Logger
): Promise<string[]> {
  try {
    // First check if path exists and is accessible
    await fs.promises.access(dir, fs.constants.R_OK)
  } catch (error) {
    logger?.error(`Path ${dir} is not accessible: ${error}`)
    return []
  }

  const stats = await fs.promises.stat(dir)
  // If it's a file, apply name/extension filters
  if (stats.isFile()) {
    const base = path.basename(dir)
    if (options?.fileNames?.length && !options.fileNames.includes(base)) {
      return []
    }
    if (options?.fileExtension && !dir.endsWith(options.fileExtension)) {
      return []
    }
    return [dir]
  }
  if (!stats.isDirectory()) {
    logger?.error(`Path ${dir} is neither a file nor a directory`)
    return []
  }

  // If specific fileNames provided, pick those
  if (options?.fileNames?.length) {
    const found: string[] = []
    for (const name of options.fileNames) {
      const candidate = path.join(dir, name)
      try {
        const st = await fs.promises.stat(candidate)
        if (st.isFile()) found.push(candidate)
      } catch {
        logger?.debug(`File ${name} not found in ${dir}`)
      }
    }
    return found
  }

  // Otherwise recursively scan directory
  const results: string[] = []
  for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findPolicyFiles(fullPath, options, logger))
    } else if (entry.isFile()) {
      if (options?.fileExtension && !entry.name.endsWith(options.fileExtension)) {
        continue
      }
      results.push(fullPath)
    }
  }

  return results
}

/**
 * Validates OCI policy statements for syntax correctness.
 * This is a wrapper around OciSyntaxValidator for backward compatibility.
 * @param statements The policy statements to validate
 * @param logger Optional logger for recording diagnostic info
 * @returns Object with validity status and any errors
 */
async function validatePolicySyntax(statements: string[], logger?: Logger) {
  const syntaxValidator = new OciSyntaxValidator(logger);
  const validationReports = await syntaxValidator.validate(statements);

  // Process validation results into the expected ParseResult format
  const syntaxReport = validationReports[0]; // We expect only one report from OciSyntaxValidator
  const isValid = syntaxReport.passed;

  // Convert validation issues to PolicyError format
  const errors: PolicyError[] = [];
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

// Single export statement at the end of the file
export {
  findPolicyFiles,
  processFile,
  validatePolicySyntax, // We keep this for backward compatibility with existing test files
  formatPolicyStatements
};

/**
 * Validate policies at the given path using the specified options.
 * @param scanPath Path (file or directory) to scan for policy files.
 * @param options ValidationOptions including:
 *   - extractorType: 'regex' or custom extractor
 *   - pattern?: regex string for statement extraction
 *   - fileExtension?: filter files by extension
 *   - fileNames?: explicit list of filenames to include
 *   - exitOnError: stop early on first syntax failure
 *   - runCisBenchmark: include CIS benchmark validation
 * @param logger Logger instance for diagnostic output.
 * @returns Promise<FileValidationResult[]> 
 *   Array of per-file results; each has `file` and `results[]` of validator reports.
 *   Returns an empty array if no files match the criteria.
 */
export async function validatePolicies(
  scanPath: string,
  options: ValidationOptions,
  logger: Logger
): Promise<FileValidationResult[]> {
  // Find all policy files
  const filesToProcess = await findPolicyFiles(scanPath, {
    fileNames: options.fileNames,
    fileExtension: options.fileExtension,
  }, logger);

  if (filesToProcess.length === 0) {
    const message = options.fileExtension == undefined ?
      `No files found in ${scanPath}` :
      `No files matching criteria found in ${scanPath}`; // Adjusted message
    // Don't throw an error, return empty array if no files match
    logger.warn(message);
    return [];
    // throw new Error(message); // Original behavior
  }

  // Track all validation outputs and collect expressions for global pipeline
  const results: FileValidationResult[] = [];
  const allExpressions: string[] = [];
  const localPipeline = new ValidationPipeline(logger);
  const globalPipeline = new ValidationPipeline(logger);
  // Per-file local pipeline
  for (const file of filesToProcess) {
    logger.info(`Processing file ${file}`);
    const expressions = await processFile(file, options.pattern, options.extractorType as ExtractorType, logger);
    allExpressions.push(...expressions);
    localPipeline.addValidator(new OciSyntaxValidator(logger));

    const syntaxResults = await localPipeline.validate(expressions);

    results.push({ file, results: syntaxResults });
  }

  // Global CIS benchmark pipeline, if requested
  if (options.runCisBenchmark && allExpressions.length > 0) {
    logger.info('Running global CIS benchmark validation on all statements...');
    globalPipeline.addValidator(new OciCisBenchmarkValidator(logger));

    const cisResults = await globalPipeline.validate(allExpressions);

    results.push({ file: 'CIS Benchmark', results: cisResults });
  }

  return results;
}

/**
 * Main entry point for running the policy validation
 * This function serves both the CLI and GitHub Action
 * @param platform The platform abstraction for handling inputs, outputs, and logging
 * @returns A promise that resolves when the action is complete
 * If an error occurs, it will be logged and the action will fail
 */
export async function runAction(platform: PlatformOperations): Promise<void> {
  const logger = platform.createLogger();

  try {
    // Get inputs using the platform abstraction
    const inputPath = platform.getInput('path') || '.';
    const scanPath = resolvePath(inputPath);
    logger.info(`Resolved path: ${scanPath}`);

    // ❌ Path existence/pre‑accessibility check BEFORE validation
    try {
      await fs.promises.access(scanPath, fs.constants.R_OK);
    } catch (err) {
      const errorMsg = `Path ${scanPath} is not accessible: ${err}`;
      logger.error(errorMsg);
      platform.setOutput('error', errorMsg);
      platform.setResult(false, errorMsg);
      return;
    }

    // Build options from inputs
    const options: ValidationOptions = {
      extractorType: platform.getInput('extractor') || 'regex',
      pattern: platform.getInput('pattern') || process.env.POLICY_STATEMENTS_PATTERN, // Use env var as fallback
      fileExtension: platform.getInput('file-extension'),
      fileNames: platform.getInput('files') ?
        platform.getInput('files').split(',').map(f => f.trim()) :
        undefined,
      exitOnError: platform.getInput('exit-on-error') !== 'false', // Default to true unless explicitly 'false'
      runCisBenchmark: platform.getInput('cis-benchmark') === 'true'
    };

    // Log options
    logger.info(`Using extractor: ${options.extractorType}`);
    logger.info(`File extension: ${options.fileExtension || 'not specified'}`);
    if (options.fileNames && options.fileNames.length > 0) {
      logger.info(`Files filter: ${options.fileNames.join(', ')}`);
    }
    if (options.pattern && options.pattern !== process.env.POLICY_STATEMENTS_PATTERN) { // Log if different from potential env var default
      logger.info(`Custom pattern: ${options.pattern}`);
    } else if (process.env.POLICY_STATEMENTS_PATTERN) {
      logger.info(`Using pattern from env var POLICY_STATEMENTS_PATTERN`);
    } else {
      logger.info('Using default pattern');
    }
    logger.info(`Exit on error: ${options.exitOnError}`);
    logger.info(`Run CIS Benchmark: ${options.runCisBenchmark}`);

    // Run policy validation
    const outputs = await validatePolicies(scanPath, options, logger);

    // emit JSON
    platform.setOutput('results', JSON.stringify(outputs));

    // determine overallSuccess
    const overallSuccess = outputs
      .flatMap(o => o.results)
      .every(r => r.reports.every(rep => rep.passed));

    if (overallSuccess) {
      platform.setResult(true, 'Policy validation succeeded');
    } else {
      // Fail the step if any file is invalid, regardless of exitOnError option
      // exitOnError only controls whether processing stops early
      platform.setResult(false, 'Policy validation failed for one or more files/checks.');
    }
  } catch (error) {
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
function resolvePath(inputPath: string): string {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}