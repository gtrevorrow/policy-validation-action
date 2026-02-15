import * as path from 'path';
import { PolicyValidator } from './PolicyValidator';
import { OciSyntaxValidator } from './OciSyntaxValidator';
import { OciCisBenchmarkValidator } from './OciCisBenchmarkValidator';
import { SemanticValidator } from './SemanticValidator';
import { ReferenceLookupValidator } from './ReferenceLookupValidator';
import { AgenticOciCisBenchmarkValidator } from './AgenticOciCisBenchmarkValidator';
import { Logger } from '../types';

/**
 * Registry of built-in validators
 */
const BUILT_IN_VALIDATORS: Record<string, any> = {
    'OciSyntaxValidator': OciSyntaxValidator,
    'OciCisBenchmarkValidator': OciCisBenchmarkValidator,
    'SemanticValidator': SemanticValidator,
    'ReferenceLookupValidator': ReferenceLookupValidator,
    'AgenticOciCisBenchmarkValidator': AgenticOciCisBenchmarkValidator
};

/**
 * Loader for policy validators.
 * Supports loading built-in validators by name and custom validators by file path.
 */
export class ValidatorLoader {
    private logger?: Logger;

    constructor(logger?: Logger) {
        this.logger = logger;
    }

    /**
     * Loads a validator by name or path.
     * 
     * @param identifier Name of built-in validator or path to custom validator module
     * @param args Arguments to pass to the validator constructor (usually logger, context, etc.)
     * @returns A promise resolving to an instance of PolicyValidator
     */
    async loadValidator(identifier: string, ...args: any[]): Promise<PolicyValidator | null> {
        // 1. Check built-ins
        if (BUILT_IN_VALIDATORS[identifier]) {
            this.logger?.debug(`Loading built-in validator: ${identifier}`);
            const ValidatorClass = BUILT_IN_VALIDATORS[identifier];
            return new ValidatorClass(...args);
        }

        // 2. Try loading from file path
        try {
            const modulePath = path.resolve(process.cwd(), identifier);
            this.logger?.debug(`Attempting to load custom validator from: ${modulePath}`);

            // Dynamic import
            const module = await import(modulePath);

            // Expect default export to be the class
            const ValidatorClass = module.default;

            if (!ValidatorClass || typeof ValidatorClass !== 'function') {
                this.logger?.error(`Failed to load validator from ${identifier}: Default export is not a class.`);
                return null;
            }

            const instance = new ValidatorClass(...args);

            // Basic duck-typing check
            if (typeof instance.validate !== 'function' || typeof instance.name !== 'function') {
                this.logger?.error(`Loaded module from ${identifier} does not look like a PolicyValidator.`);
                return null;
            }

            return instance;

        } catch (error: any) {
            this.logger?.error(`Failed to load validator '${identifier}': ${error.message}`);
            return null;
        }
    }
}
