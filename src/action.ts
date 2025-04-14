import { runAction } from './Main';
import { PlatformFactory } from './platform';

async function run(): Promise<void> {
  // Create GitHub Action platform
  const platform = PlatformFactory.create({ type: 'github' });
  
  // Run the centralized action with GitHub platform
  await runAction(platform);
}

// Execute the action
run();
