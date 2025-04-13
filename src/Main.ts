import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, ParseResult, PolicyError, ValidationOutput, PlatformOperations, ValidationOptions, ValidationPipelineResult } from './types'; // Added ValidationPipelineResult
import { ExtractorFactory, ExtractorType } from './extractors/ExtractorFactory';
import { ValidationPipeline } from './validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from './validators/OciCisBenchmarkValidator';
import { OciSyntaxValidator } from './validators/OciSyntaxValidator';

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
    options?: { fileNames?: string[], fileExtension?: string}, 
    logger?: Logger
): Promise<string[]> {

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
            
            // If file extension is specified, check if file matches
            if (options?.fileExtension && !dir.endsWith(options.fileExtension)) {
                logger?.debug(`File ${dir} doesn't match extension ${options.fileExtension}, skipping`);
                return [];
            }
            
            // Include the file
            return [dir];
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
                    } else if (entry.isFile()) {
                        // If file extension is specified, check if file matches
                        if (options?.fileExtension && !entry.name.endsWith(options.fileExtension)) {
                            logger?.debug(`File ${entry.name} doesn't match extension ${options.fileExtension}, skipping`);
                            continue;
                        }
                        
                        logger?.debug(`Found file: ${fullPath}`);
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
                    } else if (entryStats.isFile()) {
                        // If file extension is specified, check if file matches
                        if (options?.fileExtension && !name.endsWith(options.fileExtension)) {
                            logger?.debug(`File ${name} doesn't match extension ${options.fileExtension}, skipping`);
                            continue;
                        }
                        
                        logger?.debug(`Found file: ${fullPath}`);
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

/**
 * Validates OCI policy statements for syntax correctness.
 * This is a wrapper around OciSyntaxValidator for backward compatibility.
 * @param statements The policy statements to validate
 * @param logger Optional logger for recording diagnostic info
 * @returns Parse result with validity status and any errors
 */
async function validatePolicySyntax(statements: string[], logger?: Logger): Promise<ParseResult> {
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
export async function validatePolicies(
  scanPath: string, 
  options: ValidationOptions, 
  logger: Logger
): Promise<ValidationOutput[]> {
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

  // Track all validation outputs
  const allOutputs: ValidationOutput[] = [];

  // Track all policy statements for validation pipeline
  const allPolicyStatements: string[] = [];
  
  // Process each file
  for (const file of filesToProcess) {
    logger.info(`Processing file ${file}`);
    const expressions = await processFile(file, options.pattern, options.extractorType as ExtractorType, logger);

    let fileIsValid = true;
    let fileErrors: PolicyError[] = [];
    let validationResults: ValidationPipelineResult[] | undefined = undefined; // Hold potential pipeline results per file if needed later

    // Collect statements for overall validation pipeline
    if (expressions.length > 0) {
      allPolicyStatements.push(...expressions);

      // Validate syntax for this file's expressions
      const syntaxResult = await validatePolicySyntax(expressions, logger);
      fileIsValid = syntaxResult.isValid;
      fileErrors = syntaxResult.errors;

      // Exit on first error if required and this file has errors
      if (!fileIsValid && options.exitOnError) {
         // Add the current file's result before returning
         allOutputs.push({
           file,
           isValid: fileIsValid,
           statements: expressions,
           errors: fileErrors,
           // validationResults: undefined // No pipeline results yet
         });
        logger.error(`Validation failed for ${file} and exitOnError is true. Stopping.`);
        return allOutputs;
      }
    } else {
      logger.info(`No policy statements found in ${file}`);
      // File is considered valid if no statements are found to be invalid
      fileIsValid = true;
      fileErrors = [];
    }

    // Add an output entry for every processed file
    allOutputs.push({
      file,
      isValid: fileIsValid,
      statements: expressions,
      errors: fileErrors,
      // validationResults will be added later if pipeline runs
    });
  }

  // Run the validation pipeline with all statements if requested
  if (allPolicyStatements.length > 0 && options.runCisBenchmark) {
    logger.info('Running validation pipeline on all collected statements...');

    // Set up validation pipeline
    const validationPipeline = new ValidationPipeline(logger);

    // Add validators
    // validationPipeline.addValidator(new OciSyntaxValidator(logger)); // Syntax already checked per file
    validationPipeline.addValidator(new OciCisBenchmarkValidator(logger));

    // Run validation
    const pipelineResults = await validationPipeline.validate(allPolicyStatements);

    // Process results and potentially update overall validity or add to outputs
    let pipelineHasIssues = false;
    for (const validatorResult of pipelineResults) {
      logger.info(`Pipeline Results from ${validatorResult.validatorName}:`);
      for (const report of validatorResult.reports) {
        if (!report.passed) {
          pipelineHasIssues = true;
          logger.warn(`Failed check: ${report.checkId} - ${report.name}`);
          for (const issue of report.issues) {
            logger.warn(`- [${issue.severity.toUpperCase()}] ${issue.message} (Statement: "${issue.statement || 'N/A'}")`);
          }
        } else {
          logger.info(`Passed check: ${report.checkId} - ${report.name}`);
        }
      }
    }

    // Add pipeline results to the first output object for simplicity in current structure
    // A more robust approach might distribute results per file or have a separate output field
    if (allOutputs.length > 0) {
       // Check if the first output already exists, otherwise create a placeholder if needed
       if (!allOutputs[0]) {
           allOutputs[0] = { file: "Pipeline Summary", isValid: !pipelineHasIssues, statements: [], errors: [] };
       }
       allOutputs[0].validationResults = pipelineResults;
       // Optionally, mark the first file as invalid if the pipeline failed and exitOnError is true
       if (pipelineHasIssues) {
           allOutputs[0].isValid = false;
       }
    }


    // Return early if pipeline issues found and exitOnError is true
    if (pipelineHasIssues && options.exitOnError) {
       logger.error('Validation pipeline found issues and exitOnError is true. Stopping.');
       // Ensure the overall status reflects the failure
       const finalOutputs = allOutputs.map(o => ({...o, isValid: o.isValid && !pipelineHasIssues }));
       return finalOutputs;
    }
  }

  logger.info('Policy validation processing completed');
  // Ensure overall validity reflects pipeline results if run
  const finalOverallValidity = !allOutputs.some(o => !o.isValid);
  logger.info(`Overall validation status: ${finalOverallValidity ? 'Success' : 'Failed'}`);

  return allOutputs;
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
    
    // Check if path exists and is accessible
    try {
      await fs.promises.access(scanPath, fs.constants.R_OK);
    } catch (error) {
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
    
    // Determine success/failure based on the isValid flag in the results array
    const overallSuccess = results.every(output => output.isValid);

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