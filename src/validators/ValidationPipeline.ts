import { Logger } from '../types';
import { PolicyValidator, ValidationReport, ValidationOptions } from './PolicyValidator';

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
  async validate(statements: string[], options?: ValidationOptions): Promise<ValidationPipelineResult[]> {
    this.logger?.info(`Running validation pipeline with ${this.validators.length} validators`);
    
    // Return early if no statements to validate
    if (statements.length === 0) {
        return [];
    }
    
    const validationPromises = this.validators.map(async (validator): Promise<ValidationPipelineResult | null> => {
      try {
        this.logger?.debug(`Running validator: ${validator.name()}`);
        const reports = await validator.validate(statements, options);
        
        // Log summary of findings
        const failedChecks = reports.filter(report => !report.passed).length;
        const totalChecks = reports.length;
        const issuesCount = reports.reduce((sum, report) => sum + report.issues.length, 0);
        
        this.logger?.info(`Validator ${validator.name()} completed: ${totalChecks - failedChecks}/${totalChecks} checks passed, ${issuesCount} issues found`);

        return {
          validatorName: validator.name(),
          validatorDescription: validator.description(),
          reports
        };
      } catch (error) {
        this.logger?.error(`Error running validator ${validator.name()}: ${error instanceof Error ? error.message : error}`);
        return null;
      }
    });
    
    const results = await Promise.all(validationPromises);
    
    return results.filter((result): result is ValidationPipelineResult => result !== null);
  }
}
