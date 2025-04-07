import { Logger, PlatformOperations } from '../types';

/**
 * CLI implementation of PlatformOperations
 */
export class CliOperations implements PlatformOperations {
  getInput(name: string, required: boolean = false): string {
    // For CLI, get inputs from environment variables with POLICY_ prefix
    const envName = `POLICY_${name.replace(/-/g, '_').toUpperCase()}`;
    const value = process.env[envName] || '';
    
    if (required && !value) {
      throw new Error(`Required input missing: ${name}`);
    }
    
    return value;
  }

  setOutput(name: string, value: string): void {
    // For CLI, simply log the output as JSON
    console.log(JSON.stringify({ [name]: value }));
  }

  setResult(success: boolean, message?: string): void {
    if (!success) {
      if (message) {
        console.error(message);
      }
      
      // Check if we should exit on error
      if (this.getInput('exit-on-error') === 'true') {
        process.exit(1);
      }
    } else if (message) {
      console.log(message);
    }
  }

  debug(message: string): void {
    if (process.env.POLICY_VERBOSE === 'true') {
      console.error(`DEBUG: ${message}`);
    }
  }

  info(message: string): void {
    if (process.env.POLICY_VERBOSE === 'true') {
      console.error(`INFO: ${message}`);
    }
  }

  warning(message: string): void {
    console.error(`WARNING: ${message}`);
  }

  error(message: string): void {
    console.error(`ERROR: ${message}`);
  }

  createLogger(): Logger {
    return {
      debug: (msg: string) => this.debug(msg),
      info: (msg: string) => this.info(msg),
      warn: (msg: string) => this.warning(msg),
      error: (msg: string) => this.error(msg)
    };
  }
}
