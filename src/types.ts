export interface Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

export interface ValidationResult {
    isValid: boolean;
    expressions: string[];
    errors?: string[];
}

export interface PolicyError {
    statement: string;
    position: number;
    message: string;
}

export interface ParseResult {
    isValid: boolean;
    errors: PolicyError[];
}

export enum ExpressionType {
    Allow = 'Allow',
    Define = 'Define',
    Endorse = 'Endorse',
    Admit = 'Admit'
}

export interface ValidationOutput {
    file: string;
    isValid: boolean;
    statements: string[];
    errors: any[];
    validationResults?: ValidationPipelineResult[];
}

export interface ValidationPipelineResult {
    validatorName: string;
    validatorDescription: string;
    reports: ValidationReport[];
}

export interface ValidationReport {
    checkId: string;
    name: string;
    description: string;
    passed: boolean;
    issues: ValidationIssue[];
}

export interface ValidationIssue {
    checkId: string;
    statement: string;
    message: string;
    recommendation?: string;
    severity: 'info' | 'warning' | 'error';
}

export interface ValidationOptions {
  extractorType: string;
  pattern?: string;
  fileExtension?: string;
  fileNames?: string[];
  exitOnError: boolean;
  runCisBenchmark: boolean;
}

/**
 * Platform abstraction interface for handling platform-specific operations
 */
export interface PlatformOperations {
  /**
   * Get an input value by name
   * @param name The name of the input
   * @param required Whether the input is required
   * @returns The input value
   */
  getInput(name: string, required?: boolean): string;
  
  /**
   * Set an output value
   * @param name The name of the output
   * @param value The value of the output
   */
  setOutput(name: string, value: string): void;
  
  /**
   * Set success or failed status
   * @param success Whether the operation was successful
   * @param message Optional message
   */
  setResult(success: boolean, message?: string): void;
  
  /**
   * Log debug information
   * @param message The debug message
   */
  debug(message: string): void;
  
  /**
   * Log info message
   * @param message The info message
   */
  info(message: string): void;
  
  /**
   * Log warning message
   * @param message The warning message
   */
  warning(message: string): void;
  
  /**
   * Log error message
   * @param message The error message
   */
  error(message: string): void;
  
  /**
   * Create a logger instance compatible with the Logger interface
   * @returns Logger instance
   */
  createLogger(): Logger;
}

/**
 * Configuration for platform operations
 */
export interface PlatformConfig {
  /**
   * The type of platform (github, cli)
   */
  type: 'github' | 'cli';
}

/**
 * Get policy statements regex pattern from environment or use default
 * This allows different CI platforms to configure their own pattern if needed
 */
export const POLICY_STATEMENTS_REGEX = new RegExp(
    process.env.POLICY_STATEMENTS_PATTERN || 
    'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]',
    'sg'
);
