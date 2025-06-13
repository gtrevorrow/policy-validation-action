import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Extract the parseBooleanInput and parseBooleanInputFalse functions for testing
// These are the actual functions from Main.ts but isolated for testing
const parseBooleanInput = (name: string, defaultValue = true, platform: any): boolean => {
  const value = platform.getInput(name);
  if (!value) return defaultValue;
  return value.toLowerCase() !== 'false';
};

const parseBooleanInputFalse = (name: string, platform: any): boolean => {
  const value = platform.getInput(name);
  if (!value) return false;
  return value.toLowerCase() === 'true';
};

/**
 * Tests for configuration parsing helpers in Main.ts
 * These tests verify that the configuration parsing functions correctly
 * handle different input formats and default values
 */
describe('Boolean Configuration Parsing', () => {
    // Mock platform for testing input parsing
    const mockPlatform = {
        getInput: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly handle undefined value with default true', () => {
        mockPlatform.getInput.mockReturnValue('');
        const result = parseBooleanInput('test-input', true, mockPlatform);
        expect(result).toBe(true);
    });

    it('should correctly handle undefined value with default false', () => {
        mockPlatform.getInput.mockReturnValue('');
        const result = parseBooleanInput('test-input', false, mockPlatform);
        expect(result).toBe(false);
    });

    it('should correctly handle "true" value', () => {
        mockPlatform.getInput.mockReturnValue('true');
        const result = parseBooleanInput('test-input', false, mockPlatform);
        expect(result).toBe(true);
    });

    it('should correctly handle "false" value', () => {
        mockPlatform.getInput.mockReturnValue('false');
        const result = parseBooleanInput('test-input', true, mockPlatform);
        expect(result).toBe(false);
    });

    it('should correctly handle case-insensitive values', () => {
        mockPlatform.getInput.mockReturnValue('FALSE');
        const result = parseBooleanInput('test-input', true, mockPlatform);
        expect(result).toBe(false);

        mockPlatform.getInput.mockReturnValue('TRUE');
        const result2 = parseBooleanInput('test-input', false, mockPlatform);
        expect(result2).toBe(true);
    });

    // Tests for parseBooleanInputFalse
    it('should default to false with parseBooleanInputFalse', () => {
        mockPlatform.getInput.mockReturnValue('');
        const result = parseBooleanInputFalse('test-input', mockPlatform);
        expect(result).toBe(false);
    });

    it('should handle "true" with parseBooleanInputFalse', () => {
        mockPlatform.getInput.mockReturnValue('true');
        const result = parseBooleanInputFalse('test-input', mockPlatform);
        expect(result).toBe(true);
    });

    it('should handle "false" with parseBooleanInputFalse', () => {
        mockPlatform.getInput.mockReturnValue('false');
        const result = parseBooleanInputFalse('test-input', mockPlatform);
        expect(result).toBe(false);
    });
});
