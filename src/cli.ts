#!/usr/bin/env node
import { program } from 'commander';
import { findPolicyFiles, processFile, validatePolicySyntax } from './Main';
import { Logger, ValidationOutput } from './types';
import path from 'path';
import fs from 'fs';
import { ExtractorType } from './extractors/ExtractorFactory';
import { ValidationPipeline } from './validators/ValidationPipeline';
import { OciCisBenchmarkValidator } from './validators/OciCisBenchmarkValidator';
import { OciSyntaxValidator } from './validators/OciSyntaxValidator';

// Setup CLI logger
const cliLogger: Logger = {
  debug: (msg: string) => {
    if (process.env.POLICY_VERBOSE === 'true') {
      console.error(msg);
    }
  },
  info: (msg: string) => {
    if (process.env.POLICY_VERBOSE === 'true') {
      console.error(msg);
    }
  },
  warn: (msg: string) => console.error(msg),
  error: (msg: string) => console.error(msg)
};

// Helper function to resolve path
function resolvePath(inputPath: string): string {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}

// Main command for policy validation
program
  .name('policy-validation-action')
  .description('OCI IAM Policy Validation CLI')
  .version('0.2.7');

program
  .command('validate [path]')
  .description('Validate OCI IAM policy statements in files')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-e, --extractor <type>', 'Policy extractor type (regex, hcl)', 'regex')
  .option('-p, --pattern <pattern>', 'Custom regex pattern for policy extraction')
  .option('--files <files>', 'Comma-separated list of specific files to process')
  .option('--exit-on-error <bool>', 'Exit with non-zero status if validation fails', 'true')
  .option('--cis-benchmark', 'Run CIS Benchmark validation', false)
  .action(async (pathArg, options) => {
    try {
      // Set verbose mode from option or environment variable
      if (options.verbose) {
        process.env.POLICY_VERBOSE = 'true';
      }

      // Determine path to scan
      const inputPath = pathArg || process.env.POLICY_PATH || '.';
      const scanPath = resolvePath(inputPath);
      cliLogger.info(`Resolved path: ${scanPath}`);

      // Get extractor type
      const extractorType = (options.extractor || process.env.POLICY_EXTRACTOR || 'regex') as ExtractorType;
      cliLogger.info(`Using extractor: ${extractorType}`);

      // Get pattern
      const pattern = options.pattern || process.env.POLICY_PATTERN;

      // Get files filter
      const fileNames = options.files || process.env.POLICY_FILES ? 
        (options.files || process.env.POLICY_FILES || '').split(',').map((f: string) => f.trim()) : 
        undefined;
      
      if (fileNames && fileNames.length > 0) {
        cliLogger.info(`Files filter: ${fileNames.join(', ')}`);
      }

      // Get custom pattern
      if (pattern) {
        cliLogger.info(`Custom pattern: ${pattern}`);
      } else {
        cliLogger.info('Custom pattern: none');
      }

      // Get exit on error
      const exitOnError = options.exitOnError === 'true' || process.env.POLICY_EXIT_ON_ERROR === 'true';
      cliLogger.info(`Exit on error: ${exitOnError}`);

      // Get CIS benchmark validation flag
      const runCisBenchmark = options.cisBenchmark || false;

      // Check if path exists and is accessible
      try {
        await fs.promises.access(scanPath, fs.constants.R_OK);
      } catch (error) {
        console.error(`Path ${scanPath} is not accessible: ${error}`);
        console.log(JSON.stringify({ error: `Path ${scanPath} is not accessible: ${error}` }));
        process.exit(1);
      }

      // Find all policy files
      const tfFiles = await findPolicyFiles(scanPath, { fileNames, fileExtension: '.tf' }, cliLogger);
      
      if (tfFiles.length === 0) {
        console.error(`No policy files found in ${scanPath}`);
        console.log(JSON.stringify({ error: `No policy files found in ${scanPath}` }));
        process.exit(1);
      }

      // Track all validation outputs
      const allOutputs: ValidationOutput[] = [];
      
      // Track all policy statements for validation pipeline
      const allPolicyStatements: string[] = [];
      
      // Process each file
      for (const file of tfFiles) {
        cliLogger.info(`Validating policy statements for file ${file}`);
        const expressions = await processFile(file, pattern, extractorType, cliLogger);
        
        // Collect statements for validation pipeline
        if (expressions.length > 0) {
          allPolicyStatements.push(...expressions);
        }
        
        // Validate syntax
        if (expressions.length > 0) {
          // Use the OciSyntaxValidator for validation
          const result = await validatePolicySyntax(expressions, cliLogger);
          
          // Add results to outputs
          allOutputs.push({
            file,
            isValid: result.isValid,
            statements: expressions,
            errors: result.errors
          });
          
          // Exit on first error if required
          if (!result.isValid && exitOnError) {
            console.log(JSON.stringify(allOutputs));
            process.exit(1);
          }
        }
      }
      
      // Run the validation pipeline with all statements if requested
      if (allPolicyStatements.length > 0 && runCisBenchmark) {
        cliLogger.info('Running validation pipeline...');
        
        // Set up validation pipeline
        const validationPipeline = new ValidationPipeline(cliLogger);
        
        // Add validators
        validationPipeline.addValidator(new OciSyntaxValidator(cliLogger));
        validationPipeline.addValidator(new OciCisBenchmarkValidator(cliLogger));
        
        // Run validation
        const results = await validationPipeline.validate(allPolicyStatements);
        
        // Process results
        let hasIssues = false;
        for (const validatorResult of results) {
          cliLogger.info(`Results from ${validatorResult.validatorName}:`);
          
          for (const report of validatorResult.reports) {
            if (!report.passed) {
              hasIssues = true;
              cliLogger.warn(`Failed check: ${report.checkId} - ${report.name}`);
              
              for (const issue of report.issues) {
                cliLogger.warn(`- ${issue.message}`);
              }
            } else {
              cliLogger.info(`Passed check: ${report.checkId} - ${report.name}`);
            }
          }
        }
        
        // Add validation results to output
        if (allOutputs.length > 0) {
          allOutputs[0].validationResults = results;
        }
        
        // Exit if issues found and exitOnError is true
        if (hasIssues && exitOnError) {
          console.log(JSON.stringify(allOutputs));
          cliLogger.error('Policy validation failed');
          process.exit(1);
        }
      }
      
      // Log completion
      cliLogger.info('Policy validation completed');
      
      // Output results as JSON
      console.log(JSON.stringify(allOutputs));
      
      // Exit with appropriate status
      if (allOutputs.some(output => !output.isValid)) {
        process.exit(exitOnError ? 1 : 0);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      console.log(JSON.stringify({ error: `${error}` }));
      process.exit(1);
    }
  });

// Parse CLI arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length < 3) {
  program.help();
}
