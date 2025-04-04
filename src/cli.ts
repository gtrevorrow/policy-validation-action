#!/usr/bin/env node

import { program } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { findPolicyFiles, processFile, parsePolicy, formatPolicyStatements } from './Main';
import { ExtractorType } from './extractors/ExtractorFactory';
import { Logger, ValidationOutput } from './types';

import pkg from '../package.json';

program
    .name('policy-validation-action')
    .description('OCI Policy Validation Tool ')
    .version(pkg.version);

program
    .command('validate')
    .description('Validate OCI policy statements in files')
    .argument('[path]', 'Path to a file or directory containing Terraform files', '.')
    .option('-v, --verbose', 'Enable verbose output')
    .option('-p, --pattern <pattern>', 'Custom regex pattern to extract policy statements')
    .option('-e, --extractor <type>', 'Extractor type (regex or hcl)', 'regex')
    .option('--files <files>', 'Comma-separated list of specific files to process')
    .option('--exit-on-error', 'Exit with non-zero status if validation fails', true)
    .action(async (scanPath, options) => {
        const resolvedPath = path.resolve(scanPath || process.env.POLICY_PATH || '.');
        const consoleLogger: Logger = {
            debug: (msg: string) => options.verbose && console.error(msg),
            info: (msg: string) => console.error(msg),
            warn: (msg: string) => console.error(msg),
            error: (msg: string) => console.error(msg)
        };

        // Parse options with fallback to environment variables
        const fileNames = options.files 
            ? options.files.split(',').map((f: string) => f.trim()) 
            : process.env.POLICY_FILES?.split(',').map((f: string) => f.trim());
        const pattern = options.pattern || process.env.POLICY_PATTERN;
        const extractor = options.extractor || process.env.POLICY_EXTRACTOR || 'regex';
        const exitOnError = options.exitOnError ?? (process.env.POLICY_EXIT_ON_ERROR === 'true');

        // Debug log for troubleshooting
        if (options.verbose) {
            consoleLogger.debug(`Resolved path: ${resolvedPath}`);
            consoleLogger.debug(`Using extractor: ${extractor}`);
            consoleLogger.debug(`Files filter: ${fileNames ? fileNames.join(', ') : 'none'}`);
            consoleLogger.debug(`Custom pattern: ${pattern || 'none'}`);
            consoleLogger.debug(`Exit on error: ${exitOnError}`);
        }
        
        const files = await findPolicyFiles(resolvedPath, { fileNames }, consoleLogger);

        if (files.length === 0) {
            const output = { error: `No policy files found in ${resolvedPath}` };
            console.log(JSON.stringify(output));
            process.exit(1);
        }

        let allOutputs: ValidationOutput[] = [];

        for (const file of files) {
            consoleLogger.info(`Validating policy statements for file ${file}`);
            const expressions = await processFile(file, pattern, extractor as ExtractorType, consoleLogger);
            if (expressions.length > 0) {
                const result = parsePolicy(formatPolicyStatements(expressions), consoleLogger);
                if (!result.isValid) {
                    result.errors.forEach(error => {
                        consoleLogger.error('Failed to parse policy statement:');
                        consoleLogger.error(`Statement: "${error.statement}"`);
                        consoleLogger.error(`Position: ${' '.repeat(error.position)}^ ${error.message}`);
                    });
                }
                allOutputs.push({
                    file,
                    isValid: result.isValid,
                    statements: expressions,
                    errors: result.errors
                });
                
                if (exitOnError && !result.isValid) {
                    console.log(JSON.stringify(allOutputs));
                    process.exit(1);
                }
            }
        }

        if (allOutputs.length === 0) {
            const output = { error: 'No policy statements found' };
            console.log(JSON.stringify(output));
            process.exit(1);
        }

        console.log(JSON.stringify(allOutputs));
        consoleLogger.info('Policy validation completed');
        
        if (allOutputs.some(output => !output.isValid)) {
            process.exit(1);
        }
    });

program.parse();
