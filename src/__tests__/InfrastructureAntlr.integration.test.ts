/**
 * InfrastructureAntlr.integration.test.ts
 * 
 * This file contains integration tests for the core infrastructure components 
 * specifically using the ANTLR4-based HCL policy extractor.
 */

import * as path from 'path';
import {
    processFile,
    validatePolicies
} from '../Main';
import { ValidatorFactory } from '../validators/ValidatorFactory';
import { mockLogger } from './fixtures/test-utils';

describe('Infrastructure ANTLR HCL Integration Tests', () => {

    describe('Policy Processing with AntlrHclPolicyExtractor', () => {
        it('should extract policies from valid fixture file using ANTLR HCL extractor', async () => {
            const fixturePath = path.join(__dirname, 'fixtures', 'valid.tf');

            // Using 'antlr-hcl' extractor type
            const expressions = await processFile(fixturePath, undefined, 'antlr-hcl', mockLogger);

            // Should find policies from oci_identity_policy blocks
            expect(expressions.length).toBeGreaterThan(0);
            expect(expressions).toContain('Allow group Administrators to manage all-resources in tenancy');
            expect(expressions).toContain('Allow group Developers to use instances in compartment dev');

            // ANTLR extractor should find policies in nested blocks but not in locals if not targeted
            // Our current implementation targets resource "oci_identity_policy" blocks
            expect(expressions.some(e => e.includes('Administrators_locals'))).toBe(false);
        });

        it('should extract complex policies including heredocs using ANTLR HCL extractor', async () => {
            // We'll create a temporary fixture or use one that has heredocs if available
            // Let's check complex-terraform.tf
            const fixturePath = path.join(__dirname, 'fixtures', 'complex-terraform.tf');
            const expressions = await processFile(fixturePath, undefined, 'antlr-hcl', mockLogger);

            expect(expressions.length).toBeGreaterThan(0);
            // Check for a policy that might be in a heredoc
            expect(expressions.some(e => e.includes('manage all-resources'))).toBe(true);
        });
    });

    describe('End-to-End Validation with ANTLR HCL Extractor', () => {
        it('should run full validation pipeline using ANTLR HCL extractor on fixtures directory', async () => {
            const fixturesDir = path.join(__dirname, 'fixtures');

            const options = {
                extractorType: 'antlr-hcl' as any,
                fileExtension: '.tf',
                exitOnError: false,
                validatorConfig: {
                    runLocalValidators: true,
                    runGlobalValidators: true
                }
            };

            const results = await validatePolicies(fixturesDir, options, mockLogger);

            // Should have results for valid.tf and others
            expect(results.length).toBeGreaterThan(0);

            const validFileResult = results.find(r => path.basename(r.file) === 'valid.tf');
            expect(validFileResult).toBeDefined();

            // Check syntax reports for valid.tf
            const syntaxReport = validFileResult?.results.find(res => res.validatorName === 'OCI Syntax Validator');
            expect(syntaxReport).toBeDefined();
            expect(syntaxReport?.reports.every(rep => rep.passed)).toBe(true);

            // Check global results (CIS benchmarks)
            const globalResult = results.find(r => r.file === 'Global Validation');
            expect(globalResult).toBeDefined();

            // The global validation should have found the overly permissive policy in valid.tf
            const cisReport = globalResult?.results.find(res => res.validatorName === 'OCI CIS Benchmark Validator');
            expect(cisReport).toBeDefined();

            const leastPrivilegeCheck = cisReport?.reports.find(rep => rep.checkId === 'CIS-OCI-1.2');
            expect(leastPrivilegeCheck).toBeDefined();
            // It should fail because valid.tf has "Allow group SecurityAdmins to manage all-resources in tenancy"
            // and "Allow group ${var.admin_group} ..." which uses a variable (variable ones usually result in warnings, but overall passed: false if there are other errors).
            // Actually, SecurityAdmins is a definite violation.
            expect(leastPrivilegeCheck?.passed).toBe(false);
        });
    });
});
