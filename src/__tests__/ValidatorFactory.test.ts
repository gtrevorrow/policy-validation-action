import { ValidatorFactory } from '../validators/ValidatorFactory';
import { OciSyntaxValidator } from '../validators/OciSyntaxValidator';
import { OciCisBenchmarkValidator } from '../validators/OciCisBenchmarkValidator';
import { ValidationPipeline } from '../validators/ValidationPipeline';
import { mockLogger } from './fixtures/test-utils';

/**
 * Unit tests for ValidatorFactory.
 * Tests factory methods and pipeline creation.
 * For detailed validator behavior tests, see individual validator test files.
 */
describe('ValidatorFactory', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Individual Validator Creation', () => {
        it('should create an OciSyntaxValidator instance', () => {
            const validator = ValidatorFactory.createSyntaxValidator(mockLogger);
            expect(validator).toBeInstanceOf(OciSyntaxValidator);
            expect(validator.name()).toBe('OCI Syntax Validator');
        });

        it('should create an OciCisBenchmarkValidator instance', () => {
            const validator = ValidatorFactory.createCisBenchmarkValidator(mockLogger);
            expect(validator).toBeInstanceOf(OciCisBenchmarkValidator);
            expect(validator.name()).toBe('OCI CIS Benchmark Validator');
        });
    });

    describe('Validator Collections', () => {
        it('should return local validators collection', () => {
            const validators = ValidatorFactory.createLocalValidators(mockLogger);
            expect(validators).toHaveLength(1);
            expect(validators[0]).toBeInstanceOf(OciSyntaxValidator);
        });

        it('should return global validators collection', () => {
            const validators = ValidatorFactory.createGlobalValidators({}, mockLogger);
            expect(validators).toHaveLength(1);
            expect(validators[0]).toBeInstanceOf(OciCisBenchmarkValidator);
        });
    });

    describe('Pipeline Creation', () => {
        it('should create a local validation pipeline', () => {
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            expect(pipeline).toBeInstanceOf(ValidationPipeline);
        });

        it('should create a global validation pipeline', () => {
            const pipeline = ValidatorFactory.createGlobalPipeline(mockLogger, {});
            expect(pipeline).toBeInstanceOf(ValidationPipeline);
        });

        it('should create pipelines with different configurations', () => {
            const config1 = { enableDebug: true };
            const config2 = { enableDebug: false };
            
            const pipeline1 = ValidatorFactory.createLocalPipeline(mockLogger, config1);
            const pipeline2 = ValidatorFactory.createLocalPipeline(mockLogger, config2);
            
            expect(pipeline1).toBeInstanceOf(ValidationPipeline);
            expect(pipeline2).toBeInstanceOf(ValidationPipeline);
            expect(pipeline1).not.toBe(pipeline2); // Different instances
        });
    });

    describe('Pipeline Functionality Verification', () => {
        it('should create functional local pipeline that validates syntax', async () => {
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const validPolicies = ['Allow group Administrators to manage all-resources in tenancy'];
            
            const results = await pipeline.validate(validPolicies);
            
            expect(results).toHaveLength(1);
            expect(results[0].validatorName).toBe("OCI Syntax Validator"); 
            expect(results[0].reports).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(true);
        });
        
        it('should create functional global pipeline that validates CIS benchmark', async () => {
            const pipeline = ValidatorFactory.createGlobalPipeline(mockLogger, {});
            const testStatement = 'Allow group Administrators to manage all-resources in tenancy';
            
            const results = await pipeline.validate([testStatement]);
            
            expect(results).toHaveLength(1);
            expect(results[0].validatorName).toBe('OCI CIS Benchmark Validator');
            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.stringContaining('Running validator: OCI CIS Benchmark Validator')
            );
        });

        it('should detect syntax errors through pipeline', async () => {
            const pipeline = ValidatorFactory.createLocalPipeline(mockLogger, {});
            const invalidPolicies = ['Allow BadSyntax manage'];
            
            const results = await pipeline.validate(invalidPolicies);
            
            expect(results).toHaveLength(1);
            expect(results[0].reports[0].passed).toBe(false);
            expect(results[0].reports[0].issues.length).toBeGreaterThan(0);
            expect(results[0].reports[0].issues[0]).toMatchObject({
                statement: expect.any(String),
                message: expect.any(String)
            });
        });
    });

    describe('Factory Method Consistency', () => {
        it('should create validators with consistent interfaces', () => {
            const syntaxValidator = ValidatorFactory.createSyntaxValidator(mockLogger);
            const cisValidator = ValidatorFactory.createCisBenchmarkValidator(mockLogger);
            
            // Both should implement the same interface
            expect(typeof syntaxValidator.name).toBe('function');
            expect(typeof syntaxValidator.description).toBe('function');
            expect(typeof syntaxValidator.getChecks).toBe('function');
            expect(typeof syntaxValidator.validate).toBe('function');
            
            expect(typeof cisValidator.name).toBe('function');
            expect(typeof cisValidator.description).toBe('function');
            expect(typeof cisValidator.getChecks).toBe('function');
            expect(typeof cisValidator.validate).toBe('function');
        });

        it('should create validators with unique metadata', () => {
            const syntaxValidator = ValidatorFactory.createSyntaxValidator(mockLogger);
            const cisValidator = ValidatorFactory.createCisBenchmarkValidator(mockLogger);
            
            expect(syntaxValidator.name()).not.toBe(cisValidator.name());
            expect(syntaxValidator.description()).not.toBe(cisValidator.description());
            expect(syntaxValidator.getChecks().length).not.toBe(cisValidator.getChecks().length);
        });

        it('should handle edge cases in factory methods', () => {
            // Test with null logger (should work with optional logger)
            const validator1 = ValidatorFactory.createSyntaxValidator();
            const validator2 = ValidatorFactory.createCisBenchmarkValidator();
            
            expect(validator1).toBeInstanceOf(OciSyntaxValidator);
            expect(validator2).toBeInstanceOf(OciCisBenchmarkValidator);
            
            // Test with undefined config
            const validators = ValidatorFactory.createGlobalValidators(undefined as any, mockLogger);
            expect(validators).toHaveLength(1);
        });
    });
});
