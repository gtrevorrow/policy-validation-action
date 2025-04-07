import { PlatformConfig, PlatformOperations } from '../types';
import { GithubOperations } from './GithubOperations';
import { CliOperations } from './CliOperations';

/**
 * Factory to create platform-specific operations
 */
export class PlatformFactory {
  /**
   * Create a platform operations instance
   * @param config Platform configuration
   * @returns PlatformOperations instance
   */
  static create(config: PlatformConfig): PlatformOperations {
    switch (config.type) {
      case 'github':
        return new GithubOperations();
      case 'cli':
        return new CliOperations();
      default:
        throw new Error(`Unknown platform type: ${config.type}`);
    }
  }

  /**
   * Detect the platform type automatically
   * @returns The detected platform configuration
   */
  static detectPlatform(): PlatformConfig {
    // Check if running in GitHub Actions
    if (process.env.GITHUB_ACTIONS === 'true') {
      return { type: 'github' };
    }
    
    // Default to CLI
    return { type: 'cli' };
  }
}
