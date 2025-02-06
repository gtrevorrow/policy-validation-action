#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { findTerraformFiles, processFile, parsePolicy } from './Main';

const pkg = require('../package.json');

const program = new Command();

program
    .name('policy-validator')
    .description('Validates OCI policy statements in Terraform files')
    .version(pkg.version)
    .option('-p, --path <path>', 'Path to policy file or directory', '.')
    .option('-v, --verbose', 'Enable verbose output')
    .option('--pattern <pattern>', 'Custom regex pattern for policy extraction');

program.parse();

const options = program.opts();

const logger = {
    debug: (msg: string) => options.verbose && console.log(msg),
    info: (msg: string) => console.log(msg),
    warn: (msg: string) => console.warn(msg),
    error: (msg: string) => console.error(msg)
};

async function run() {
    try {
        const inputPath = path.resolve(options.path);
        
        // Get all terraform files
        const files = await findTerraformFiles(inputPath, logger);
        
        if (files.length === 0) {
            logger.error('No .tf files found');
            process.exit(1);
        }

        let allExpressions: string[] = [];
        
        // Process each file
        for (const file of files) {
            const expressions = await processFile(file, logger);
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
        const result = parsePolicy(allExpressions.join('\n'), logger);

        if (!result.isValid) {
            result.errors.forEach(error => {
                logger.error('Failed to parse policy statement:');
                logger.error(`Statement: "${error.statement}"`);
                logger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
            });
            process.exit(1);
        }

        // Output validation results
        const output = {
            isValid: result.isValid,
            statements: allExpressions,
            errors: result.errors
        };
        console.log(JSON.stringify(output, null, 2));
        
        logger.info('Policy validation successful');
    } catch (error) {
        logger.error(`Error: ${error}`);
        process.exit(1);
    }
}

run();
