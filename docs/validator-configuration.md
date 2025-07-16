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
- uses: gtrevorrow/policy-validation-action@v1
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
- uses: gtrevorrow/policy-validation-action@v1
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


