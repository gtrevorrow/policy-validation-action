import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { expect } from '@jest/globals';

const execAsync = promisify(exec);

// Path to our bin file
const binPath = path.resolve('./dist/index.js');

// Helper to debug output in CI environments
const debugOutput = (error: any) => {
    console.log('Debug CLI Output:');
    console.log('STDOUT:', error.stdout);
    console.log('STDERR:', error.stderr);
};

// Function to properly handle exec output
function execWithStringOutput(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      // Always resolve with output, even if command fails
      resolve({ stdout: stdout.toString(), stderr: stderr.toString() });
    });
  });
}

describe('CLI Tests', () => {
    const getJsonFromOutput = (output: string): any => {
        const lines = output.split('\n').filter(line => line.trim());
        for (const line of lines) {
            try {
                if (line.startsWith('{') || line.startsWith('[')) {
                    return JSON.parse(line);
                }
            } catch (e) {
                // Continue to next line if this one isn't valid JSON
                continue;
            }
        }
        throw new Error('No valid JSON found in output:\n' + output);
    };

    test('invalid.tf policy validation outputs JSON with isValid=false', async () => {
        const { stdout, stderr } = await execWithStringOutput(
          `node ${binPath} validate src/__tests__/fixtures/invalid.tf`
        );
        debugOutput({ stdout, stderr });

        const output = getJsonFromOutput(stdout);
        const results = JSON.parse(output.results);

        expect(Array.isArray(results)).toBe(true);

        // Local syntax validator runs first; it should report passed=false
        const syntaxReport = results[0].results.find((r: any) =>
          r.validatorName.includes('Syntax')
        );
        expect(syntaxReport).toBeDefined();
        expect(syntaxReport!.reports[0].passed).toBe(false);
    }, 15000);

    test('error conditions output JSON with error field', async () => {
        const { stdout, stderr } = await execWithStringOutput(
          `node ${binPath} validate ./nonexistent.tf`
        );
        debugOutput({ stdout, stderr });

        const output = getJsonFromOutput(stdout);
        expect(output).toHaveProperty('error');
        const errMsg = Array.isArray(output) ? output[0].error : output.error;
        expect(typeof errMsg).toBe('string');
    }, 15000);

    test('using files option works correctly', async () => {
        const command = `node ${binPath} validate src/__tests__/fixtures --files valid.tf,invalid.tf`;
        const { stdout, stderr } = await execAsync(command).catch(e => e);
        debugOutput({ stdout, stderr });
        expect(stderr).toContain('Policy validation failed for one or more files/checks.');

        const outputObj = getJsonFromOutput(stdout);
        const results = JSON.parse(outputObj.results) as any[];
        
        expect(results.some((o: any) => o.file.endsWith('valid.tf'))).toBe(true);
        expect(results.some((o: any) => o.file.endsWith('invalid.tf'))).toBe(true);
    }, 15000);

    test('file-extension command-line flag should work correctly', async () => {
        // Create a temp directory with two files - one .tf and one .txt
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policy-test-extension-'));
        
        // Create test files
        const tfFile = path.join(tempDir, 'policy1.tf');
        const txtFile = path.join(tempDir, 'policy2.txt');
        
        fs.writeFileSync(tfFile, `resource "oci_identity_policy" "policy1" {
            statements = ["Allow group Administrators to manage all-resources in tenancy"]
        }`);
        
        fs.writeFileSync(txtFile, `resource "oci_identity_policy" "policy2" {
            statements = ["Allow group Administrators to manage all-resources in tenancy"]
        }`);
        
        try {
            // Test with all files (no extension filter)
            const { stdout: stdoutDefault, stderr: stderrDefault } = await execWithStringOutput(
                `node ${binPath} validate ${tempDir} --verbose`
            );
            
            debugOutput({
                stdout: stdoutDefault,
                stderr: stderrDefault
            });
            
            const outputDefault = getJsonFromOutput(stdoutDefault);
            const resultDefault = JSON.parse(outputDefault.results);
            expect(resultDefault.length).toBe(2); // Should find both files
            
            // Test with file-extension filter for .tf files
            const { stdout, stderr } = await execWithStringOutput(
                `node ${binPath} validate ${tempDir} --file-extension .tf --verbose`
            );
            
            debugOutput({ stdout, stderr });
            
            const output = getJsonFromOutput(stdout);
            const result = JSON.parse(output.results);
            expect(result.length).toBe(1); // Should only find .tf file
            expect(result[0].file.endsWith('.tf')).toBe(true);
            
        } finally {
            // Clean up temporary directory
            fs.unlinkSync(tfFile);
            fs.unlinkSync(txtFile);
            fs.rmdirSync(tempDir);
        }
    }, 15000);

    test('should return empty results when no files match criteria', async () => {
        // Create a temp directory with no matching files
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policy-test-empty-'));
        
        // Create a non-matching file
        const txtFile = path.join(tempDir, 'readme.txt');
        fs.writeFileSync(txtFile, 'This is not a policy file');
        
        try {
            // Run CLI with .tf extension filter - should find no files and return empty pipeline results
            const { stdout, stderr } = await execWithStringOutput(
                `node ${binPath} validate ${tempDir} --file-extension .tf --verbose`
            );
            
            debugOutput({ stdout, stderr });
            
            // Should get warning about no files found
            expect(stderr).toContain('No files matching criteria found');
            
            const output = getJsonFromOutput(stdout);
            const results = JSON.parse(output.results);
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(0); // Should be empty array - no validation pipeline runs
            
        } finally {
            // Clean up
            fs.unlinkSync(txtFile);
            fs.rmdirSync(tempDir);
        }
    }, 15000);
});
