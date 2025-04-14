import { Logger } from '../types';
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
   * Run all validators in the pipeline on the given statements
   */
  async validate(statements: string[]): Promise<ValidationPipelineResult[]> {
    this.logger?.info(`Running validation pipeline with ${this.validators.length} validators`);
    
    const results: ValidationPipelineResult[] = [];
    
    for (const validator of this.validators) {
      try {
        this.logger?.debug(`Running validator: ${validator.name()}`);
        const reports = await validator.validate(statements);
        
        results.push({
          validatorName: validator.name(),
          validatorDescription: validator.description(),
          reports
        });
        
        // Log summary of findings
        const failedChecks = reports.filter(report => !report.passed).length;
        const totalChecks = reports.length;
        const issuesCount = reports.reduce((sum, report) => sum + report.issues.length, 0);
        
        this.logger?.info(`Validator ${validator.name()} completed: ${totalChecks - failedChecks}/${totalChecks} checks passed, ${issuesCount} issues found`);
      } catch (error) {
        this.logger?.error(`Error running validator ${validator.name()}: ${error}`);
      }
    }
    
    return results;
  }
}
