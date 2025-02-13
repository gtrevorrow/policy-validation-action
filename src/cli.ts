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
        // Get all terraform files
        const files = await findTerraformFiles(inputPath, logger);

        if (files.length === 0) {
            logger.error('No .tf files found');
            process.exit(1);
        }

        let allOutputs: ValidationOutput[] = [];

        // Process each file with extractor type and pattern
        for (const file of files) {
            logger.info('Validating policy statements for file ' + file);
            const expressions = await processFile(file, options.pattern, extractorType, logger);
            if (expressions.length > 0) {
                const result = parsePolicy(formatPolicyStatements(expressions), logger);
                // Status messages to stderr
                if (!result.isValid) {
                    result.errors.forEach(error => {
                        logger.error('Failed to parse policy statement:');
                        logger.error(`Statement: "${error.statement}"`);
                        logger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
                    });
                    if (exitOnError) {
                        logger.error(`Policy validation failed for file ${file}`);
                        process.exit(1);
                    }
                }
                allOutputs.push({
                    file: file,
                    isValid: result.isValid,
                    statements: expressions,
                    errors: result.errors
                });

            }
        }
        if (allOutputs.length === 0) {
            logger.warn('No policy statements found');
            process.exit(1);
        }
        // Output validation results to stdout (JSON only)
        process.stdout.write(JSON.stringify(allOutputs, null, 2) + '\n');
        logger.info('Policy validation successful');
    } catch (error) {
        logger.error(`Error: ${error}`);
        process.exit(1);
    }
}

run();
