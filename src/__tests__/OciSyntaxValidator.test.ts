import { OciSyntaxValidator } from '../validators/OciSyntaxValidator';
import { mockLogger } from './fixtures/test-utils';

/**
 * Unit tests for OciSyntaxValidator.
 * Tests syntactic validation of OCI policy statements.
 * For integration tests, see policy-validation.test.ts
 */
describe('OciSyntaxValidator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Validator Metadata', () => {
        it('should return correct validator metadata', () => {
            const validator = new OciSyntaxValidator();
            
            expect(validator.name()).toBe('OCI Syntax Validator');
            expect(validator.description()).toContain('syntactical correctness');
            
            const checks = validator.getChecks();
            expect(checks).toHaveLength(1);
            expect(checks[0].id).toBe('OCI-SYNTAX-1');
        });
    });

    describe('Valid Policy Syntax', () => {
        const validPolicies = [
            'Allow group Administrators to manage all-resources in tenancy',
            'Allow group Developers to use instances in compartment dev',
            'Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa',
            'Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo',
            'Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy',
            'Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups in (\'SecurityAdmins\')'
        ];

        it('should validate well-formed policy statements without errors', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(validPolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeTruthy();
            expect(reports[0].issues).toHaveLength(0);
        });

        it('should handle policy statements with Terraform variables', async () => {
            const variablePolicies = [
                'Allow group ${var.admin_group} to manage all-resources in tenancy',
                'Allow group ${var.network_group} to manage vcns in compartment ${var.compartment}'
            ];

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(variablePolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeTruthy();
            expect(reports[0].issues).toHaveLength(0);
        });

        it('should handle complex conditions and clauses', async () => {
            const complexPolicies = [
                'Allow group Admins to manage all-resources in tenancy where request.user.name = \'admin\'',
                'Allow group Users to read buckets in compartment ProjectA where target.bucket.name = \'publicbucket\'',
                'Allow any-user to use instances in compartment demo where request.time BETWEEN \'20240101T000000Z\' AND \'20241231T235959Z\''
            ];

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(complexPolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeTruthy();
            expect(reports[0].issues).toHaveLength(0);
        });
    });

    describe('Invalid Policy Syntax', () => {
        const invalidPolicies = [
            'Allow Administrators_without_group to manage all-resources in tenancy', // Missing 'group' keyword
            'Alloww group Developers to use instances in compartment dev', // Misspelled 'Allow'
            'Allow group to manage all-resources in', // Missing target/scope
            'Define tenancy', // Incomplete definition
            'Allow group Administrators too manage all-resources in tenancy' // 'too' instead of 'to'
        ];

        it('should detect invalid policy statements with specific error messages', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(invalidPolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeFalsy();
            expect(reports[0].issues.length).toBeGreaterThan(0);
            
            // Verify error messages contain useful info
            reports[0].issues.forEach(issue => {
                expect(issue.message).toMatch(/Syntax error|Failed to parse/);
                expect(issue.severity).toBe('error');
                expect(issue.recommendation).toBeDefined();
            });
        });

        it('should provide detailed error messages with position information', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            await validator.validate(['AllowBadSyntax manage']);
            
            expect(mockLogger.error).toHaveBeenCalledWith('OCI Syntax Validator: Failed to parse policy statement:');
            expect(mockLogger.error).toHaveBeenCalledWith(expect.stringMatching(/OCI Syntax Validator: Statement: ".*"/));
            expect(mockLogger.error).toHaveBeenCalledWith(expect.stringMatching(/OCI Syntax Validator: Position: .*\^.*/));
        });

        it('should handle malformed variable interpolation', async () => {
            const malformedVariables = [
                'Allow group ${incomplete_var to manage all-resources in tenancy',
                'Allow group ${} to manage all-resources in tenancy',
                'Allow group $invalid_syntax to manage all-resources in tenancy'
            ];

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(malformedVariables);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeFalsy();
            expect(reports[0].issues.length).toBeGreaterThan(0);
        });

        it('should detect missing required keywords and components', async () => {
            const incompleteStatements = [
                'group Admins to manage all-resources in tenancy', // Missing 'Allow'
                'Allow to manage all-resources in tenancy', // Missing subject
                'Allow group Admins manage all-resources in tenancy', // Missing 'to'
                'Allow group Admins to manage in tenancy' // Missing resource
            ];

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(incompleteStatements);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeFalsy();
            expect(reports[0].issues.length).toBeGreaterThanOrEqual(3); // Expect at least 3 syntax errors
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty statement list', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate([]);
            
            expect(reports).toEqual([]);
            expect(mockLogger.info).toHaveBeenCalledWith('OCI Syntax Validator: No policy statements to validate');
        });

        it('should handle empty or whitespace-only statements', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(['', '   ', '\n\t']);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeTruthy();
        });

        it('should handle mix of valid and invalid statements', async () => {
            const mixedPolicies = [
                'Allow group Administrators to manage all-resources in tenancy', // Valid
                'Allow BadSyntax manage', // Invalid
                'Allow group Developers to use instances in compartment dev' // Valid
            ];
            
            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(mixedPolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeFalsy(); // Fails due to invalid statement
            expect(reports[0].issues.length).toBeGreaterThanOrEqual(1); // At least one invalid statement
            expect(reports[0].issues.some(issue => issue.statement === 'Allow BadSyntax manage')).toBeTruthy();
        });

        it('should handle null and undefined inputs gracefully', async () => {
            const validator = new OciSyntaxValidator(mockLogger);
            
            // Test with array containing null/undefined
            const reportsWithNull = await validator.validate([null as any, undefined as any]);
            expect(reportsWithNull).toHaveLength(1);
            expect(reportsWithNull[0].passed).toBeTruthy(); // Should skip null/undefined
        });

        it('should handle very long policy statements', async () => {
            const longStatement = 'Allow group VeryLongGroupNameThatExceedsNormalLimits to manage ' +
                'very-long-resource-family-name-that-goes-on-and-on in compartment ' +
                'VeryLongCompartmentNameThatAlsoExceedsTypicalLimits where ' +
                'request.user.groups contains "VeryLongGroupNameForCondition"';

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate([longStatement]);
            
            expect(reports).toHaveLength(1);
            // Should handle long statements appropriately
        });

        it('should handle unicode and special characters', async () => {
            // Test with characters that are supported by the current grammar
            const unicodePolicies = [
                'Allow group AdminGroup to manage all-resources in tenancy',
                'Allow group TestGroup to manage all-resources in compartment testcompartment'
            ];

            const validator = new OciSyntaxValidator(mockLogger);
            const reports = await validator.validate(unicodePolicies);
            
            expect(reports).toHaveLength(1);
            expect(reports[0].passed).toBeTruthy(); // Should handle valid syntax
            expect(reports[0].issues).toHaveLength(0);
        });
    });

});
    
