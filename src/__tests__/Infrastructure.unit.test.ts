/**
 * Infrastructure.unit.test.ts
 * 
 * This file contains unit tests for the core infrastructure components of the policy validation tool.
 * It tests individual components in isolation using mocked dependencies:
 * - findPolicyFiles: File system traversal and filtering logic
 * - validatePolicies: Validation pipeline orchestration
 * - runAction: Configuration parsing and platform abstraction
 * 
 * These unit tests use mocked file system operations to test the logic without
 * relying on real files, ensuring fast and reliable test execution.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
    findPolicyFiles,
    runAction,
    validatePolicies
} from '../Main';
import { ExtractorType } from '../extractors/ExtractorFactory';
import { mockLogger } from './fixtures/test-utils';

// Mock all filesystem operations for unit tests
jest.mock('fs', () => {
    const originalFs = jest.requireActual('fs');
    return {
        constants: originalFs.constants, // Keep the original constants
        promises: {
            readFile: jest.fn(),
            readdir: jest.fn(),
            stat: jest.fn(),
            access: jest.fn()
        }
    };
});

describe('Infrastructure Unit Tests', () => {
    // Common mock data
    const MOCK_FILES = [
        { name: 'file1.tf', isFile: () => true, isDirectory: () => false },
        { name: 'file2.txt', isFile: () => true, isDirectory: () => false },
        { name: 'subdir', isFile: () => false, isDirectory: () => true }
    ] as unknown as fs.Dirent[];

    const MOCK_SUBDIR_FILES = [
        { name: 'file3.tf', isFile: () => true, isDirectory: () => false }
    ] as unknown as fs.Dirent[];

    const MOCK_DIRECTORY_STAT = {
        isFile: () => false,
        isDirectory: () => true
    } as unknown as fs.Stats;

    const MOCK_FILE_STAT = {
        isFile: () => true,
        isDirectory: () => false
    } as unknown as fs.Stats;

    // Helper to standardise mock behavior
    const setupMocks = () => {
        const mockAccess = fs.promises.access as jest.MockedFunction<typeof fs.promises.access>;
        const mockStat = fs.promises.stat as jest.MockedFunction<typeof fs.promises.stat>;
        const mockReaddir = fs.promises.readdir as jest.MockedFunction<typeof fs.promises.readdir>;

        mockAccess.mockImplementation(async (p) => {
            const pa = p.toString();
            if (pa.includes('inaccessible')) {
                throw new Error('Access denied');
            }
            return undefined;
        });

        mockStat.mockImplementation(async (p) => {
            const pa = p.toString();
            if (pa.endsWith('.tf') || pa.endsWith('.txt') || pa.endsWith('.xml') || pa.endsWith('file')) {
                return MOCK_FILE_STAT;
            }
            if (pa.includes('nonexistent')) {
                throw new Error('ENOENT');
            }
            if (pa.includes('inaccessible')) {
                throw new Error('Access denied');
            }
            // Assume everything else is a directory unless it's a specific file we test for
            return MOCK_DIRECTORY_STAT;
        });

        mockReaddir.mockImplementation(async (p) => {
            const pa = p.toString();
            if (pa.endsWith('subdir')) {
                return MOCK_SUBDIR_FILES;
            }
            if (pa === '/empty/dir') {
                return [];
            }
            if (pa.includes('nonexistent')) {
                throw new Error('ENOENT');
            }
            // Default directory listing
            return MOCK_FILES;
        });
    };

    // Clear mocks between tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Tests for findPolicyFiles function
     * 
     * These tests verify that the function correctly:
     * - Finds and filters files based on extension (.tf by default)
     * - Handles different directory structures and file types
     * - Properly applies filtering options (ignoreExtension, fileExtension, fileNames)
     * - Handles edge cases such as a single file path
     */
    describe('findPolicyFiles', () => {
        it('should handle a single file path', async () => {
            setupMocks();
            // Override just for this test case if needed, or rely on general logic
            // The general logic handles .tf as file, so this should work automatically

            const files = await findPolicyFiles('/test/dir/file.tf');
            expect(files).toEqual(['/test/dir/file.tf']);
        });

        it('should filter files when fileNames are provided', async () => {
            setupMocks();
            const mockStat = fs.promises.stat as jest.MockedFunction<typeof fs.promises.stat>;

            // Override stat for specific files used in this test
            mockStat.mockImplementation(async (p) => {
                const pa = p.toString();
                if (pa.endsWith('policy1.tf') || pa.endsWith('policy2.tf')) {
                    return MOCK_FILE_STAT;
                }
                return MOCK_DIRECTORY_STAT;
            });

            // We need readdir to return these specific files
            const mockReaddir = fs.promises.readdir as jest.MockedFunction<typeof fs.promises.readdir>;
            mockReaddir.mockResolvedValue([
                { name: 'policy1.tf', isFile: () => true, isDirectory: () => false },
                { name: 'policy2.tf', isFile: () => true, isDirectory: () => false },
                { name: 'ignored.tf', isFile: () => true, isDirectory: () => false }
            ] as unknown as fs.Dirent[]);

            const files = await findPolicyFiles('/test/dir', {
                fileNames: ['policy1.tf', 'policy2.tf']
            });

            expect(files).toEqual([
                '/test/dir/policy1.tf',
                '/test/dir/policy2.tf'
            ]);
        });

        it('should return all files by default (no filtering)', async () => {
            setupMocks();

            const files = await findPolicyFiles('/test/dir');
            expect(files).toEqual([
                '/test/dir/file1.tf',
                '/test/dir/file2.txt',
                '/test/dir/subdir/file3.tf'
            ]);
        });

        it('should filter files by extension when specified', async () => {
            setupMocks();

            const files = await findPolicyFiles('/test/dir', { fileExtension: '.tf' });
            expect(files).toEqual([
                '/test/dir/file1.tf',
                '/test/dir/subdir/file3.tf'
            ]);
        });

        it('should handle edge cases in file extension filtering', async () => {
            setupMocks();
            const edgeCaseFiles = [
                { name: 'file.tf', isFile: () => true, isDirectory: () => false },
                { name: 'file.', isFile: () => true, isDirectory: () => false }, // Empty extension
                { name: 'file', isFile: () => true, isDirectory: () => false }, // No extension
                { name: '.hidden', isFile: () => true, isDirectory: () => false }, // Hidden file
                { name: 'file.TF', isFile: () => true, isDirectory: () => false }, // Case sensitivity
                { name: 'file.tf.backup', isFile: () => true, isDirectory: () => false } // Multiple extensions
            ] as unknown as fs.Dirent[];

            const mockReaddir = fs.promises.readdir as jest.MockedFunction<typeof fs.promises.readdir>;
            mockReaddir.mockResolvedValue(edgeCaseFiles);

            // Test empty extension - should return all files (no filtering)
            const emptyExtFiles = await findPolicyFiles('/test/dir', { fileExtension: '' });
            expect(emptyExtFiles).toEqual([
                '/test/dir/file.tf',
                '/test/dir/file.',
                '/test/dir/file',
                '/test/dir/.hidden',
                '/test/dir/file.TF',
                '/test/dir/file.tf.backup'
            ]);

            // Test case sensitivity - should only match exact case
            const caseFiles = await findPolicyFiles('/test/dir', { fileExtension: '.tf' });
            expect(caseFiles).toEqual(['/test/dir/file.tf']);
            expect(caseFiles).not.toContain('/test/dir/file.TF');
        });
    });

    /**
     * Tests for validatePolicies function
     * 
     * These tests verify that the validatePolicies function correctly:
     * - Returns an empty array when no files match the criteria
     * - Returns validation reports for found policies using the pipeline system
     * - Handles different validation pipeline configurations
     * - Properly logs warnings and handles error conditions
     */
    describe('validatePolicies', () => {
        it('should return empty array when no files match criteria', async () => {
            // Setup mocks
            setupMocks();
            // Override for this test
            const nonMatchingFiles = [
                { name: 'readme.txt', isFile: () => true, isDirectory: () => false },
                { name: 'config.json', isFile: () => true, isDirectory: () => false }
            ] as unknown as fs.Dirent[];

            const mockReaddir = fs.promises.readdir as jest.MockedFunction<typeof fs.promises.readdir>;
            mockReaddir.mockResolvedValue(nonMatchingFiles);


            const options = {
                extractorType: 'regex' as ExtractorType,
                fileExtension: '.tf',
                exitOnError: false
            };

            const results = await validatePolicies('/test/dir', options, mockLogger);

            // Should return empty array
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(0);

            // Should log the appropriate warning message
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'No files matching criteria found in /test/dir'
            );
        });

        it('should return empty array when directory has no files at all', async () => {
            setupMocks(); // Will return [] for /empty/dir based on setupMocks logic


            const options = {
                extractorType: 'regex' as ExtractorType,
                exitOnError: false
            };

            const results = await validatePolicies('/empty/dir', options, mockLogger);

            // Should return empty array
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(0);

            // Should log the general "no files found" message
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'No files found in /empty/dir'
            );
        });
    });

    /**
     * Unit Tests for edge cases and error handling
     * These tests ensure the library correctly handles missing files,
     * inaccessible directories, and other error conditions using mocked filesystem.
     */
    describe('Error Handling Unit Tests', () => {
        it('should handle empty directory', async () => {
            setupMocks();

            const files = await findPolicyFiles('nonexistent', {}, mockLogger);
            expect(files).toEqual([]);
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle path access errors correctly in findPolicyFiles', async () => {
            setupMocks();

            // Call findPolicyFiles with an inaccessible path
            const files = await findPolicyFiles('/inaccessible/path', {}, mockLogger);

            // It should return an empty array and log the error
            expect(files).toEqual([]);
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Path /inaccessible/path is not accessible')
            );
        });
    });

    /**
     * Unit Tests for configuration parsing helpers
     * These tests verify that the configuration parsing functions correctly
     * handle different input formats and default values for validator pipelines using mocked platform operations.
     */
    describe('Configuration Parsing Unit Tests', () => {
        let accessMock: jest.SpyInstance;
        let statMock: jest.SpyInstance;
        let readdirMock: jest.SpyInstance;
        beforeAll(() => {
            const resolvedDotPath = path.resolve('.');
            accessMock = jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined);
            statMock = jest.spyOn(fs.promises, 'stat').mockImplementation(async (p: string | Buffer | URL) => {
                const pathStr = path.resolve(p.toString());
                if (pathStr === resolvedDotPath) {
                    return {
                        isFile: () => false, isDirectory: () => true, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false,
                        dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
                        atimeMs: Date.now(), mtimeMs: Date.now(), ctimeMs: Date.now(), birthtimeMs: Date.now(),
                        atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date()
                    } as fs.Stats;
                } else if (pathStr === path.join(resolvedDotPath, 'dummy.tf')) {
                    return {
                        isFile: () => true, isDirectory: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false,
                        dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 100, blksize: 4096, blocks: 1,
                        atimeMs: Date.now(), mtimeMs: Date.now(), ctimeMs: Date.now(), birthtimeMs: Date.now(),
                        atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date()
                    } as fs.Stats;
                }
                // Enhanced fallback for unhandled paths
                return {
                    isFile: () => false, isDirectory: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false,
                    dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0,
                    atimeMs: Date.now(), mtimeMs: Date.now(), ctimeMs: Date.now(), birthtimeMs: Date.now(),
                    atime: new Date(), mtime: new Date(), ctime: new Date(), birthtime: new Date()
                } as fs.Stats;
            });
            readdirMock = jest.spyOn(fs.promises, 'readdir').mockImplementation(async (p: string | Buffer | URL) => {
                const pathStr = p.toString();
                if (pathStr === '.' || pathStr.endsWith('/.')) {
                    return [
                        { name: 'dummy.tf', isFile: () => true, isDirectory: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false }
                    ] as fs.Dirent[];
                }
                return [];
            });
        });
        afterAll(() => {
            accessMock.mockRestore();
            statMock.mockRestore();
            readdirMock.mockRestore();
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should correctly parse boolean inputs with default values', async () => {
            // Create a shared logger mock
            const logger = {
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn()
            };

            // Test with empty inputs to verify default values
            const mockGetInput = jest.fn((name) => {
                if (name === 'path') return '.';
                // Return empty for all other inputs to test default values
                return '';
            });

            const testPlatform = {
                getInput: mockGetInput,
                setOutput: jest.fn(),
                setResult: jest.fn(),
                debug: jest.fn(),
                info: jest.fn(),
                warning: jest.fn(), // Changed from warn to warning
                error: jest.fn(),
                createLogger: jest.fn().mockReturnValue(logger)
            };

            await runAction(testPlatform);

            // Verify the explicit default values for validator pipelines
            expect(logger.info.mock.calls.flat()).toContain("Exit on error: false");
            expect(logger.info.mock.calls.flat()).toContain("Local validators enabled: true");
            expect(logger.info.mock.calls.flat()).toContain("Global validators enabled: false");
        });

        it('should handle specific boolean values correctly', async () => {
            // Create a shared logger mock
            const logger = {
                debug: jest.fn(),
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn()
            };

            // Test with specific boolean values
            const mockGetInput = jest.fn((name) => {
                if (name === 'path') return '.';
                if (name === 'exit-on-error') return 'true';
                if (name === 'validators-local') return 'false';
                if (name === 'validators-global') return 'true';
                return '';
            });

            const testPlatform = {
                getInput: mockGetInput,
                setOutput: jest.fn(),
                setResult: jest.fn(),
                debug: jest.fn(),
                info: jest.fn(),
                warning: jest.fn(), // Changed from warn to warning
                error: jest.fn(),
                createLogger: jest.fn().mockReturnValue(logger)
            };

            await runAction(testPlatform);

            // Verify all boolean values for validator pipelines are set correctly
            expect(logger.info.mock.calls.flat()).toContain("Exit on error: true");
            expect(logger.info.mock.calls.flat()).toContain("Local validators enabled: false");
            expect(logger.info.mock.calls.flat()).toContain("Global validators enabled: true");
        });
    });
});
