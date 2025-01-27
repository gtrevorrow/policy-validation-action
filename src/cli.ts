#!/usr/bin/env node
import * as path from 'path';
import { program } from 'commander';
import { findTerraformFiles, processFile, parsePolicy, formatPolicyStatements } from './Main';
import chalk from 'chalk';
import { Logger } from './types';

const cliLogger: Logger = {
    debug: (msg) => options.verbose && console.log(chalk.dim(msg)),
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(chalk.yellow(msg)),
    error: (msg) => console.error(chalk.red(msg))
};

program
    .name('policy-validator')
    .description('Validates OCI policy statements in Terraform files')
    .option('-p, --path <path>', 'Path to policy file or directory', '.')
    .option('-v, --verbose', 'Enable verbose output')
    .parse(process.argv);

const options = program.opts();

async function main() {
    const path = process.argv[2] || '.';
    
    try {
        const files = await findTerraformFiles(path);
        if (files.length === 0) {
            console.warn('No .tf files found');
            return;
        }

        let allSegments: string[] = [];
        for (const file of files) {
            const segments = await processFile(file);
            allSegments.push(...segments);
        }

        if (allSegments.length > 0) {
            const policyText = formatPolicyStatements(allSegments);
            console.log('Validating policy statements...');
            
            if (!parsePolicy(policyText)) {
                process.exit(1);
            }
            
            console.log('Policy validation successful');
            console.log('Found and validated allow segments:');
            allSegments.forEach(segment => console.log(segment));
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

main();
