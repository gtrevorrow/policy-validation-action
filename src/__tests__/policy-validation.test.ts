import { parsePolicy, extractPolicyExpressions } from '../Main';
import { POLICY_STATEMENTS_REGEX } from '../types';

describe('Policy Validation', () => {
    describe('extractPolicyExpressions', () => {
        it('should extract valid policy statements', () => {
            const input = `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Allow group Administrators to manage all-resources in tenancy",
                        "Allow group Developers to use instances in compartment dev"
                    ]
                }
            `;
            const result = extractPolicyExpressions(input);
            expect(result).toHaveLength(2);
            expect(result[0]).toContain('Allow group Administrators');
            expect(result[1]).toContain('Allow group Developers');
        });

        it('should handle variable interpolation', () => {
            const input = `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Allow group \${var.admin_group} to manage all-resources in tenancy"
                    ]
                }
            `;
            const result = extractPolicyExpressions(input);
            expect(result).toHaveLength(1);
            expect(result[0]).toContain('${var.admin_group}');
        });

        it('should extract all expression types', () => {
            const input = `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Define tenancy Acceptor as ocid1.tenancy.oc1..test",
                        "Endorse group Admins to manage drg-attachment in tenancy",
                        "Admit group ServiceAdmins of tenancy123 to manage instances in tenancy",
                        "Allow group Developers to use instances in compartment dev"
                    ]
                }
            `;
            const result = extractPolicyExpressions(input);
            expect(result).toHaveLength(4);
            expect(result).toEqual(expect.arrayContaining([
                expect.stringMatching(/^Define/),
                expect.stringMatching(/^Endorse/),
                expect.stringMatching(/^Admit/),
                expect.stringMatching(/^Allow/)
            ]));
        });
    });

    describe('parsePolicy', () => {
        it('should validate correct policy statements', () => {
            const input = `
                Allow group Administrators to manage all-resources in tenancy
                Allow group Developers to use instances in compartment dev
            `;
            expect(parsePolicy(input)).toBe(true);
        });

        it('should reject invalid policy statements', () => {
            const input = 'Allow BadSyntax manage';
            expect(parsePolicy(input)).toBe(false);
        });
    });
});
