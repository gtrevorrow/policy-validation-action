import { AntlrHclPolicyExtractor } from '../extractors/AntlrHclPolicyExtractor';

describe('AntlrHclPolicyExtractor', () => {
    let extractor: AntlrHclPolicyExtractor;

    beforeEach(() => {
        extractor = new AntlrHclPolicyExtractor();
    });

    it('should extract simple policy statements', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = [
                    "Allow group Admins to manage all-resources in tenancy",
                    "Allow group Users to read all-resources in tenancy"
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(2);
        expect(result).toContain("Allow group Admins to manage all-resources in tenancy");
        expect(result).toContain("Allow group Users to read all-resources in tenancy");
    });

    it('should handle single statement (not in array)', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = "Allow group Admins to manage all-resources in tenancy"
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(1);
        expect(result).toContain("Allow group Admins to manage all-resources in tenancy");
    });

    it('should handle interpolation', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = [
                    "Allow group \${var.admin_group} to manage all-resources in tenancy"
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(1);
        expect(result).toContain("Allow group \${var.admin_group} to manage all-resources in tenancy");
    });

    it('should handle heredocs (EOF)', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = [
                    <<-EOF
                        Allow group Admins to manage all-resources in tenancy
                    EOF
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(1);
        expect(result[0]).toContain("Allow group Admins to manage all-resources in tenancy");
    });

    it('should handle heredocs (EOT)', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = [
                    <<-EOT
                        Allow group Users to read instances in compartment \${var.comp}
                    EOT
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(1);
        expect(result[0]).toContain("Allow group Users to read instances in compartment \${var.comp}");
    });

    it('should extract statements outside policy resources', () => {
        const input = `
            resource "oci_core_instance" "test" {
                statements = ["this should be kept too"]
            }
            locals {
                statements = ["local statement"]
            }
            output "example" {
                value = {
                    statements = ["output statement"]
                }
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(3);
        expect(result).toContain("this should be kept too");
        expect(result).toContain("local statement");
        expect(result).toContain("output statement");
    });

    it('should handle multiple policy resources', () => {
        const input = `
            resource "oci_identity_policy" "p1" {
                statements = ["s1"]
            }
            resource "oci_identity_policy" "p2" {
                statements = ["s2"]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(2);
        expect(result).toContain("s1");
        expect(result).toContain("s2");
    });

    it('should handle heredocs with custom delimiter', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                statements = [
                    <<-POLICY
                        Allow group Admins to manage all-resources in tenancy
                    POLICY
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(1);
        expect(result[0]).toContain("Allow group Admins to manage all-resources in tenancy");
    });

    it('should handle HCL comments', () => {
        const input = `
            resource "oci_identity_policy" "test" {
                # This is a comment
                statements = [
                    "s1", // Inline comment
                    "s2"
                    /* Block 
                       comment */
                ]
            }
        `;
        const result = extractor.extract(input);
        expect(result).toHaveLength(2);
        expect(result).toContain("s1");
        expect(result).toContain("s2");
    });

    it('should return empty array for invalid HCL', () => {
        const input = `invalid { hcl`;
        const result = extractor.extract(input);
        expect(result).toEqual([]);
    });
});
