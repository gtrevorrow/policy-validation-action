import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, ParseResult, PolicyError, ValidationOutput, PlatformOperations, ValidationOptions } from './types';
import { ExtractorFactory, ExtractorType } from './extractors/ExtractorFactory';
import { ValidationPipeline } from './validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from './validators/OciCisBenchmarkValidator';
import { OciSyntaxValidator } from './validators/OciSyntaxValidator';

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
      `No policy files found in ${scanPath}`;
    throw new Error(message);
  }

  // Track all validation outputs
  const allOutputs: ValidationOutput[] = [];
  
  // Track all policy statements for validation pipeline
  const allPolicyStatements: string[] = [];
  
  // Process each file
  for (const file of filesToProcess) {
    logger.info(`Validating policy statements for file ${file}`);
    const expressions = await processFile(file, options.pattern, options.extractorType as ExtractorType, logger);
    
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
    const validationPipeline = new ValidationPipeline(logger);
    
    // Add validators
    validationPipeline.addValidator(new OciSyntaxValidator(logger));
    validationPipeline.addValidator(new OciCisBenchmarkValidator(logger));
    
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
        } else {
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
    } else {
      logger.info('Custom pattern: none');
    }
    logger.info(`Exit on error: ${options.exitOnError}`);
    
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
    
    // Determine success/failure
    const hasFailures = results.some(output => !output.isValid);
    if (hasFailures) {
      platform.setResult(!options.exitOnError, 'Policy validation failed');
    } else {
      platform.setResult(true, 'Policy validation succeeded');
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
    platform.setOutput('error', `${error}`);
    platform.setResult(false, `Error: ${error}`);
  }
}

/**
 * Helper function to resolve path
 */
function resolvePath(inputPath: string): string {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}