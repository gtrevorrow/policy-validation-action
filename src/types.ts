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
}

/**
 * Get policy statements regex pattern from environment or use default
 * This allows different CI platforms to configure their own pattern if needed
 */
export const POLICY_STATEMENTS_REGEX = new RegExp(
    process.env.POLICY_STATEMENTS_PATTERN || 
    'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]',
    's'
);
