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

async function run(): Promise<void> {
    try {
        const workspacePath = process.env.GITHUB_WORKSPACE ||
                            process.env.CI_PROJECT_DIR ||
                            process.env.BITBUCKET_CLONE_DIR ||
                            process.cwd();
        
        const scanPath = path.resolve(workspacePath, options.path);
        cliLogger.debug(`Workspace path: ${workspacePath}`);
        cliLogger.debug(`Resolved scan path: ${scanPath}`);
        
        const tfFiles = await findTerraformFiles(scanPath, cliLogger);
        
        if (tfFiles.length === 0) {
            cliLogger.warn(`Warning: No .tf files found in ${scanPath}`);
            process.exit(0);
        }

        if (options.verbose) {
            cliLogger.info('Scanning files:');
            tfFiles.forEach(file => cliLogger.debug(`- ${file}`));
        }

        let allSegments: string[] = [];
        for (const file of tfFiles) {
            const segments = await processFile(file);
            if (options.verbose) {
                cliLogger.debug(`Processing ${file}:`);
                segments.forEach(s => cliLogger.debug(`  → ${s}`));
            }
            allSegments.push(...segments);
        }

        if (allSegments.length === 0) {
            cliLogger.warn('No policy statements found in the specified path');
            process.exit(0);
        }

        const policyText = formatPolicyStatements(allSegments);
        cliLogger.info('\nValidating policy statements...');
            
        if (!parsePolicy(policyText)) {
            cliLogger.error('✖ Policy validation failed');
            process.exit(1);
        }
            
        cliLogger.info('✔ Policy validation successful\n');
        cliLogger.info('Found and validated statements:');
        allSegments.forEach(segment => cliLogger.info(`✔ ${segment}`));
        process.exit(0);
    } catch (error) {
        cliLogger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

run();
