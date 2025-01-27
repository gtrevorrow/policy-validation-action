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

export enum ExpressionType {
    Allow = 'Allow',
    Define = 'Define',
    Endorse = 'Endorse',
    Admit = 'Admit'
}
