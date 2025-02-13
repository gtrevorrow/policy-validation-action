import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

describe('CLI', () => {
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
        // We expect this to reject because invalid policies should exit with code 1
        await expect(execAsync('node ./dist/index.js --path ./src/__tests__/fixtures/invalid.tf'))
            .rejects
            .toMatchObject({
                code: 1,
                stdout: expect.any(String),
                stderr: expect.stringContaining('Failed to parse policy statement')
            });

        // Test the JSON output format from stdout
        const { stdout, stderr } = await execAsync('node ./dist/index.js --path ./src/__tests__/fixtures/invalid.tf')
            .catch(error => error);
        
        const output = getJsonFromOutput(stdout + '\n' + stderr);
        expect(Array.isArray(output)).toBe(true);
        expect(output[0].isValid).toBe(false);
        expect(output[0].errors.length).toBeGreaterThan(0);
    });

    test('error conditions output JSON with error field', async () => {
        await expect(execAsync('node ./dist/cli.js --path ./nonexistent.tf'))
            .rejects
            .toMatchObject({
                code: 1,
                stdout: expect.any(String)
            });

        const { stdout, stderr } = await execAsync('node ./dist/index.js --path ./nonexistent.tf')
            .catch(error => error);
            
        const output = getJsonFromOutput(stdout + '\n' + stderr);
        expect(output).toHaveProperty('error');
        expect(typeof output.error).toBe('string');
    });

    // Helper to debug output in CI environments
    const debugOutput = (error: any) => {
        console.log('Debug CLI Output:');
        console.log('STDOUT:', error.stdout);
        console.log('STDERR:', error.stderr);
    };
});
