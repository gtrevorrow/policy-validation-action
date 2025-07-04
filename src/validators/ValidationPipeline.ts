import { Logger, ValidationOptions } from '../types';
import { PolicyValidator, ValidationReport } from './PolicyValidator';

export interface ValidationPipelineResult {
  validatorName: string;
  validatorDescription: string;
  reports: ValidationReport[];
}

/**
 * Pipeline for running multiple validators on policy statements
 */
export class ValidationPipeline {
  private validators: PolicyValidator[] = [];
  private logger?: Logger;
  
  constructor(logger?: Logger) {
    this.logger = logger;
  }
  
  /**
   * Add a validator to the pipeline
   */
  addValidator(validator: PolicyValidator): ValidationPipeline {
    this.validators.push(validator);
    return this;
  }
  
  /**
   * Check if the pipeline has any validators configured
   */
  hasValidators(): boolean {
    return this.validators.length > 0;
  }
  
  /**
   * Run all validators in the pipeline on the given statements
   */
  async validate(
    statements: string[],
    options?: ValidationOptions,
  ): Promise<ValidationPipelineResult[]> {
    this.logger?.info(
      `Running validation pipeline with ${this.validators.length} validators`,
    );

    // Return early if no statements to validate
    if (statements.length === 0) {
      return [];
    }

    const validationPromises = this.validators.map(async validator => {
      this.logger?.debug(`Running validator: ${validator.name()}`);
      try {
        const reports = await validator.validate(statements, options);
        const issuesFound = reports.reduce(
          (acc, report) => acc + report.issues.length,
          0,
        );
        const checksPassed = reports.filter(r => r.passed).length;
        this.logger?.info(
          `Validator ${validator.name()} completed: ${checksPassed}/${
            reports.length
          } checks passed, ${issuesFound} issues found`,
        );

        // Only return a result if the validator produced one or more reports.
        if (reports.length > 0) {
          return {
            validatorName: validator.name(),
            validatorDescription: validator.description(),
            reports: reports,
          };
        }
        return null; // Return null if there are no reports to filter out later.
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger?.error(`Error running validator ${validator.name()}: ${errorMessage}`);
        // In case of an error, we log it and return null so it doesn't appear in the final results.
        return null;
      }
    });

    const results = await Promise.all(validationPromises);
    // Filter out the null results (from erroring or empty-report validators).
    return results.filter(
      (result): result is ValidationPipelineResult => result !== null,
    );
  }
}
