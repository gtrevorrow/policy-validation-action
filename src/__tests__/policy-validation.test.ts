import { validatePolicySyntax } from '../Main';
import { ExtractorFactory } from '../extractors/ExtractorFactory';

describe('OCI Policy Validation', () => {
   

    describe('Policy Extraction', () => {
        
        it('should extract valid policy statements with all types from OCI terraform provider oci_identity_policy resource', () => {
            const extractor = ExtractorFactory.create('regex');
            const input = `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Allow group Administrators to manage all-resources in tenancy",
                        "Allow group Developers to use instances in compartment dev",
                        "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
                        "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
                        "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy",
                        "Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups contains 'SecurityAdmins'"
                    ]
                }
            `;
            const result = extractor.extract(input);
            expect(result).toHaveLength(6);
            expect(result).toEqual(expect.arrayContaining([
                expect.stringMatching(/^Allow group Administrators/),
                expect.stringMatching(/^Allow group Developers/),
                expect.stringMatching(/^Define tenancy/),
                expect.stringMatching(/^Endorse group/),
                expect.stringMatching(/^Admit group/),
                expect.stringMatching(/request\.user\.groups/)
            ]));
        });

        it('should handle variable interpolation and conditions', () => {
            const extractor = ExtractorFactory.create('regex');
            const input = `
                resource "oci_identity_policy" "test" {
                    statements = [
                        "Allow group \${var.admin_group} to manage all-resources in tenancy",
                        "Define tenancy \${var.tenant_name} as \${var.tenant_ocid}",
                        "Endorse group \${var.network_admins} to manage virtual-network-family in tenancy foo",
                        "Admit group \${var.dev_group} of tenancy accountFoo to use instances in compartment \${var.env}",
                        "Allow any-user to use instances in compartment \${var.public_compartment} where request.time BETWEEN \${var.start_time} AND \${var.end_time}"
                    ]
                }
            `;
            const result = extractor.extract(input);
            expect(result).toHaveLength(5);
            expect(result).toEqual(expect.arrayContaining([
                expect.stringMatching(/\${var\.admin_group}/),
                expect.stringMatching(/\${var\.tenant_name}/),
                expect.stringMatching(/\${var\.network_admins}/),
                expect.stringMatching(/\${var\.dev_group}/),
                expect.stringMatching(/BETWEEN.*AND/)
            ]));
        });
  
    });

    describe('Validation', () => {
        it('should validate correct policy statements', async () => {
            const input = [
                'Allow group Administrators to manage all-resources in tenancy',
                'Allow group Developers to use instances in compartment dev'
            ];
            const result = await validatePolicySyntax(input);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject invalid policy statements', async () => {
            const input = [
                'Allow BadSyntax manage'
            ];
            const result = await validatePolicySyntax(input);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toHaveProperty('statement');
            expect(result.errors[0]).toHaveProperty('position');
            expect(result.errors[0]).toHaveProperty('message');
        });

        it('should validate tenancy subject with HCL variables', async () => {
            const input = [
                'Define tenancy ${var.tenant_name} as ocid1.tenancy.oc1..test',
                'Admit group Admins of tenancy ${var.acceptor_tenant} to manage instances in tenancy',
                'Allow group ${var.admin_group} to manage all-resources in tenancy',
                'Define tenancy ${var.tenant_name} as ${var.tenant_ocid}',
                'Endorse group ${var.network_admins} to manage virtual-network-family in tenancy foo',
                'Admit group ${var.dev_group} of tenancy accountFoo to use instances in compartment ${var.env}',
                'Admit group Admins of tenancy ${var.acceptor_tenant} to manage instances in tenancy',
                'Endorse group foo to manage virtual-network-family in tenancy ${var.acceptor_tenant}'
            ];
            const result = await validatePolicySyntax(input);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject policy statements without proper spacing', async () => {
            const invalidInputs = [
                'AllowBadSyntax manage',
                'Allow groupDevelopers to use instances in compartment dev',
                'Admitgroup ServiceAdmins of tenancy 123 to manage instances in tenancy',
                'DefinetenancyAcceptor as ocid1',
                'Endorsegroup NetworkAdmins to manage something in tenancy'
            ];
            
            const result = await validatePolicySyntax(invalidInputs);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toMatchObject({
                statement: expect.any(String),
                position: expect.any(Number),
                message: expect.any(String)
            });
        });
    });
});
