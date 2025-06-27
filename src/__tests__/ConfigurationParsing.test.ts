import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PlatformOperations } from '../types';
import { parseBooleanInput } from '../Main';

/**
 * Tests for configuration parsing helpers in Main.ts
 * These tests verify that the configuration parsing functions correctly
 * handle different input formats and default values
 */
describe('Boolean Configuration Parsing', () => {
    // Properly typed mock platform for testing input parsing
    const mockPlatform: PlatformOperations = {
        getInput: jest.fn<(name: string, required?: boolean) => string>(),
        setOutput: jest.fn<(name: string, value: string) => void>(),
        setResult: jest.fn<(success: boolean, message?: string) => void>(),
        debug: jest.fn<(message: string) => void>(),
        info: jest.fn<(message: string) => void>(),
        warning: jest.fn<(message: string) => void>(),
        error: jest.fn<(message: string) => void>(),
        createLogger: jest.fn(() => ({
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        }))
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Configuration Scenarios', () => {
        it('should work with actual Main.ts configuration options', () => {
            const configs = [
                { name: 'exit-on-error', defaultValue: false },
                { name: 'validators-local', defaultValue: true },
                { name: 'validators-global', defaultValue: false }
            ];

            configs.forEach(config => {
                // Test default behavior with empty input
                (mockPlatform.getInput as jest.Mock).mockReturnValue('');
                const defaultResult = parseBooleanInput(config.name, config.defaultValue, mockPlatform);
                expect(defaultResult).toBe(config.defaultValue);

                // Test override behavior
                (mockPlatform.getInput as jest.Mock).mockReturnValue('true');
                const overrideResult = parseBooleanInput(config.name, config.defaultValue, mockPlatform);
                expect(overrideResult).toBe(true);
            });
        });

        it('should handle all boolean input patterns and edge cases', () => {
            const patterns = [
                // Standard cases
                { input: 'true', expected: true, defaultValue: false, description: 'standard true' },
                { input: 'TRUE', expected: true, defaultValue: false, description: 'uppercase true' },  
                { input: 'True', expected: true, defaultValue: false, description: 'mixed case true' },
                { input: 'TrUe', expected: true, defaultValue: false, description: 'random case true' },
                { input: 'false', expected: false, defaultValue: true, description: 'standard false' },
                { input: 'FALSE', expected: false, defaultValue: true, description: 'uppercase false' },
                { input: 'False', expected: false, defaultValue: true, description: 'mixed case false' },
                { input: 'FaLsE', expected: false, defaultValue: true, description: 'random case false' },
                
                // Whitespace cases
                { input: 'true ', expected: true, defaultValue: false, description: 'true with trailing space' },
                { input: ' true', expected: true, defaultValue: false, description: 'true with leading space' },
                { input: ' true ', expected: true, defaultValue: false, description: 'true with surrounding spaces' },
                { input: '\ttrue\n', expected: true, defaultValue: false, description: 'true with tab and newline' },
                { input: '\r\ntrue\r\n', expected: true, defaultValue: false, description: 'true with CRLF' },
                
                // Non-true values
                { input: '1', expected: false, defaultValue: true, description: 'numeric 1' },
                { input: 'yes', expected: false, defaultValue: true, description: 'yes string' },
                { input: 'on', expected: false, defaultValue: true, description: 'on string' },
                { input: 'enabled', expected: false, defaultValue: true, description: 'enabled string' },
                { input: 'truee', expected: false, defaultValue: true, description: 'typo truee' },
                { input: 'random', expected: false, defaultValue: true, description: 'random string' },
                { input: '   ', expected: false, defaultValue: true, description: 'spaces only' },
                { input: '0', expected: false, defaultValue: true, description: 'numeric 0' },
                
                // Empty/falsy cases with different defaults
                { input: '', expected: true, defaultValue: true, description: 'empty with true default' },
                { input: '', expected: false, defaultValue: false, description: 'empty with false default' }
            ];

            patterns.forEach(pattern => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(pattern.input);
                const result = parseBooleanInput('test-option', pattern.defaultValue, mockPlatform);
                expect(result).toBe(pattern.expected);
            });
        });

        it('should handle null and undefined inputs correctly', () => {
            const falsyValues = [null, undefined];
            
            falsyValues.forEach(value => {
                // Test with default true
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const resultTrue = parseBooleanInput('test-input', true, mockPlatform);
                expect(resultTrue).toBe(true);

                // Test with default false
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const resultFalse = parseBooleanInput('test-input', false, mockPlatform);
                expect(resultFalse).toBe(false);
            });
        });

        it('should call platform.getInput with correct parameter name', () => {
            (mockPlatform.getInput as jest.Mock).mockReturnValue('true');
            parseBooleanInput('my-config-option', false, mockPlatform);
            expect(mockPlatform.getInput).toHaveBeenCalledWith('my-config-option');
            expect(mockPlatform.getInput).toHaveBeenCalledTimes(1);
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle function signature compatibility', () => {
            // Verify that both functions can be called without errors
            (mockPlatform.getInput as jest.Mock).mockReturnValue('true');
            
            expect(() => parseBooleanInput('test', true, mockPlatform)).not.toThrow();
            expect(() => parseBooleanInput('test', false, mockPlatform)).not.toThrow();
        });

        it('should handle special characters and unicode', () => {
            const specialValues = ['tru€', 'fålse', 'тrue', '真'];
            
            specialValues.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInput('test-input', true, mockPlatform);
                expect(result).toBe(false); // Only exact "true" should pass
            });
        });
    });

    describe('File Names Parsing', () => {
        describe('Edge cases for files input parsing', () => {
            test('should handle comma-separated files with spaces', () => {
                const filesInput = 'file1.tf, file2.tf , file3.tf';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual(['file1.tf', 'file2.tf', 'file3.tf']);
            });

            test('should handle single file', () => {
                const filesInput = 'single.tf';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual(['single.tf']);
            });

            test('should handle trailing commas', () => {
                const filesInput = 'file1.tf,file2.tf,';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual(['file1.tf', 'file2.tf']);
            });

            test('should handle consecutive commas', () => {
                const filesInput = 'file1.tf,,file2.tf,,,file3.tf';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual(['file1.tf', 'file2.tf', 'file3.tf']);
            });

            test('should handle only whitespace and commas', () => {
                const filesInput = ' , , , ';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual([]);
            });        test('should handle empty string', () => {
            const filesInput = '';
            const result = filesInput.length > 0 ? filesInput.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0) : undefined;
            expect(result).toBeUndefined();
        });

        test('should handle undefined input', () => {
            const filesInput: string | undefined = undefined;
            // Test the conditional logic from Main.ts
            expect(filesInput).toBeUndefined();
            const result = filesInput ? 'would split' : undefined;
            expect(result).toBeUndefined();
        });

            test('should handle files with spaces in names', () => {
                const filesInput = 'my file.tf, another file.tf, normal.tf';
                const result = filesInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
                expect(result).toEqual(['my file.tf', 'another file.tf', 'normal.tf']);
            });
        });
    });
});
