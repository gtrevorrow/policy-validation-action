#!/usr/bin/env node
import { program } from 'commander';
import { runAction } from './Main';
import { PlatformOperations } from './types';
import { CliOperations } from './platform/CliOperations';

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
  .option('--file-extension <ext>', 'Filter files by specified extension (e.g., .tf)')
  .option('--cis-benchmark', 'Run CIS Benchmark validation', false)
  .action(async (pathArg, cmdOptions) => {
    // Create a CLI-specific platform implementation that handles Commander options
    const cliPlatform: PlatformOperations = new class extends CliOperations {
      // Override getInput to first check command line options, then env vars
      getInput(name: string): string {
        // Map CLI option names to input names
        const optionMap: {[key: string]: string} = {
          'path': pathArg,
          'extractor': cmdOptions.extractor,
          'pattern': cmdOptions.pattern,
          'files': cmdOptions.files,
          'exit-on-error': cmdOptions.exitOnError,
          'file-extension': cmdOptions.fileExtension,
          'cis-benchmark': cmdOptions.cisBenchmark
        };
        
        // First check explicit command options
        if (name in optionMap && optionMap[name] !== undefined) {
          return String(optionMap[name]);
        }
        
        // Then check environment variables with POLICY_ prefix
        return process.env[`POLICY_${name.replace(/-/g, '_').toUpperCase()}`] || '';
      }
      
      // Override setResult to handle CLI exit codes
      setResult(success: boolean, message?: string): void {
        if (message) {
          if (success) {
            console.log(message);
          } else {
            console.error(message);
            // Only exit on error if specified by action
            if (this.getInput('exit-on-error') === 'true') {
              process.exit(1);
            }
          }
        }
      }
    };

    // Set verbose mode from option
    if (cmdOptions.verbose) {
      process.env.POLICY_VERBOSE = 'true';
    }

    // Run the action with our CLI platform implementation
    await runAction(cliPlatform);
  });

// Parse CLI arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length < 3) {
  program.help();
}
