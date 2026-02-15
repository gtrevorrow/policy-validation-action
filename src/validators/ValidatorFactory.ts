import { Logger, ValidationOptions } from '../types';
import { OciSyntaxValidator } from './OciSyntaxValidator';
import { OciCisBenchmarkValidator } from './OciCisBenchmarkValidator';
import { AgenticOciCisBenchmarkValidator } from './AgenticOciCisBenchmarkValidator';
import { ValidationPipeline } from './ValidationPipeline';
import { ValidatorLoader } from './ValidatorLoader';

/**
 * Factory for creating validator instances based on validation type
 * 
 * This factory centralizes the creation of validators, making it easier to:
 * 1. Configure validators consistently across the application
 * 2. Add new validators in the future
 * 3. Control validator initialization and dependencies
 */
export class ValidatorFactory {
  /**
   * Creates a syntax validator instance
   * @param logger Optional logger for recording diagnostic info
   * @returns An instance of OciSyntaxValidator
   */
  static createSyntaxValidator(logger?: Logger): OciSyntaxValidator {
    return new OciSyntaxValidator(logger);
  }

  /**
   * Creates a CIS benchmark validator instance
   * @param logger Optional logger for recording diagnostic info
   * @returns An instance of OciCisBenchmarkValidator
   */
  static createCisBenchmarkValidator(logger?: Logger): OciCisBenchmarkValidator {
    return new OciCisBenchmarkValidator(logger);
  }

  /**
   * Creates validators for local (per-file) validation pipeline
   * These validators are applied to each file individually
   * 
   * @param logger Optional logger for recording diagnostic info
   * @returns Array of validator instances
   */
  static createLocalValidators(logger?: Logger): (OciSyntaxValidator)[] {
    // Currently only includes syntax validator
    // In future, additional local validators can be added here
    return [
      ValidatorFactory.createSyntaxValidator(logger)
    ];
  }

  /**
   * Creates validators for global validation pipeline based on configuration
   * These validators are applied to all statements from all files together
   * 
   * @param logger Optional logger for recording diagnostic info
   * @param options Optional configuration options for global validators
   * @returns Array of validator instances
   */
  static createGlobalValidators(options: ValidationOptions = {}, logger?: Logger): (OciCisBenchmarkValidator)[] {
    const validators: OciCisBenchmarkValidator[] = [];

    // Include CIS benchmark validator when global validators are enabled
    validators.push(ValidatorFactory.createCisBenchmarkValidator(logger));

    // Future global validators can be added here based on other options

    return validators;
  }

  /**
   * Creates a local validation pipeline with configured validators
   * Local pipelines run on each file individually
   * 
   * @param logger Optional logger for recording diagnostic info
   * @param options Optional configuration options for local validators
   * @returns A configured ValidationPipeline instance with local validators
   */
  static async createLocalPipeline(
    logger?: Logger,
    options?: ValidationOptions
  ): Promise<ValidationPipeline> {
    const pipeline = new ValidationPipeline(logger);
    const loader = new ValidatorLoader(logger);

    // Default behavior: if runLocalValidators is true (or undefined/default), run syntax validator
    const runDefault = options?.validatorConfig?.runLocalValidators !== false;

    // Explicit list overrides default behavior? Or adds to it? 
    // Plan said: "List of ... overrides runLocalValidators if present"
    const explicitValidators = options?.validatorConfig?.localValidators;

    if (explicitValidators && explicitValidators.length > 0) {
      for (const validatorName of explicitValidators) {
        const validator = await loader.loadValidator(validatorName, logger);
        if (validator) {
          pipeline.addValidator(validator);
        }
      }
    } else if (runDefault) {
      pipeline.addValidator(new OciSyntaxValidator(logger));
    }

    return pipeline;
  }

  /**
   * Creates a global validation pipeline with configured validators  
   * Global pipelines run on all statements from all files together
   * 
   * @param logger Optional logger for recording diagnostic info
   * @param options Optional configuration options for global validators
   * @param context Optional validation context for semantic validation
   * @returns A configured ValidationPipeline instance with global validators
   */
  public static async createGlobalPipeline(
    logger: Logger,
    options: ValidationOptions,
    context?: import('./context/ValidationContext').ValidationContext
  ): Promise<ValidationPipeline> {
    const pipeline = new ValidationPipeline(logger);
    const loader = new ValidatorLoader(logger);

    const runDefault = options.validatorConfig?.runGlobalValidators === true;
    const explicitValidators = options.validatorConfig?.globalValidators;

    if (explicitValidators && explicitValidators.length > 0) {
      for (const validatorName of explicitValidators) {
        // Special case: Semantic validator needs context
        let validator;
        if (validatorName === 'SemanticValidator' && context) {
          const { SemanticValidator } = require('./SemanticValidator');
          validator = new SemanticValidator(context, logger);
        } else {
          validator = await loader.loadValidator(validatorName, logger);
        }

        if (validator) {
          pipeline.addValidator(validator);
        }
      }
    } else if (runDefault) {
      // Default Global Validators
      pipeline.addValidator(new OciCisBenchmarkValidator(logger));

      // Add semantic validator if context is provided
      if (context) {
        const { SemanticValidator } = require('./SemanticValidator');
        pipeline.addValidator(new SemanticValidator(context, logger));
      }

      // Add reference lookup validator if lookup data is provided
      if (options.referenceValidation?.groupLookup) {
        const { ReferenceLookupValidator } = require('./ReferenceLookupValidator');
        pipeline.addValidator(new ReferenceLookupValidator(logger));
      }

      // Add the agentic validator if enabled (it will self-filter to statements with variables)
      if (options.agenticValidation?.enabled) {
        logger.info(
          'Agentic validation is enabled. Adding agentic validator to the pipeline.',
        );
        pipeline.addValidator(new AgenticOciCisBenchmarkValidator(logger));
      }
    }

    return pipeline;
  }
}