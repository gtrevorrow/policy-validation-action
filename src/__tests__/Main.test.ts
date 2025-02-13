import { findTerraformFiles, parsePolicy, processFile } from '../Main';
import { ExtractorType } from '../extractors/ExtractorFactory';
import * as path from 'path';

describe('Integration Tests', () => {
    // Change the fixtures path to correctly target the fixtures folder inside __tests__
    // Previously: const testDir = path.join(__dirname, '../fixtures');
    const testDir = path.join(__dirname, 'fixtures');
    const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };

    describe('findTerraformFiles', () => {
        it('should find all terraform files in the fixtures directory', async () => {
            const files = await findTerraformFiles(testDir, mockLogger);
            expect(files.length).toEqual(2);
            expect(files[0]).toMatch(/\.tf$/);
            expect(files[1]).toMatch(/\.tf$/);
        });
    });

    describe('processFile', () => {
        it('should process multiple terraform files in folder and extract policies using default regex pattern', async () => {
            const files = await findTerraformFiles(testDir, mockLogger);
            var expressions1 = await processFile(
                files[0],
                undefined,
                'regex' as ExtractorType,
                mockLogger
            );
            expect(expressions1).toHaveLength(2);

            var expressions2 = await processFile(
                files[1],
                undefined,
                'regex' as ExtractorType,
                mockLogger
            );
            expect(expressions2).toHaveLength(11);
            expect(expressions2).toEqual(expect.arrayContaining([
                expect.stringContaining('Allow group'),
                expect.stringContaining('Define tenancy'),
                expect.stringContaining('Endorse group'),
                expect.stringContaining('Admit group')
            ]));
        });

        it('should process terraform files and extract and parse policies from variable assignments using custom regex', async () => {
            const files = await findTerraformFiles(testDir, mockLogger);
            var expressions = await processFile(
                files[0],
                // Updated regex: use lazy quantifier to match policy statements until the closing quote
                "\\s*=\\s*\\[([\\s\\S]*?)\\]",
                'regex' as ExtractorType,
                mockLogger
            );
            console.log('Found expressions:', expressions); // Debugging
            expect(expressions).toBeDefined();
            expect(expressions).toHaveLength(4);

            var output = parsePolicy(expressions.join('\n') , mockLogger);
            expect(output.errors).toHaveLength(6);
            expect(output.isValid).toEqual(false);

            expressions = await processFile(
                files[1],
                // Updated regex: use lazy quantifier to match policy statements until the closing quote
                "\\s*=\\s*\\[([\\s\\S]*?)\\]",
                'regex' as ExtractorType,
                mockLogger
            );
            expect(expressions).toHaveLength(19);
            // Test for presence of statements from locals.polcies
            expect(expressions).toContain("Allow group Administrators_locals to manage all-resources in tenancy");
            expect(expressions).toContain("Allow group Developers_locals to use instances in compartment dev");
            expect(expressions).toContain("Define tenancy Acceptor_locals as ocid1.tenancy.oc1..aaaaaa");
            
            // Test for presence of statements from resource "oci_identity_policy" "test_policy"
            expect(expressions).toContain("Allow group Administrators to manage all-resources in tenancy");
            expect(expressions).toContain("Allow group Developers to use instances in compartment dev");
            expect(expressions).toContain("Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa");
            
            // Verify we're getting statements with variables too (these won't have the variables interpolated)
            expect(expressions).toContain("Allow group ${var.admin_group} to manage all-resources in tenancy");
            expect(expressions).toContain("Define tenancy ${var.tenant_name} as ${var.tenant_ocid}");

            output = parsePolicy(expressions.join('\n') , mockLogger);
            expect(output.errors).toHaveLength(0);
            expect(output.isValid).toEqual(true);
        });
    });
});

describe('Unit Tests', () => {
    it('should handle empty directory', async () => {
        const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };
        const files = await findTerraformFiles('nonexistent', mockLogger);
        expect(files).toEqual([]);
        expect(mockLogger.error).toHaveBeenCalled();
    });
});
