import { ExtractorFactory } from '../extractors/ExtractorFactory';
import { ValidatorFactory } from '../validators/ValidatorFactory';
import { mockLogger } from './fixtures/test-utils';
import { LlmService } from '../llm/LlmService';

/**
 * Integration tests for the complete policy validation workflow.
 * Tests the end-to-end flow from extraction through validation.
 * For unit tests of individual components, see their respective test files.
 */
describe('Policy Validation Integration', () => {

    describe('Extraction Integration', () => {
        let extractor: any;

        beforeEach(() => {
            extractor = ExtractorFactory.create('regex');
        });
        
        it('should extract all OCI policy statement types from Terraform', () => {
            const input = `
                resource "oci_identity_policy" "comprehensive_test" {
                    statements = [
                        "Allow group Administrators to manage all-resources in tenancy",
                        "Allow group Developers to use instances in compartment dev",
                        "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
                        "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
                        "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy",
                        "Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups contains 'SecurityAdmins'"
                    ]
                }
            `;
            const result = extractor.extract(input);
            
            expect(result).toHaveLength(6);
            expect(result).toEqual(expect.arrayContaining([
                expect.stringMatching(/^Allow group Administrators/),
                expect.stringMatching(/^Allow group Developers/),
                expect.stringMatching(/^Define tenancy/),
                expect.stringMatching(/^Endorse group/),
                expect.stringMatching(/^Admit group/),
                expect.stringMatching(/request\.user\.groups/)
            ]));
        });

        it('should handle Terraform variable interpolation in policies', () => {
            const input = `
                resource "oci_identity_policy" "variable_test" {
                    statements = [
                        "Allow group \${var.admin_group} to manage all-resources in tenancy",
                        "Define tenancy \${var.tenant_name} as \${var.tenant_ocid}",
                        "Allow any-user to use instances in compartment \${var.public_compartment} where request.time BETWEEN \${var.start_time} AND \${var.end_time}"
                    ]
                }
            `;
            const result = extractor.extract(input);
            
            expect(result).toHaveLength(3);
            expect(result).toEqual(expect.arrayContaining([
                expect.stringMatching(/\${var\.admin_group}/),
                expect.stringMatching(/\${var\.tenant_name}/),
                expect.stringMatching(/BETWEEN.*AND/)
            ]));
        });

        it('should extract from multiple policy resources', () => {
            const input = `
                resource "oci_identity_policy" "policy1" {
                    statements = ["Allow group Admins to manage all-resources in tenancy"]
                }
                resource "oci_identity_policy" "policy2" {
                    statements = ["Allow group Users to read all-resources in tenancy"]
                }
            `;
            const result = extractor.extract(input);
            
            expect(result).toHaveLength(2);
            expect(result).toContain("Allow group Admins to manage all-resources in tenancy");
            expect(result).toContain("Allow group Users to read all-resources in tenancy");
        });

        it('should handle multi-line and indented statement arrays', () => {
            const input = `
                resource "oci_identity_policy" "policy1" {
                    statements = [
                        "Allow group Developers to manage instances in compartment \${var.dev_compartment}"
                    ]
                }
                resource "oci_identity_policy" "policy2" {
                    statements = [
                        "Allow group Admins to manage all-resources in tenancy"
                    ]
                }
            `;
            const result = extractor.extract(input);
            
            expect(result).toHaveLength(2);
            expect(result).toContain("Allow group Developers to manage instances in compartment \${var.dev_compartment}");
            expect(result).toContain("Allow group Admins to manage all-resources in tenancy");
        });

        it('should handle empty or malformed Terraform input', () => {
            expect(extractor.extract('')).toEqual([]);
            expect(extractor.extract('invalid terraform')).toEqual([]);
            expect(extractor.extract('resource "other_resource" { value = "test" }')).toEqual([]);
        });
  
    });

    describe('End-to-End Validation', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        
        it('should complete full validation pipeline with valid policies', async () => {
            const policies = [
                'Allow group Administrators to manage all-resources in tenancy',
                'Allow group Developers to use instances in compartment dev'
            ];
            
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const results = await pipeline.validate(policies);
            
            expect(results).toHaveLength(1);
            expect(results[0].validatorName).toBe('OCI Syntax Validator');
            expect(results[0].reports[0].passed).toBe(true);
            expect(results[0].reports[0].issues).toHaveLength(0);
        });

        it('should detect and report validation failures', async () => {
            const policies = ['Allow BadSyntax manage'];
            
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const results = await pipeline.validate(policies);
            
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(false);
            expect(results[0].reports[0].issues.length).toBeGreaterThan(0);
            expect(results[0].reports[0].issues[0]).toMatchObject({
                statement: expect.any(String),
                message: expect.any(String),
                severity: 'error'
            });
        });

        it('should handle complex policy scenarios with variables and conditions', async () => {
            const policies = [
                'Define tenancy ${var.tenant_name} as ocid1.tenancy.oc1..test',
                'Admit group Admins of tenancy ${var.acceptor_tenant} to manage instances in tenancy',
                'Allow group ${var.admin_group} to manage all-resources in tenancy where request.user.name = "${var.admin_user}"',
                'Endorse group foo to manage virtual-network-family in tenancy ${var.acceptor_tenant}'
            ];
            
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const results = await pipeline.validate(policies);
            
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(true);
            expect(results[0].reports[0].issues).toHaveLength(0);
        });

        it('should reject policies with syntax errors and provide detailed feedback', async () => {
            const invalidPolicies = [
                'AllowBadSyntax manage',
                'Allow groupDevelopers to use instances in compartment dev',
                'Admitgroup ServiceAdmins of tenancy 123 to manage instances in tenancy',
                'DefinetenancyAcceptor as ocid1',
                'Endorsegroup NetworkAdmins to manage something in tenancy'
            ];
            
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const results = await pipeline.validate(invalidPolicies);
            
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(false);
            expect(results[0].reports[0].issues.length).toBeGreaterThan(0);
            
            // Verify each issue has required properties
            results[0].reports[0].issues.forEach(issue => {
                expect(issue).toMatchObject({
                    statement: expect.any(String),
                    message: expect.any(String),
                    severity: 'error'
                });
            });
        });

        it('should handle edge cases: empty policies, null inputs, large datasets', async () => {
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            
            // Empty array
            let results = await pipeline.validate([]);
            expect(results).toEqual([]);
            
            // Empty strings in array
            results = await pipeline.validate(['', '   ', '\n\t']);
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(true);
            
            // Large policy set (performance test)
            const largePolicySet = Array(100).fill('Allow group Developers to use instances in compartment dev');
            results = await pipeline.validate(largePolicySet);
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(true);
        });

        it('should validate with both local and global pipelines', async () => {
            const policies = ['Allow group Administrators to manage all-resources in tenancy'];
            
            // Test local pipeline
            const localPipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const localResults = await localPipeline.validate(policies);
            expect(localResults).toHaveLength(1);
            expect(localResults[0].validatorName).toBe('OCI Syntax Validator');
            
            // Test global pipeline
            const globalPipeline = ValidatorFactory.createGlobalPipeline(mockLogger, {});
            const globalResults = await globalPipeline.validate(policies);
            expect(globalResults).toHaveLength(1);
            expect(globalResults[0].validatorName).toBe('OCI CIS Benchmark Validator');
        });

        it('should use agentic validator via factory for policies with variables', async () => {
            jest.resetModules();
            const mockValidate = jest.fn().mockResolvedValue([
              { policyIndex: 0, passed: false, severity: 'warning', reason: 'Mocked' },
            ]);
            jest.doMock('../llm/LlmService', () => ({
              LlmService: jest.fn().mockImplementation(() => ({ validate: mockValidate })),
            }));
    
            const { ValidatorFactory } = require('../validators/ValidatorFactory');
            const { mockLogger } = require('./fixtures/test-utils');
            const { ValidationOptions } = require('../types');

            const policiesWithVars = ['Allow group ${var.admin_group} to manage all-resources in tenancy'];
            const options: typeof ValidationOptions = {
                agenticValidation: { enabled: true, provider: 'openai', apiKey: 'test-key' }
            };

            const hybridPipeline = ValidatorFactory.createGlobalPipeline(mockLogger, options);
            const results = await hybridPipeline.validate(policiesWithVars, options);

            expect(results).toHaveLength(1);
            const agenticResult = results[0];
            expect(agenticResult.validatorName).toBe('Agentic CIS Benchmark Validator');
            expect(agenticResult.reports[0].passed).toBe(false);
            expect(agenticResult.reports[0].issues[0].severity).toBe('warning');
            expect(mockValidate).toHaveBeenCalledTimes(1);
        });

        it('should run a hybrid pipeline with both standard and agentic validators', async () => {
            jest.resetModules();
            const mockValidate = jest.fn().mockResolvedValue([
              {
                policyIndex: 0,
                passed: false,
                severity: 'warning',
                reason: 'Mocked agentic response: Variable requires review.',
              },
            ]);
            jest.doMock('../llm/LlmService', () => ({
              LlmService: jest.fn().mockImplementation(() => ({ validate: mockValidate })),
            }));

            const { ValidationPipeline } = require('../validators/ValidationPipeline');
            const { OciCisBenchmarkValidator } = require('../validators/OciCisBenchmarkValidator');
            const { AgenticOciCisBenchmarkValidator } = require('../validators/AgenticOciCisBenchmarkValidator');
            const { mockLogger } = require('./fixtures/test-utils');
            const { ValidationOptions } = require('../types');

            const statements = [
              // This WILL violate CIS-OCI-1.2 (non-admin group with broad permissions)
              'Allow group Developers to manage all-resources in tenancy', 
              'Allow group ${var.db_group} to manage database-family in compartment Prod',
            ];

            const options: typeof ValidationOptions = {
              agenticValidation: {
                enabled: true,
                provider: 'openai',
                apiKey: 'test-key',
              },
            };

            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(new OciCisBenchmarkValidator(mockLogger));
            pipeline.addValidator(
              new AgenticOciCisBenchmarkValidator(mockLogger),
            );

            const results = await pipeline.validate(statements, options);

            expect(results).toHaveLength(2);

            const cisResult = results.find(
              (r: { validatorName: string; }) => r.validatorName === 'OCI CIS Benchmark Validator',
            );
            const agenticResult = results.find(
              (r: { validatorName: string; }) => r.validatorName === 'Agentic CIS Benchmark Validator',
            );

            expect(cisResult).toBeDefined();
            
            // Find the specific CIS-OCI-1.2 report 
            const cisOci12Report = cisResult!.reports.find((report: { checkId: string }) => report.checkId === 'CIS-OCI-1.2');
            expect(cisOci12Report).toBeDefined();
            expect(cisOci12Report!.passed).toBe(false);
            expect(cisOci12Report!.issues[0].checkId).toBe('CIS-OCI-1.2');

            expect(agenticResult).toBeDefined();
            expect(agenticResult!.reports[0].passed).toBe(false);
            expect(agenticResult!.reports[0].issues[0].severity).toBe('warning');
            expect(mockValidate).toHaveBeenCalledTimes(1);
        });

        it('should handle hybrid policies (static and variable-based) with the agentic validator', async () => {
            // Spy on LlmService.validate to mock the LLM call without resetting all modules.
            // This is a more stable approach than jest.doMock().
            const mockLlmValidate = jest
              .spyOn(LlmService.prototype, 'validate')
              .mockResolvedValue([
                {
                  policyIndex: 0, // The LLM only sees the policy with the variable.
                  passed: false,
                  severity: 'warning',
                  reason: 'Mocked agentic response: Variable requires review.',
                },
              ]);
      
            const {
              AgenticOciCisBenchmarkValidator,
            } = require('../validators/AgenticOciCisBenchmarkValidator');
            const { ValidationPipeline } = require('../validators/ValidationPipeline');
            const { ValidationOptions } = require('../types');
      
            const statements = [
              'Allow group Developers to manage all-resources in tenancy', // This WILL violate CIS-OCI-1.2
              'Allow group ${var.db_group} to manage database-family in compartment Prod', // Variable policy for the LLM
            ];
      
            const options: typeof ValidationOptions = {
              agenticValidation: {
                enabled: true,
                provider: 'openai',
                apiKey: 'test-key',
              },
            };
      
            // A correct hybrid pipeline contains ONLY the agentic validator.
            const pipeline = new ValidationPipeline(mockLogger);
            pipeline.addValidator(new AgenticOciCisBenchmarkValidator(mockLogger));
      
            const results = await pipeline.validate(statements, options);
      
            // The pipeline ran one validator, so it should produce one result object.
            expect(results).toHaveLength(1);
            const agenticResult = results[0];
            expect(agenticResult.validatorName).toBe(
              'Agentic CIS Benchmark Validator',
            );
      
            // The overall result for this validator should be 'false' because issues were found.
            expect(agenticResult.reports[0].passed).toBe(false);
            // The agentic validator should find at least one issue (from the LLM analysis)
            expect(agenticResult.reports[0].issues.length).toBeGreaterThanOrEqual(1);
      
            // Find and verify the issue from the mocked LLM response.
            const llmIssue = agenticResult.reports[0].issues.find(
              (i: { severity: string }) => i.severity === 'warning',
            );
            expect(llmIssue).toBeDefined();
            expect(llmIssue?.message).toContain('Mocked agentic response');
      
            // Clean up the spy to avoid affecting other tests.
            mockLlmValidate.mockRestore();
          });
  });
});
