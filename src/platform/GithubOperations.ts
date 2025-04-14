import * as core from '@actions/core';
import { Logger, PlatformOperations } from '../types';

/**
 * GitHub Actions implementation of PlatformOperations
 */
export class GithubOperations implements PlatformOperations {
  getInput(name: string, required: boolean = false): string {
    return core.getInput(name, { required });
  }

  setOutput(name: string, value: string): void {
    core.setOutput(name, value);
  }

  setResult(success: boolean, message?: string): void {
    if (success) {
      if (message) {
        core.info(message);
      }
    } else {
      if (message) {
        core.setFailed(message);
      } else {
        core.setFailed('Action failed');
      }
    }
  }

  debug(message: string): void {
    core.debug(message);
  }

  info(message: string): void {
    core.info(message);
  }

  warning(message: string): void {
    core.warning(message);
  }

  error(message: string): void {
    core.error(message);
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
