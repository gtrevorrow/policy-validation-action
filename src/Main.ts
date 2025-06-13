import * as fs from 'fs';
import * as path from 'path';
import { Logger, PolicyError, PlatformOperations, ValidationOptions } from './types';
import { ExtractorFactory, ExtractorType } from './extractors/ExtractorFactory';
import { ValidationPipeline } from './validators/ValidationPipeline';
import { FileValidationResult } from './types';
import { ValidatorFactory } from './validators/ValidatorFactory';

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

/** 
 * Function to find policy files in a directory
 * This function will recursively search for files matching the specified criteria
 * and return their paths. It also handles both file and directory inputs.
 * @param dir The directory to search in
 * @param options Optional parameters for file names and extensions
 * @param logger Optional logger for recording diagnostic info
 * @returns An array of file paths that match the criteria
 * If no files are found, an empty array is returned.
 * If the path is not accessible, an error is logged and an empty array is returned. 
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

// Single export statement at the end of the file
export {
  findPolicyFiles,
  processFile,
};

/**
 * Validate policies at the given path using the specified options.
 *  
 * This function processes policy files found at `scanPath`. For each file, it extracts
 * policy statements based on `options.extractorType` and `options.pattern`.
 * These statements are then run through validation pipelines.
 * 
 * The validation process includes:
 *   - A local validation pipeline that runs on each file individually (includes OciSyntaxValidator)
 *   - A global validation pipeline that runs on all statements from all files together 
 *     (includes OciCisBenchmarkValidator when enabled)
 *
 * @param scanPath Path (file or directory) to scan for policy files.
 * @param options ValidationOptions:
 *   - extractorType: 'regex' or a custom extractor type
 *   - pattern?: Regex string for statement extraction
 *   - fileExtension?: Only include files with this extension
 *   - fileNames?: Explicit list of filenames to process
 *   - exitOnError: Stop processing on first error (Note: behavior might be validator-specific)
 *   - validatorConfig?: Configuration for which validator pipelines to run
 * @param logger Logger instance for diagnostic output.
 * @returns Promise<FileValidationResult[]>:
 *   - An array of `FileValidationResult`. Each entry corresponds to a processed file
 *     and contains the `file` path and an array of `ValidationPipelineResult` objects.
 *   - Each `ValidationPipelineResult` includes the `validatorName`, `validatorDescription`,
 *     and an array of `ValidationReport` objects from that validator.
 *   - If global validators are enabled, an additional `FileValidationResult` with `file: 'Global Validation'`
 *     will be included, containing reports from the global validation pipeline.
 *   - Returns an empty array if no files match the criteria or no statements are extracted.
  */
export async function validatePolicies(
  scanPath: string,
  options: ValidationOptions,
  logger: Logger
): Promise<FileValidationResult[]> {
  // Find all policy files - findPolicyFiles already handles inaccessible paths
  const filesToProcess = await findPolicyFiles(scanPath, {
    fileNames: options.fileNames,
    fileExtension: options.fileExtension,
  }, logger);

  if (filesToProcess.length === 0) {
    const message = options.fileExtension == undefined ?
      `No files found in ${scanPath}` :
      `No files matching criteria found in ${scanPath}`;
    logger.warn(message);
    return [];
  }

  // Track all validation outputs and collect expressions for global pipeline
  const results: FileValidationResult[] = [];
  const allExpressions: string[] = [];
  
  // Use validator configuration if provided, otherwise use defaults
  const validatorConfig = options.validatorConfig || {
    runLocalValidators: true,
    runGlobalValidators: false
  };
  
  // Create pipelines using the ValidatorFactory
  const localPipeline = validatorConfig.runLocalValidators ? 
    ValidatorFactory.createPipeline('local', options, logger) : 
    new ValidationPipeline(logger);
    
  const globalPipeline = validatorConfig.runGlobalValidators ?
    ValidatorFactory.createPipeline('global', options, logger) :
    new ValidationPipeline(logger);
  
  // Per-file local pipeline
  for (const file of filesToProcess) {
    logger.info(`Processing file ${file}`);
    const expressions = await processFile(file, options.pattern, options.extractorType as ExtractorType, logger);
    allExpressions.push(...expressions);

    const syntaxResults = await localPipeline.validate(expressions);

    results.push({ file, results: syntaxResults });
  }

  // Global pipeline - only run if it has validators
  if (globalPipeline.hasValidators() && allExpressions.length > 0) {
    logger.info('Running global validation pipeline on all statements...');
    const globalResults = await globalPipeline.validate(allExpressions);
    if (globalResults.length > 0) {
      results.push({ file: 'Global Validation', results: globalResults });
    }
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

    
    // fail fast if the top‐level path is inaccessible
    try {
      await fs.promises.access(scanPath, fs.constants.R_OK);
    } catch (e: any) {
      throw new Error(`Path ${scanPath} is not accessible: ${e.message}`);
    }
   

    // Helper function to parse boolean inputs with explicit defaults
    const parseBooleanInput = (name: string, defaultValue: boolean): boolean => {
      const value = platform.getInput(name);
      if (!value) return defaultValue;
      return value.toLowerCase() === 'true';
    };
    
    // Build options from inputs with appropriate defaults
    const options: ValidationOptions = {
      extractorType: platform.getInput('extractor') || 'regex',
      pattern: platform.getInput('pattern') || process.env.POLICY_STATEMENTS_PATTERN,
      fileExtension: platform.getInput('file-extension'),
      fileNames: platform.getInput('files') ?
        platform.getInput('files').split(',').map(f => f.trim()) :
        undefined,
      exitOnError: parseBooleanInput('exit-on-error', false),
      validatorConfig: {
        runLocalValidators: parseBooleanInput('validators-local', true),
        runGlobalValidators: parseBooleanInput('validators-global', false)
      }
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
      logger.info(`Using default pattern`);
    }
    logger.info(`Exit on error: ${options.exitOnError}`);
    
    // Log validator configuration
    if (options.validatorConfig) {
      logger.info(`Local validators enabled: ${options.validatorConfig.runLocalValidators}`);
      logger.info(`Global validators enabled: ${options.validatorConfig.runGlobalValidators}`);
    }

    // Run policy validation - error handling including path access errors happens here
    const outputs = await validatePolicies(scanPath, options, logger);
    
    // platform.info( JSON.stringify(outputs) );
    platform.setOutput('results', JSON.stringify(outputs));

    // determine overall success
    const overallSuccess = outputs
      .flatMap(o => o.results)
      .every(r => r.reports.every(rep => rep.passed));

    platform.setResult(
      overallSuccess,
      overallSuccess
        ? 'Policy validation succeeded'
        : 'Policy validation failed for one or more files/checks.'
    );

  } catch (error: any) {
    const msg = error.message || String(error);
    logger.error(msg);

    // CLI JSON error line (error already a string)
    console.log(JSON.stringify({ error: msg }));

    // GitHub Actions output API (no-op in CLI)
    platform.setOutput('results', JSON.stringify([]));
    platform.setResult(false, msg);
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