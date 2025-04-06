import { Logger } from '../types';

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

export interface ValidationReport {
  checkId: string;
  name: string;
  description: string;
  passed: boolean;
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
   * @returns A list of validation reports
   */
  validate(statements: string[]): Promise<ValidationReport[]>;
}
