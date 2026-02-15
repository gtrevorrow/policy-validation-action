import { PolicyValidator, ValidationReport, ValidationIssue } from '../../../validators/PolicyValidator';
import { Logger } from '../../../types';

export default class CustomTestValidator implements PolicyValidator {
    private logger?: Logger;

    constructor(logger?: Logger) {
        this.logger = logger;
    }

    name(): string {
        return 'CustomTestValidator';
    }

    description(): string {
        return 'A custom validator for testing dynamic loading';
    }

    getChecks() {
        return [{
            id: 'CUSTOM-1',
            name: 'Custom Check',
            description: 'Always passes'
        }];
    }

    async validate(statements: string[]): Promise<ValidationReport[]> {
        this.logger?.info('CustomTestValidator running');
        return [{
            checkId: 'CUSTOM-1',
            name: this.name(),
            description: this.description(),
            passed: true,
            status: 'pass',
            issues: []
        }];
    }
}
