#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { findTerraformFiles, processFile, parsePolicy, formatPolicyStatements } from './Main';
import { ExtractorType } from './extractors/ExtractorFactory';
import { ValidationOutput } from './types'; // added import

import pkg from '../package.json';

const program = new Command();

program
    .name('policy-validator')
    .description('Validates OCI policy statements in Terraform files')
    .version(pkg.version)
    .option('-p, --path <path>', 'Path to policy file or directory', '.')
    .option('-v, --verbose', 'Enable verbose output')
    .option('--extractor <extractor>', 'Policy extractor type (regex)', 'regex')
    .option('--pattern <pattern>', 'Custom regex pattern for policy extraction')
    .option('--exitOnError', 'Exit with non-zero status if validation fails', true);

program.parse();

const options = program.opts();

const logger = {
    debug: (msg: string) => options.verbose && console.error(msg),
    info: (msg: string) => console.error(msg),
    warn: (msg: string) => console.error(msg),
    error: (msg: string) => console.error(msg)
};

async function run() {
    try {
        const inputPath = path.resolve(options.path);
        const extractorType = options.extractor as ExtractorType;
        const exitOnError = options.exitOnError;
        const files = await findTerraformFiles(inputPath, logger);

        if (files.length === 0) {
            const output = { error: 'No .tf files found' };
            console.log(JSON.stringify(output));  // Use console.log for JSON output
            process.exit(1);
        }

        let allOutputs: ValidationOutput[] = [];

        for (const file of files) {
            logger.info('Validating policy statements for file ' + file);
            const expressions = await processFile(file, options.pattern, extractorType, logger);
            if (expressions.length > 0) {
                const result = parsePolicy(formatPolicyStatements(expressions), logger);
                if (!result.isValid) {
                    result.errors.forEach(error => {
                        logger.error('Failed to parse policy statement:');
                        logger.error(`Statement: "${error.statement}"`);
                        logger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
                    });
                }
                allOutputs.push({
                    file: file,
                    isValid: result.isValid,
                    statements: expressions,
                    errors: result.errors
                });
                
                if (exitOnError && !result.isValid) {
                    // Always output JSON before exiting
                    console.log(JSON.stringify(allOutputs));  // Use console.log
                    process.exit(1);
                }
            }
        }

        if (allOutputs.length === 0) {
            const output = { error: 'No policy statements found' };
            console.log(JSON.stringify(output));  // Use console.log
            process.exit(1);
        }

        // Output validation results
        console.log(JSON.stringify(allOutputs));  // Use console.log
        logger.info('Policy validation successful');
        
        // Exit with error if any validation failed
        if (allOutputs.some(output => !output.isValid)) {
            process.exit(1);
        }
    } catch (error) {
        // Ensure error output is also JSON formatted
        const errorOutput = {
            error: error instanceof Error ? error.message : String(error)
        };
        console.log(JSON.stringify(errorOutput));  // Use console.log
        process.exit(1);
    }
}

run();
