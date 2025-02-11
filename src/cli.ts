#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { findTerraformFiles, processFile, parsePolicy, formatPolicyStatements } from './Main';
import { ExtractorType } from './extractors/ExtractorFactory';

import pkg from '../package.json';

const program = new Command();

program
    .name('policy-validator')
    .description('Validates OCI policy statements in Terraform files')
    .version(pkg.version)
    .option('-p, --path <path>', 'Path to policy file or directory', '.')
    .option('-v, --verbose', 'Enable verbose output')
    .option('--extractor <extractor>', 'Policy extractor type (regex)', 'regex')
    .option('--pattern <pattern>', 'Custom regex pattern for policy extraction');

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
        
        // Get all terraform files
        const files = await findTerraformFiles(inputPath, logger);
        
        if (files.length === 0) {
            logger.error('No .tf files found');
            process.exit(1);
        }

        let allExpressions: string[] = [];
        
        // Process each file with extractor type and pattern
        for (const file of files) {
            const expressions = await processFile(file, options.pattern, extractorType, logger);
            if (expressions.length > 0) {
                allExpressions.push(...expressions);
            }
        }

        if (allExpressions.length === 0) {
            logger.warn('No policy statements found');
            process.exit(1);
        }

        // Validate all found expressions
        logger.info('Validating policy statements...');
        const result = parsePolicy(formatPolicyStatements(allExpressions), logger);

        // Output validation results to stdout (JSON only)
        const output = {
            isValid: result.isValid,
            statements: allExpressions,
            errors: result.errors
        };
        process.stdout.write(JSON.stringify(output, null, 2) + '\n');

        // Status messages to stderr
        if (!result.isValid) {
            result.errors.forEach(error => {
                logger.error('Failed to parse policy statement:');
                logger.error(`Statement: "${error.statement}"`);
                logger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
            });
            process.exit(1);
        }
        
        logger.info('Policy validation successful');
    } catch (error) {
        logger.error(`Error: ${error}`);
        process.exit(1);
    }
}

run();
