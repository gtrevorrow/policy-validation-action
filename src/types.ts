export interface Logger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

export interface ValidationResult {
    success: boolean;
    segments: string[];
    errors: string[];
}
