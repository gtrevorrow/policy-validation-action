import { Logger } from '../types';
import { PolicyValidator } from './PolicyValidator';
import { OciSyntaxValidator } from './OciSyntaxValidator';
import { OciCisBenchmarkValidator } from './OciCisBenchmarkValidator';
import { ValidationPipeline } from './ValidationPipeline';

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
  static createSyntaxValidator(logger?: Logger): PolicyValidator {
    return new OciSyntaxValidator(logger);
  }

  /**
   * Creates a CIS benchmark validator instance
   * @param logger Optional logger for recording diagnostic info
   * @returns An instance of OciCisBenchmarkValidator
   */
  static createCisBenchmarkValidator(logger?: Logger): PolicyValidator {
    return new OciCisBenchmarkValidator(logger);
  }

  /**
   * Creates validators for local (per-file) validation pipeline
   * These validators are applied to each file individually
   * 
   * @param logger Optional logger for recording diagnostic info
   * @param options Optional configuration options for local validators
   * @returns Array of validator instances
   */
  static createLocalValidators(logger?: Logger, options?: Record<string, any>): PolicyValidator[] {
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
  static createGlobalValidators(options: any = {}, logger?: Logger): PolicyValidator[] {
    const validators: PolicyValidator[] = [];
    
    // Include CIS benchmark validator when global validators are enabled
    validators.push(ValidatorFactory.createCisBenchmarkValidator(logger));
    
    // Future global validators can be added here based on other options
    
    return validators;
  }
  
  /**
   * Creates a validation pipeline with configured validators
   * 
   * @param validatorType The type of validators to include ('local' or 'global')
   * @param options Configuration options for the validators
   * @param logger Optional logger for recording diagnostic info
   * @returns A configured ValidationPipeline instance
   */
  static createPipeline(
    validatorType: 'local' | 'global',
    options: any = {},
    logger?: Logger
  ): ValidationPipeline {
    const pipeline = new ValidationPipeline(logger);
    
    if (validatorType === 'local') {
      const validators = ValidatorFactory.createLocalValidators(logger, options);
      validators.forEach(validator => pipeline.addValidator(validator));
    } else if (validatorType === 'global') {
      const validators = ValidatorFactory.createGlobalValidators(options, logger);
      validators.forEach(validator => pipeline.addValidator(validator));
    } else {
      throw new Error(`Invalid pipeline type: ${validatorType}. Must be 'local' or 'global'.`);
    }
    
    return pipeline;
  }
}