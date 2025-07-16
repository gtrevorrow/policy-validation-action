import { ValidationOptions } from '../types';

export { ValidationOptions };

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
 * Interface for validators that can filter statements based on their characteristics
 * This is useful for specialized validators that only handle certain types of statements
 */
export interface StatementFilteringValidator extends PolicyValidator {
  /**
   * Determines if this validator can handle the given statement
   * @param statement The policy statement to check
   * @returns true if this validator should process the statement
   */
  canHandle(statement: string): boolean;
}

/**
 * Detects if a statement contains HCL variables (${...})
 */
export function hasHclVariables(statement: string): boolean {
  return /\$\{[^}]+\}/.test(statement);
}

/**
 * Filters statements that contain HCL variables
 */
export function getStatementsWithVariables(statements: string[]): string[] {
  return statements.filter(hasHclVariables);
}

/**
 * Filters statements that do NOT contain HCL variables
 */
export function getStatementsWithoutVariables(statements: string[]): string[] {
  return statements.filter(statement => !hasHclVariables(statement));
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

/**
 * Determines if validation should pass based on status, global options, and validator-specific config
 */
export function shouldPassWithValidatorConfig(
  issues: ValidationIssue[], 
  validatorName: string,
  options: ValidationOptions = {}
): { passed: boolean; status: ValidationStatus; issues: ValidationIssue[] } {
  // Apply validator-specific warning level overrides first
  const updatedIssues = applyValidatorWarningConfig(issues, validatorName, options);
  
  // Calculate status based on potentially updated issues
  const status = calculateValidationStatus(updatedIssues);
  
  // Determine if it should pass based on treatWarningsAsFailures config
  const validatorConfig = options.validatorWarningConfig?.[validatorName];
  const treatWarningsAsFailures = validatorConfig?.treatWarningsAsFailures ?? options.treatWarningsAsFailures ?? false;
  const passed = shouldPass(status, treatWarningsAsFailures);

  return { passed, status, issues: updatedIssues };
}

/**
 * Applies validator-specific warning level overrides to issues
 */
export function applyValidatorWarningConfig(
  issues: ValidationIssue[],
  validatorName: string,
  options: ValidationOptions = {}
): ValidationIssue[] {
  const validatorConfig = options.validatorWarningConfig?.[validatorName];
  if (!validatorConfig?.warningLevel) {
    return issues;
  }
  
  return issues.map(issue => ({
    ...issue,
    severity: issue.severity === 'warning' ? validatorConfig.warningLevel! : issue.severity
  }));
}
