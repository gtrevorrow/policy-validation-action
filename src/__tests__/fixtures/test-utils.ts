/**
 * Test utilities for policy validation tests
 */

// Simple logger mock for use across tests
export const mockLogger = { 
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};
