import { findTerraformFiles, processFile } from '../Main';
import * as fs from 'fs';
import * as path from 'path';

describe('Integration Tests', () => {
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

    describe('findTerraformFiles', () => {
        it('should find terraform files in directory', async () => {
            const files = await findTerraformFiles(testDir);
            expect(files.length).toBeGreaterThan(0);
            expect(files[0]).toMatch(/\.tf$/);
        });

        // ...other file finding tests...
    });

    describe('processFile', () => {
        it('should process terraform file and extract policies', async () => {
            const files = await findTerraformFiles(testDir);
            const expressions = await processFile(files[0]);
            expect(expressions).toHaveLength(1);
            expect(expressions[0]).toContain('Allow group');
        });

        // ...other file processing tests...
    });
});

describe('Unit Tests', () => {
    // Add unit tests that don't require file system
    it('should handle empty directory', async () => {
        const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };
        const files = await findTerraformFiles('nonexistent', mockLogger);
        expect(files).toEqual([]);
        expect(mockLogger.error).toHaveBeenCalled();
    });
});
