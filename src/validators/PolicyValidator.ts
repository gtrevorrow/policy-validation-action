import { Logger, ValidationOptions } from '../types';

export interface ValidationCheck {
  id: string;
  name: string;
  description: string;
}

export interface ValidationIssue {
  checkId: string;
  statement: string;
  message: string;
  recommendation?: string;
  severity: 'info' | 'warning' | 'error';
}

export interface GlobalValidatorOptions {
  // This can be expanded with specific options for global validators
  [key: string]: any;
}

export type ValidationStatus = 'pass' | 'pass-with-warnings' | 'fail';

export interface ValidationReport {
  checkId: string;
  name: string;
  description: string;
  passed: boolean; // Computed based on status and options
  status: ValidationStatus;
  issues: ValidationIssue[];
}

/**
 * Interface for all policy validators
 */
export interface PolicyValidator {
  /**
   * Returns the name of this validator
   */
  name(): string;
  
  /**
   * Returns the description of this validator
   */
  description(): string;
  
  /**
   * Returns all validation checks this validator can perform
   */
  getChecks(): ValidationCheck[];
  
  /**
   * Validates a list of policy statements
   * @param statements The policy statements to validate
   * @param options Validation options to control behavior
   * @returns A list of validation reports
   */
  validate(statements: string[], options?: ValidationOptions): Promise<ValidationReport[]>;
}

/**
 * Calculates the validation status based on the issues found
 */
export function calculateValidationStatus(issues: ValidationIssue[]): ValidationStatus {
  const hasErrors = issues.some(issue => issue.severity === 'error');
  const hasWarnings = issues.some(issue => issue.severity === 'warning');
  
  if (hasErrors) return 'fail';
  if (hasWarnings) return 'pass-with-warnings';
  return 'pass';
}

/**
 * Determines if validation should pass based on status and options
 */
export function shouldPass(status: ValidationStatus, treatWarningsAsFailures: boolean): boolean {
  if (status === 'fail') return false;
  if (status === 'pass-with-warnings' && treatWarningsAsFailures) return false;
  return true;
}
