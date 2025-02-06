import { parsePolicy, extractPolicyExpressions, findTerraformFiles, processFile } from '../Main';
import * as fs from 'fs';
import * as path from 'path';

describe('Policy Validation Tests', () => {
    describe('parsePolicy', () => {
        it('should validate correct policy statements', () => {
            const validPolicies = [
                'Allow group Administrators to manage all-resources in tenancy',
                'Allow group Developers to use instances in compartment dev',
                'Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa',
                'Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo',
                'Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy'
            ].join('\n');

            const result = parsePolicy(validPolicies);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect invalid policy statements', () => {
            const invalidPolicies = [
                'Allow BadSyntax manage',
                'Allow groupDevelopers to use instances in compartment dev',
                'Admit group of tenancy 123 to manage instances in foo'
            ].join('\n');

            const result = parsePolicy(invalidPolicies);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toHaveProperty('statement');
            expect(result.errors[0]).toHaveProperty('position');
            expect(result.errors[0]).toHaveProperty('message');
        });

        it('should handle variable interpolation', () => {
            const policiesWithVars = [
                'Allow group ${var.admin_group} to manage all-resources in tenancy',
                'Define tenancy ${var.tenant_name} as ${var.tenant_ocid}',
                'Allow any-user to use instances in compartment ${var.public_compartment} where request.time BETWEEN ${var.start_time} AND ${var.end_time}'
            ].join('\n');

            const result = parsePolicy(policiesWithVars);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('extractPolicyExpressions', () => {
        it('should extract policy statements from terraform content', () => {
            const tfContent = `
                resource "oci_identity_policy" "test_policy" {
                    statements = [
                        "Allow group Administrators to manage all-resources in tenancy",
                        "Allow group Developers to use instances in compartment dev"
                    ]
                }
            `;
            const expressions = extractPolicyExpressions(tfContent);
            expect(expressions).toHaveLength(2);
            expect(expressions[0]).toContain('Allow group Administrators');
        });

        it('should handle empty or invalid content', () => {
            expect(extractPolicyExpressions('')).toHaveLength(0);
            expect(extractPolicyExpressions('no statements here')).toHaveLength(0);
        });
    });

    describe('findTerraformFiles and processFile', () => {
        const testDir = path.join(__dirname, 'test-files');
        
        beforeAll(() => {
            // Create test directory and files
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }

            // Create a valid tf file
            fs.writeFileSync(
                path.join(testDir, 'valid.tf'),
                `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Allow group Admins to manage all-resources in tenancy"
                    ]
                }
                `
            );
        });

        afterAll(() => {
            // Cleanup test directory
            if (fs.existsSync(testDir)) {
                fs.rmSync(testDir, { recursive: true });
            }
        });

        it('should find and process terraform files', async () => {
            const files = await findTerraformFiles(testDir);
            expect(files.length).toBeGreaterThan(0);

            const expressions = await processFile(files[0]);
            expect(expressions).toHaveLength(1);
            expect(expressions[0]).toContain('Allow group Admins');
        });
    });
});
