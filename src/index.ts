#!/usr/bin/env node

// When imported as a dependency, provide the Main exports
export * from './Main';

// When executed as a CLI script, run the CLI
if (require.main === module) {
  // Determine execution environment
  if (process.env.GITHUB_ACTIONS === 'true') {
    // In GitHub Actions environment - execute the GitHub Action entry point
    require('./action');
  } else {
    // In CLI environment - execute the CLI entry point
    require('./cli');
  }
}