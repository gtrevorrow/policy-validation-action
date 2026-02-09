/**
 * Certain policies with valid syntax will result in OCI policy compilation failures. 
 * e.g group names of the following form will result in compilation errors:
 * 'domain/group' , OCI will interpret this to mean a litteral group named 'domain/group'
 *
 * This validator checks for such cases to prevent policy compilation failures.
 * 
 */

import { Logger, ValidationOptions } from "../types";
import { PolicyValidator, ValidationCheck, ValidationReport } from "./PolicyValidator";

export class PolicyCompilationValidator implements PolicyValidator {

    validate(statements: string[], options?: ValidationOptions): Promise<ValidationReport[]> {
        throw new Error("Method not implemented.");
    }
    private logger?: Logger;
    private static readonly CHECK_ID = 'OCI-POLICY-COMPILATION-1';

    private compilationChecks: ValidationCheck[] = [
        {
            id: PolicyCompilationValidator.CHECK_ID,
            name: 'OCI Policy Compilation Check',
            description: 'Ensures OCI IAM policy statements do not contain constructs that lead to compilation failures'
        }
    ];
    name(): string {
        throw new Error("Method not implemented.");
    }
    description(): string {
        throw new Error("Method not implemented.");
    }
    getChecks(): ValidationCheck[] {
        throw new Error("Method not implemented.");
    }
}
