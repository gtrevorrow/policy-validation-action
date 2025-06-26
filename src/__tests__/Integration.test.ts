/**
 * Integration.test.ts
 * 
 * High-level integration tests that verify the complete policy validation workflow.
 * These tests ensure all components work together correctly:
 * - File processing pipeline
 * - Policy extraction across different formats
 * - Validation pipeline execution
 * - Error handling and reporting
 * - End-to-end validation workflows
 * 
 * Unlike unit tests, these integration tests use real file fixtures and test
 * the complete system behavior from input to output.
 */

import * as path from 'path';
import * as fs from 'fs';
import { 
    processFile,
    validatePolicies
} from '../Main';
import { ValidationPipeline } from '../validators/ValidationPipeline';
import { ValidatorFactory } from '../validators/ValidatorFactory';
import { ExtractorFactory, ExtractorType } from '../extractors/ExtractorFactory';
import { mockLogger } from './fixtures/test-utils';

describe('Integration Tests - Complete Policy Validation Workflow', () => {
    
    /**
     * End-to-End File Processing Tests
     * 
     * These tests verify the complete file processing pipeline:
     * - File reading and parsing
     * - Policy extraction with different patterns and configurations  
     * - Error handling for non-existent files
     */
    describe('End-to-End File Processing', () => {
        
        it('should process a complete Terraform file with multiple policy resources', async () => {
            const fixturePath = path.join(__dirname, 'fixtures', 'complex-terraform.tf');
            
            const policies = await processFile(fixturePath, undefined, 'regex', mockLogger);
            
            expect(policies).toBeDefined();
            expect(policies.length).toBeGreaterThan(0);
            expect(policies).toContain('Allow group Administrators to manage all-resources in tenancy');
            expect(policies.some(p => p.includes('${var.dev_compartment}'))).toBe(true);
            expect(policies.some(p => p.includes('security-family'))).toBe(true);
        });

        it('should handle file processing errors gracefully', async () => {
            const nonExistentPath = path.join(__dirname, 'fixtures', 'non-existent.tf');
            
            // processFile returns empty array for non-existent files instead of throwing
            const result = await processFile(nonExistentPath, undefined, 'regex', mockLogger);
            expect(result).toEqual([]);
        });

        it('should extract policies using different pattern approaches', async () => {
            const fixturePath = path.join(__dirname, 'fixtures', 'custom-pattern.tf');
            
            // Test default pattern extraction (looks for statements = [...] arrays)
            const defaultPolicies = await processFile(fixturePath, undefined, 'regex', mockLogger);
            
            // Test custom pattern extraction (looks for statement = "..." individual statements)
            const customPattern = 'statement\\s*=\\s*"([^"]+)"';
            const customPolicies = await processFile(fixturePath, customPattern, 'regex', mockLogger);
            
            // The default pattern should not find anything in this custom format file
            // because it looks for 'statements = [...]' but the file has 'statement = "..."'
            expect(defaultPolicies).toEqual([]);
            
            // The custom pattern should extract the individual statement values
            expect(customPolicies.length).toBe(2);
            expect(customPolicies).toContain('Allow group Admins to manage all-resources in tenancy');
            expect(customPolicies).toContain('Allow group Users to read instances in compartment dev');
            
            // Verify the custom pattern extracted clean policy text (no wrapper syntax)
            customPolicies.forEach(policy => {
                expect(policy).not.toMatch(/^statement\s*=/);
                expect(policy).not.toMatch(/[{}]/);
                expect(policy.startsWith('Allow ')).toBe(true);
            });
        });
    });

    /**
     * Complete Validation Pipeline Tests
     * 
     * These tests verify the entire validation workflow:
     * - Policy extraction
     * - Validation pipeline execution
     * - Multiple validator coordination
     * - Results aggregation and reporting
     */
    describe('Complete Validation Pipeline', () => {
        
        it('should execute complete validation workflow with multiple validators', async () => {
            const testPolicies = [
                'Allow group Administrators to manage all-resources in tenancy',
                'Allow group Developers to use instances in compartment dev',
                'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\'',
                'BadSyntax policy statement that should fail'
            ];
            
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            pipeline.addValidator(ValidatorFactory.createCisBenchmarkValidator(mockLogger));
            
            const results = await pipeline.validate(testPolicies);
            
            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(0);
            
            // Should have validation results for each validator
            const syntaxResults = results.filter(r => r.validatorName.includes('Syntax'));
            const cisResults = results.filter(r => r.validatorName.includes('Benchmark'));
            
            expect(syntaxResults.length).toBeGreaterThan(0);
            expect(cisResults.length).toBeGreaterThan(0);
            
            // Check for validation issues in results
            const hasErrors = results.some(r => 
                r.reports.some(report => 
                    report.issues.some(issue => issue.severity === 'error')
                )
            );
            expect(hasErrors).toBe(true);
        });

        it('should handle validation pipeline with no policies', async () => {
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            
            const results = await pipeline.validate([]);
            
            expect(results).toBeDefined();
            expect(results.length).toBe(0);
        });

        it('should aggregate results from multiple validators correctly', async () => {
            const testPolicies = [
                'Allow group TestGroup to manage instances in compartment test',
                'Allow group AnotherGroup to use virtual-network-family in compartment test'
            ];
            
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            pipeline.addValidator(ValidatorFactory.createCisBenchmarkValidator(mockLogger));
            
            const results = await pipeline.validate(testPolicies);
            
            expect(results).toBeDefined();
            
            // Each result should have required fields
            results.forEach(result => {
                expect(result).toHaveProperty('validatorName');
                expect(result).toHaveProperty('validatorDescription');
                expect(result).toHaveProperty('reports');
                expect(Array.isArray(result.reports)).toBe(true);
            });
        });
    });

    /**
     * Error Handling Integration Tests
     * 
     * These tests verify error handling across the complete system:
     * - File system errors
     * - Parsing errors
     * - Validation errors
     * - Pipeline failures
     */
    describe('Error Handling Integration', () => {
        
        it('should handle and report file system errors', async () => {
            const inaccessiblePath = '/root/inaccessible-file.tf';
            
            // processFile returns empty array for inaccessible files instead of throwing
            const result = await processFile(inaccessiblePath, undefined, 'regex', mockLogger);
            expect(result).toEqual([]);
        });

        it('should handle extraction errors gracefully', async () => {
            const fixturePath = path.join(__dirname, 'fixtures', 'malformed.tf');
            
            const policies = await processFile(fixturePath, undefined, 'regex', mockLogger);
            
            // Should handle gracefully and return empty array or minimal results
            expect(policies).toBeDefined();
            expect(Array.isArray(policies)).toBe(true);
        });

        it('should handle validator initialization correctly', async () => {
            const syntaxValidator = ValidatorFactory.createSyntaxValidator(mockLogger);
            const cisValidator = ValidatorFactory.createCisBenchmarkValidator(mockLogger);
            
            expect(syntaxValidator).toBeDefined();
            expect(cisValidator).toBeDefined();
            
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(syntaxValidator);
            pipeline.addValidator(cisValidator);
            
            expect(pipeline.hasValidators()).toBe(true);
        });
    });

    /**
     * ExtractorFactory Integration Tests
     * 
     * These tests verify the extractor factory and different extraction strategies
     */
    describe('ExtractorFactory Integration', () => {
        
        it('should create regex extractor correctly', () => {
            const extractor = ExtractorFactory.create('regex');
            expect(extractor).toBeDefined();
        });

        it('should throw error for unsupported extractor type', () => {
            expect(() => {
                ExtractorFactory.create('unsupported' as ExtractorType);
            }).toThrow('Unsupported extractor type: unsupported');
        });

        it('should create extractor with custom pattern', () => {
            const customPattern = 'custom-pattern-test';
            const extractor = ExtractorFactory.create('regex', { pattern: customPattern });
            expect(extractor).toBeDefined();
        });
    });

    /**
     * Performance Integration Tests
     * 
     * These tests verify system performance with realistic loads:
     * - Large file processing
     * - Processing time limits
     */
    describe('Performance Integration', () => {
        
        it('should handle large files efficiently', async () => {
            const largeFilePath = path.join(__dirname, 'fixtures', 'large-policy.tf');
            
            const startTime = Date.now();
            const policies = await processFile(largeFilePath, undefined, 'regex', mockLogger);
            const endTime = Date.now();
            
            expect(policies).toBeDefined();
            expect(policies.length).toBeGreaterThan(0);
            
            // Should process within reasonable time (less than 5 seconds)
            expect(endTime - startTime).toBeLessThan(5000);
        });
    });

    /**
     * Configuration Integration Tests
     * 
     * These tests verify configuration handling across the system:
     * - Default configuration application
     * - Configuration validation
     */
    describe('Configuration Integration', () => {
        
        it('should apply default configurations correctly', async () => {
            const testPolicies = [
                'Allow group TestGroup to manage instances in compartment test'
            ];
            
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            
            const results = await pipeline.validate(testPolicies);
            
            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle missing configuration gracefully', async () => {
            const testPolicies = [
                'Allow group TestGroup to read all-resources in compartment test'
            ];
            
            const pipeline = new ValidationPipeline();
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator());
            
            const results = await pipeline.validate(testPolicies);
            
            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
        });
    });

    /**
     * Real-World Scenario Tests
     * 
     * These tests simulate real-world usage patterns
     */
    describe('Real-World Scenarios', () => {
        
        it('should handle mixed policy statement formats', async () => {
            const testPolicies = [
                'Allow group Administrators to manage all-resources in tenancy',
                'Allow group Developers to use instances in compartment ${var.dev_compartment}',
                'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\'',
                'Allow group NetworkAdmins to manage virtual-network-family in compartment ${var.network_compartment} where request.operation != \'CreateVcn\''
            ];
            
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            pipeline.addValidator(ValidatorFactory.createCisBenchmarkValidator(mockLogger));
            
            const results = await pipeline.validate(testPolicies);
            
            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(0);
            
            // Should handle variable interpolation and complex conditions
            const allIssues = results.flatMap(r => r.reports.flatMap(report => report.issues));
            expect(allIssues.length).toBeGreaterThan(0);
        });

        it('should validate complex Terraform file end-to-end', async () => {
            const fixturePath = path.join(__dirname, 'fixtures', 'real-world.tf');
            
            // Test the complete workflow: extraction + validation
            const policies = await processFile(fixturePath, undefined, 'regex', mockLogger);
            
            expect(policies.length).toBeGreaterThan(10);
            expect(policies.some(p => p.includes('manage all-resources'))).toBe(true);
            expect(policies.some(p => p.includes('${var.compartment_name}'))).toBe(true);
            expect(policies.some(p => p.includes('request.user.mfachallenged'))).toBe(true);
            
            // Now validate the extracted policies
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(ValidatorFactory.createSyntaxValidator(mockLogger));
            pipeline.addValidator(ValidatorFactory.createCisBenchmarkValidator(mockLogger));
            
            const results = await pipeline.validate(policies);
            
            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(0);
            
            // Should have both syntax and CIS results
            const syntaxResults = results.filter(r => r.validatorName.includes('Syntax'));
            const cisResults = results.filter(r => r.validatorName.includes('Benchmark'));
            
            expect(syntaxResults.length).toBeGreaterThan(0);
            expect(cisResults.length).toBeGreaterThan(0);
        });

        it('should execute validatePolicies function end-to-end', async () => {
            // Use existing test file
            const testFilePath = path.join(__dirname, 'fixtures', 'validate-policies-test.tf');
            
            // Test the main validatePolicies function with a file path
            const results = await validatePolicies(testFilePath, {
                extractorType: 'regex',
                exitOnError: false,
                validatorConfig: {
                    runLocalValidators: true,
                    runGlobalValidators: true
                }
            }, mockLogger);
            
            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);
            
            // Should have results from the file
            const fileResults = results.find(r => r.file.includes('validate-policies-test.tf'));
            expect(fileResults).toBeDefined();
            
            if (fileResults) {
                expect(fileResults.results.length).toBeGreaterThan(0);
            }
        });
    });
});
