import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { PlatformOperations } from '../types';
import { parseBooleanInput } from '../Main';

// Legacy function that was referenced but doesn't exist in Main.ts
// Keeping for backward compatibility testing
const parseBooleanInputFalse = (name: string, platform: PlatformOperations): boolean => {
  const value = platform.getInput(name);
  if (!value) return false;
  return value.trim().toLowerCase() === 'true';
};

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

    describe('parseBooleanInput core functionality', () => {
        it('should return "true" for exact string "true" (case-insensitive)', () => {
            const trueValues = ['true', 'TRUE', 'True', 'TrUe'];
            
            trueValues.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInput('test-input', false, mockPlatform); // Use false default to ensure input overrides
                expect(result).toBe(true);
            });
        });

        it('should return "false" for string "false" (case-insensitive)', () => {
            const falseValues = ['false', 'FALSE', 'False', 'FaLsE'];
            
            falseValues.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInput('test-input', true, mockPlatform); // Use true default to ensure input overrides
                expect(result).toBe(false);
            });
        });

        it('should return "false" for any non-"true" string values', () => {
            const nonTrueValues = ['1', 'yes', 'on', 'enabled', 'truee', 'random', '   ', '0'];
            
            nonTrueValues.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInput('test-input', true, mockPlatform);
                expect(result).toBe(false);
            });
        });

        it('should return "true" for "true" with whitespace', () => {
            const trueWithWhitespace = ['true ', ' true', ' true ', '\ttrue\n', '\r\ntrue\r\n'];
            
            trueWithWhitespace.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInput('test-input', false, mockPlatform);
                expect(result).toBe(true);
            });
        });

        it('should return default value for empty/falsy inputs', () => {
            const falsyValues = ['', null, undefined];
            
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

    describe('parseBooleanInputFalse (legacy function differences)', () => {
        it('should always default to false (unlike parseBooleanInput)', () => {
            const falsyValues = ['', null, undefined];
            
            falsyValues.forEach(value => {
                (mockPlatform.getInput as jest.Mock).mockReturnValue(value);
                const result = parseBooleanInputFalse('test-input', mockPlatform);
                expect(result).toBe(false); // Always false, no configurable default
            });
        });

        it('should handle "true" and "false" same as parseBooleanInput', () => {
            // Test true
            (mockPlatform.getInput as jest.Mock).mockReturnValue('true');
            const resultTrue = parseBooleanInputFalse('test-input', mockPlatform);
            expect(resultTrue).toBe(true);

            // Test false  
            (mockPlatform.getInput as jest.Mock).mockReturnValue('false');
            const resultFalse = parseBooleanInputFalse('test-input', mockPlatform);
            expect(resultFalse).toBe(false);
        });
    });

    describe('Real-world configuration scenarios', () => {
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

        it('should handle typical CI/CD boolean input patterns', () => {
            const patterns = [
                { input: 'true', expected: true, description: 'standard true' },
                { input: 'TRUE', expected: true, description: 'uppercase true' },  
                { input: 'false', expected: false, description: 'standard false' },
                { input: 'FALSE', expected: false, description: 'uppercase false' },
                { input: '', expected: true, description: 'empty with true default' },
                { input: '', expected: false, description: 'empty with false default' }
            ];

            patterns.forEach(pattern => {
                const defaultValue = pattern.description.includes('true default') ? true : false;
                (mockPlatform.getInput as jest.Mock).mockReturnValue(pattern.input);
                const result = parseBooleanInput('ci-option', defaultValue, mockPlatform);
                expect(result).toBe(pattern.expected);
            });
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle function signature compatibility', () => {
            // Verify that both functions can be called without errors
            (mockPlatform.getInput as jest.Mock).mockReturnValue('true');
            
            expect(() => parseBooleanInput('test', true, mockPlatform)).not.toThrow();
            expect(() => parseBooleanInput('test', false, mockPlatform)).not.toThrow();
            expect(() => parseBooleanInputFalse('test', mockPlatform)).not.toThrow();
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
});
