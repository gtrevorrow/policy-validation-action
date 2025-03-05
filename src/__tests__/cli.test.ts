import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

// Helper to debug output in CI environments
const debugOutput = (error: any) => {
    console.log('Debug CLI Output:');
    console.log('STDOUT:', error.stdout);
    console.log('STDERR:', error.stderr);
};

describe('CLI', () => {
    // Make sure the CLI is built before testing
    beforeAll(async () => {
        try {
            // Just build the CLI, don't run the setup script
            await execAsync('npm run build');
        } catch (error) {
            console.error('Failed to build CLI:', error);
        }
    }, 30000); // Increase timeout to 30 seconds

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

    test('invalid policy outputs JSON with isValid=false', async () => {
        const { stdout, stderr } = await execAsync('node ./dist/index.js validate ./src/__tests__/fixtures/invalid.tf')
            .catch(error => error);
        
        debugOutput({ stdout, stderr });
        const output = getJsonFromOutput(stdout);
        expect(Array.isArray(output)).toBe(true);
        expect(output[0].isValid).toBe(false);
        expect(output[0].errors.length).toBeGreaterThan(0);
    }, 15000); // 15 second timeout

    test('error conditions output JSON with error field', async () => {
        const { stdout, stderr } = await execAsync('node ./dist/index.js validate ./nonexistent.tf')
            .catch(error => error);
        
        debugOutput({ stdout, stderr });
        const output = getJsonFromOutput(stdout);
        expect(output).toHaveProperty('error');
        // The property could be on the object directly or in the first element of an array
        const errorMessage = Array.isArray(output) ? output[0].error : output.error;
        expect(typeof errorMessage).toBe('string');
    }, 15000); // 15 second timeout

    test('using files option works correctly', async () => {
        const cmd = 'node ./dist/index.js validate ./src/__tests__/fixtures --files valid.tf --verbose';
        
        try {
            const { stdout, stderr } = await execAsync(cmd);
            debugOutput({ stdout, stderr });
            
            const output = getJsonFromOutput(stdout);
            
            // More lenient validation that doesn't assume a specific structure
            // Just verify it's valid JSON output with the correct file reference
            expect(Array.isArray(output)).toBe(true);
            
            // Check if any of the files contains valid.tf
            interface ValidationResult {
                file?: string;
                isValid?: boolean;
                errors?: any[];
                error?: string;
            }
            
            const matchingFile = output.find((item: ValidationResult) => 
                item.file && item.file.includes('valid.tf')
            );
            
            expect(matchingFile).toBeDefined();
            // When matching file is found, it should have isValid property
            expect(matchingFile.isValid !== undefined).toBe(true);
            
            // Only check the policy is valid if we found a matching file
            if (matchingFile) {
                expect(matchingFile.isValid).toBe(true);
            }
        } catch (error) {
            debugOutput(error);
            throw error;
        }
    }, 15000); // 15 second timeout
});
