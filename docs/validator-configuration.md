# Validator Configuration Guide

This document explains how to configure and use the validators in the policy validation action.

## Overview

The policy validation action uses a pipeline-based approach to validation, where each policy file is processed through a series of validators. There are two types of validators:

1. **Local Validators**: These run on each file individually and validate syntax and other per-file constraints.
2. **Global Validators**: These run on all statements from all files together and perform cross-file validations. This pipeline can operate in a hybrid mode, using both rule-based validators (like CIS benchmark checks) and an AI-powered agentic validator for more complex scenarios.

## Configuration Options

### GitHub Action Configuration

You can control which validators run using the following inputs in your GitHub Action:

```yaml
- uses: gtrevorrow/policy-validation-action@v0.2
  with:
    path: './policies'
    validators-local: 'true'  # Enable/disable local validators (syntax validation)
    validators-global: 'true' # Enable/disable global validators (includes CIS benchmark)
```

### CLI Configuration

When using the CLI tool, you can configure validators using command-line arguments or environment variables:

```bash
# Using command-line arguments
policy-validation-action validate ./policies --validators-local=true --validators-global=true

# Using environment variables
export POLICY_VALIDATORS_LOCAL=true
export POLICY_VALIDATORS_GLOBAL=true
policy-validation-action validate ./policies
```

### Agentic Validation Configuration

To enable the AI-powered agentic validator, you need to provide additional configuration. This is supported in both the GitHub Action and the CLI.

**GitHub Action:**

```yaml
- uses: gtrevorrow/policy-validation-action@v0.2
  with:
    # ... other options
    agentic-validation-enabled: 'true'
    agentic-validation-provider: 'google' # or 'openai', 'anthropic', 'grok', etc.
    agentic-validation-model: 'Gemini 2.5 pro' # Specify the model to use
    agentic-validation-api-key: ${{ secrets.GOOGLE_API_KEY }}
```

**CLI / Environment Variables:**

```bash
# Using command-line arguments
policy-validation-action validate ./policies \
  --agentic-validation-enabled=true \
  --agentic-validation-provider=google \
  --agentic-validation-model="Gemini 2.5 pro" \
  --agentic-validation-api-key="sk-..."

# Using environment variables
export POLICY_AGENTIC_VALIDATION_ENABLED=true
export POLICY_AGENTIC_VALIDATION_PROVIDER=google
export POLICY_AGENTIC_VALIDATION_MODEL="Gemini 2.5 pro"
export POLICY_AGENTIC_VALIDATION_API_KEY="sk-..."
policy-validation-action validate ./policies
```

## Available Validators

### Local Validators

1. **OCI Syntax Validator**: Validates that policy statements follow the correct OCI IAM policy syntax.

### Global Validators

1. **OCI CIS Benchmark Validator**: Validates that policies conform to the CIS Benchmark recommendations for Oracle Cloud Infrastructure. This validator processes policies with fully-defined, static statements.
2. **Agentic OCI CIS Benchmark Validator**: Uses a Large Language Model (LLM) to perform a holistic compliance check. It specifically targets policies containing HCL variables (e.g., `${var.admin_group}`), which are difficult for traditional parsers to analyze definitively.

## Using the ValidatorFactory

If you're extending the action or writing custom validators, the `ValidatorFactory` class provides a convenient way to create and configure validators.

```typescript
import { ValidatorFactory } from './validators/ValidatorFactory';

// Create a local validation pipeline (includes syntax validator)
const localPipeline = ValidatorFactory.createLocalPipeline(logger, {});

// Create a global validation pipeline
// The factory will automatically include the agentic validator if configured
const globalPipeline = ValidatorFactory.createGlobalPipeline(logger, {
  agenticValidation: { enabled: true, provider: 'openai', apiKey: '...' }
});
```

## Adding New Validators

To add a new validator:

1. Create a new class that implements the `PolicyValidator` interface
2. Add a factory method to the `ValidatorFactory` class
3. Update the `createLocalValidators` or `createGlobalValidators` method to include your new validator

Example:

```typescript
// 1. Create new validator
class MyCustomValidator implements PolicyValidator {
  private logger?: Logger;
  
  constructor(logger?: Logger) {
    this.logger = logger;
  }
  
  name(): string {
    return "My Custom Validator";
  }
  
  description(): string {
    return "Validates policies against custom rules";
  }
  
  getChecks(): ValidationCheck[] {
    return [
      {
        id: "CUSTOM-1",
        name: "Custom Check 1",
        description: "Ensures policies meet custom rule 1"
      }
    ];
  }
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    // Implementation of validation logic
    this.logger?.debug(`Validating ${statements.length} statements with custom rules`);
    
    // Sample report creation
    const report: ValidationReport = {
      checkId: "CUSTOM-1",
      name: "Custom Check 1",
      description: "Ensures policies meet custom rule 1",
      passed: true,
      issues: []
    };
    
    // Return array of reports
    return [report];
  }
}

// 2. Add to ValidatorFactory
static createCustomValidator(logger?: Logger): PolicyValidator {
  return new MyCustomValidator(logger);
}

// 3. Include in validator creation
static createLocalValidators(logger?: Logger): PolicyValidator[] {
  return [
    ValidatorFactory.createSyntaxValidator(logger),
    ValidatorFactory.createCustomValidator(logger)
  ];
}
```

## Example: Implementing a RegexPolicyValidator

Here's a more concrete example of implementing a validator that uses regular expressions to check for policy statement patterns:

```typescript
class RegexPolicyValidator implements PolicyValidator {
  private logger?: Logger;
  private patterns: Map<string, RegExp>;
  
  constructor(logger?: Logger) {
    this.logger = logger;
    
    // Define regex patterns to check for various policy issues
    this.patterns = new Map<string, RegExp>([
      // Check for policies that might be too permissive
      ['REGEX-1', /allow\s+group\s+\S+\s+to\s+manage\s+all-resources/i],
      // Check for policies that might be missing compartment scopes
      ['REGEX-2', /allow\s+group\s+\S+\s+to\s+\S+\s+\S+(\s+where\s+|$)/i]
    ]);
  }
  
  name(): string {
    return "Regex Policy Validator";
  }
  
  description(): string {
    return "Validates policy statements using regular expressions";
  }
  
  getChecks(): ValidationCheck[] {
    return [
      {
        id: "REGEX-1",
        name: "Overly Permissive Policy Check",
        description: "Flags policies that might grant excessive permissions"
      },
      {
        id: "REGEX-2",
        name: "Missing Compartment Scope Check",
        description: "Flags policies that might be missing compartment scopes"
      }
    ];
  }
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    const reports: ValidationReport[] = [];
    
    // Create a report for each check
    for (const [checkId, pattern] of this.patterns.entries()) {
      const checkInfo = this.getChecks().find(check => check.id === checkId);
      if (!checkInfo) continue;
      
      const issues: ValidationIssue[] = [];
      
      // Check each statement against the pattern
      for (const statement of statements) {
        if (pattern.test(statement)) {
          issues.push({
            checkId: checkId,
            statement: statement,
            message: `Policy matches pattern: ${pattern}`,
            severity: 'warning'
          });
        }
      }
      
      reports.push({
        checkId: checkInfo.id,
        name: checkInfo.name,
        description: checkInfo.description,
        passed: issues.length === 0,
        issues: issues
      });
    }
    
    return reports;
  }
}
```

## Extending ValidatorFactory Configuration

The `ValidatorFactory` can be extended to support additional configuration options. Here's how you might enhance the factory to accept validator-specific configuration options:

```typescript
// 1. Extend the ValidatorConfig interface
export interface ValidatorConfig {
  runLocalValidators: boolean;
  runGlobalValidators: boolean;
  regexValidatorPatterns?: Map<string, RegExp>; // Custom patterns for RegexPolicyValidator
}

// 2. Update the factory methods to use the extended configuration
static createRegexValidator(config?: ValidatorConfig, logger?: Logger): PolicyValidator {
  return new RegexPolicyValidator(
    config?.regexValidatorPatterns,  // Pass custom patterns if provided
    logger
  );
}

// 3. Update creation methods to use the configuration
static createLocalValidators(logger?: Logger, options?: any): PolicyValidator[] {
  const validators: PolicyValidator[] = [];
  
  // Always add syntax validator for local validation
  validators.push(ValidatorFactory.createSyntaxValidator(logger));
  
  // Add additional validators based on options
  if (options?.regexValidatorPatterns) {
    validators.push(ValidatorFactory.createRegexValidator(options, logger));
  }
  
  return validators;
}

static createGlobalValidators(options?: any, logger?: Logger): PolicyValidator[] {
  const validators: PolicyValidator[] = [];
  
  // Always include CIS benchmark validator for global validation
  validators.push(ValidatorFactory.createCisBenchmarkValidator(logger));
  
  // Future global validators can be added here based on options
  
  return validators;
}
```

## Advanced Configuration

For more advanced configuration, you can:

1. **Add Command Line Options**: Extend the CLI to support custom validator options
2. **Use Environment Variables**: Define environment variables for configuring validators
3. **Create Configuration Files**: Support loading validator configuration from JSON/YAML files
4. **Implement Pluggable Validators**: Create a plugin system to load custom validators at runtime

Example of adding CLI options for a custom validator:

```typescript
program
  .command('validate [path]')
  .option('--custom-validator-rule <rule>', 'Custom validation rule (format: id:pattern)')
  .action((path, cmdOptions) => {
    const customRules = new Map();
    
    // Parse custom rules from command options
    if (cmdOptions.customValidatorRule) {
      const [id, pattern] = cmdOptions.customValidatorRule.split(':');
      customRules.set(id, new RegExp(pattern));
    }
    
    // Pass to validator config
    const validatorConfig = {
      runLocalValidators: true,
      runGlobalValidators: true,
      regexValidatorPatterns: customRules
    };
    
    // Run validation with custom config
    runValidation(path, validatorConfig);
  });
```

## Pipeline Behavior

- **Local Pipeline**: Runs when `validators-local` is `true` (default). Always includes the OCI Syntax Validator.
- **Global Pipeline**: Runs when `validators-global` is `true`.
- **Hybrid Global Pipeline**: When `agentic-validation-enabled` is `true`, the global pipeline operates in a hybrid mode:
    - The `OciCisBenchmarkValidator` runs on all policies *without* variables.
    - The `AgenticOciCisBenchmarkValidator` runs on all policies *with* variables.
    - This division of labor ensures that both static and dynamic policies are validated by the most appropriate engine.
- **Empty Pipelines**: If a pipeline has no validators configured, it won't run, ensuring optimal performance.

## Note on Regex Patterns

For users implementing custom regex patterns for policy validation, it's important to understand the difference between the default and advanced regex patterns:

- **Default Regex Patterns**: These are predefined patterns included with the `RegexPolicyValidator`. They cover common policy issues and are ready to use out of the box.
- **Advanced Regex Patterns**: These allow users to define custom patterns tailored to their specific policy requirements. This is useful for complex HCL files or unique organizational policies.

### Recommendation

For most users, the default regex patterns will be sufficient. However, for organizations with specific compliance requirements or complex policy structures, utilizing advanced regex patterns provides greater flexibility and control over policy validation.
