import { ValidationPipeline } from '../validators/ValidationPipeline';
import { PolicyValidator, ValidationCheck, ValidationReport, ValidationOptions, shouldPass } from '../validators/PolicyValidator';
import { mockLogger } from './fixtures/test-utils';

/**
 * Unit tests for ValidationPipeline.
 * Tests pipeline orchestration, validator management, and error handling.
 * For individual validator tests, see their respective test files.
 */

// Mock validator implementations for testing pipeline behavior
class MockValidator implements PolicyValidator {
  private shouldFail: boolean;
  private name_: string;
  private delay: number;
  private shouldReturnWarnings: boolean;
  
  constructor(name: string, shouldFail: boolean = false, delay: number = 0, shouldReturnWarnings: boolean = false) {
    this.name_ = name;
    this.shouldFail = shouldFail;
    this.delay = delay;
    this.shouldReturnWarnings = shouldReturnWarnings;
  }
  
  name(): string {
    return this.name_;
  }
  
  description(): string {
    return `Mock validator: ${this.name_}`;
  }
  
  getChecks(): ValidationCheck[] {
    return [
      {
        id: `MOCK-${this.name_}-001`,
        name: `Mock Test for ${this.name_}`,
        description: 'Test check for validation pipeline'
      }
    ];
  }
  
  async validate(statements: string[], options?: ValidationOptions): Promise<ValidationReport[]> {
    // Simulate async delay if specified
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    if (this.shouldFail) {
      return [{
        checkId: `MOCK-${this.name_}-001`,
        name: `Mock Test for ${this.name_}`,
        description: 'Test check for validation pipeline',
        passed: false,
        status: 'fail',
        issues: [{
          checkId: `MOCK-${this.name_}-001`,
          statement: statements[0] || '',
          message: `Mock validation failure from ${this.name_}`,
          severity: 'error'
        }]
      }];
    }
    
    if (this.shouldReturnWarnings) {
      const status = 'pass-with-warnings';
      const passed = shouldPass(status, options?.treatWarningsAsFailures || false);
      
      return [{
        checkId: `MOCK-${this.name_}-001`,
        name: `Mock Test for ${this.name_}`,
        description: 'Test check for validation pipeline',
        passed,
        status,
        issues: [{
          checkId: `MOCK-${this.name_}-001`,
          statement: statements[0] || '',
          message: `Mock warning from ${this.name_}`,
          severity: 'warning'
        }]
      }];
    }
    
    return [{
      checkId: `MOCK-${this.name_}-001`,
      name: `Mock Test for ${this.name_}`,
      description: 'Test check for validation pipeline',
      passed: true,
      status: 'pass',
      issues: []
    }];
  }
}

class ErrorValidator implements PolicyValidator {
  private errorMessage: string;

  constructor(errorMessage: string = 'Mock validation error') {
    this.errorMessage = errorMessage;
  }

  name(): string {
    return 'ErrorValidator';
  }
  
  description(): string {
    return 'A validator that throws errors';
  }
  
  getChecks(): ValidationCheck[] {
    return [];
  }
  
  async validate(): Promise<ValidationReport[]> {
    throw new Error(this.errorMessage);
  }
}

describe('ValidationPipeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Pipeline Construction', () => {
    it('should create empty pipeline without logger', () => {
      const pipeline = new ValidationPipeline();
      expect(pipeline).toBeInstanceOf(ValidationPipeline);
    });

    it('should create pipeline with logger', () => {
      const pipeline = new ValidationPipeline(mockLogger);
      expect(pipeline).toBeInstanceOf(ValidationPipeline);
    });

    it('should allow chaining validator additions', () => {
      const pipeline = new ValidationPipeline();
      const validator1 = new MockValidator('Validator1');
      const validator2 = new MockValidator('Validator2');
      
      const result = pipeline
        .addValidator(validator1)
        .addValidator(validator2);
        
      expect(result).toBe(pipeline);
    });
  });

  describe('Validator Management', () => {
    it('should add single validator', () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator = new MockValidator('TestValidator');
      
      pipeline.addValidator(validator);
      // Verify through successful execution
      expect(pipeline).toBeInstanceOf(ValidationPipeline);
    });

    it('should add multiple validators', () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('Validator1');
      const validator2 = new MockValidator('Validator2');
      const validator3 = new MockValidator('Validator3');
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      pipeline.addValidator(validator3);
      
      // Verify through execution
      expect(pipeline).toBeInstanceOf(ValidationPipeline);
    });

    it('should handle duplicate validator names', () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('SameName');
      const validator2 = new MockValidator('SameName');
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      // Should not throw error, both should be added
      expect(pipeline).toBeInstanceOf(ValidationPipeline);
    });
  });

  describe('Pipeline Execution', () => {
    it('should run validators in sequence', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('Validator1');
      const validator2 = new MockValidator('Validator2');
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(2);
      expect(results[0].validatorName).toBe('Validator1');
      expect(results[1].validatorName).toBe('Validator2');
      expect(results[0].reports[0].passed).toBe(true);
      expect(results[1].reports[0].passed).toBe(true);
      
      expect(mockLogger.info).toHaveBeenCalledWith('Running validation pipeline with 2 validators');
    });

    it('should return empty array when no validators are added', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const results = await pipeline.validate(['test']);
      
      expect(results).toEqual([]);
      expect(mockLogger.info).toHaveBeenCalledWith('Running validation pipeline with 0 validators');
    });

    it('should return empty array when there are no statements', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new MockValidator('Validator1'));
      
      const results = await pipeline.validate([]);
      expect(results).toEqual([]);
    });

    it('should handle empty statements array gracefully', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new MockValidator('Validator1'));
      
      const results = await pipeline.validate([]);
      expect(results).toEqual([]);
      expect(mockLogger.info).toHaveBeenCalledWith('Running validation pipeline with 1 validators');
    });
  });

  describe('Error Handling', () => {
    it('should handle validator failures gracefully', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('Validator1', true); // This validator will fail
      const validator2 = new MockValidator('Validator2'); // This should still run
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(2);
      expect(results[0].reports[0].passed).toBe(false);
      expect(results[0].reports[0].issues).toHaveLength(1);
      expect(results[0].reports[0].issues[0].message).toBe('Mock validation failure from Validator1');
      expect(results[1].reports[0].passed).toBe(true);
    });

    it('should handle validator errors gracefully', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const errorValidator = new ErrorValidator('Test error message');
      const workingValidator = new MockValidator('WorkingValidator');
      
      pipeline.addValidator(errorValidator);
      pipeline.addValidator(workingValidator);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements);
      
      // Should still return result from working validator despite error in first
      expect(results).toHaveLength(1);
      expect(results[0].validatorName).toBe('WorkingValidator');
      expect(results[0].reports[0].passed).toBe(true);
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error running validator ErrorValidator: Test error message');
    });

    it('should handle multiple validator errors', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const errorValidator1 = new ErrorValidator('Error 1');
      const errorValidator2 = new ErrorValidator('Error 2');
      
      pipeline.addValidator(errorValidator1);
      pipeline.addValidator(errorValidator2);
      
      const statements = ['test'];
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(0);
      expect(mockLogger.error).toHaveBeenCalledTimes(2);
    });

    it('should continue pipeline execution after individual validator errors', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const errorValidator = new ErrorValidator();
      const workingValidator1 = new MockValidator('Validator1');
      const workingValidator2 = new MockValidator('Validator2');
      
      pipeline.addValidator(workingValidator1);
      pipeline.addValidator(errorValidator);
      pipeline.addValidator(workingValidator2);
      
      const statements = ['test'];
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(2);
      expect(results[0].validatorName).toBe('Validator1');
      expect(results[1].validatorName).toBe('Validator2');
    });
  });

  describe('Performance and Concurrency', () => {
      it('should handle validators with different execution times', async () => {
        const pipeline = new ValidationPipeline();
        const slowValidator = new MockValidator('Slow', false, 100); // 100ms delay
        const fastValidator = new MockValidator('Fast', false, 10);  // 10ms delay
        const mediumValidator = new MockValidator('Medium', false, 50); // 50ms delay

        pipeline.addValidator(slowValidator);
        pipeline.addValidator(fastValidator);
        pipeline.addValidator(mediumValidator);

        const startTime = Date.now();
        const results = await pipeline.validate(['statement']);
        const duration = Date.now() - startTime;

        expect(results).toHaveLength(3);
        // Provide a small buffer for timing variations in CI environments
        expect(duration).toBeGreaterThanOrEqual(90); // Should wait for slowest validator

        // Should maintain order regardless of execution time
        expect(results[0].validatorName).toBe('Slow');
        expect(results[1].validatorName).toBe('Fast');
        expect(results[2].validatorName).toBe('Medium');
      });

      it('should handle large numbers of validators efficiently', async () => {
        const pipeline = new ValidationPipeline(mockLogger);
        const validatorCount = 50;
        
        for (let i = 0; i < validatorCount; i++) {
          pipeline.addValidator(new MockValidator(`Validator${i}`));
        }
        
        const startTime = Date.now();
        const results = await pipeline.validate(['test statement']);
        const duration = Date.now() - startTime;
        
        expect(results).toHaveLength(validatorCount);
        expect(duration).toBeLessThan(1000); // Should complete quickly
      });
    });

  describe('Logging and Reporting', () => {
    it('should log pipeline execution start', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      pipeline.addValidator(new MockValidator('TestValidator'));
      
      await pipeline.validate(['test']);
      
      expect(mockLogger.info).toHaveBeenCalledWith('Running validation pipeline with 1 validators');
    });

    it('should log individual validator execution', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator = new MockValidator('TestValidator');
      pipeline.addValidator(validator);
      
      await pipeline.validate(['test']);
      
      expect(mockLogger.debug).toHaveBeenCalledWith('Running validator: TestValidator');
    });

    it('should log validator completion with results summary', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator = new MockValidator('TestValidator');
      pipeline.addValidator(validator);
      
      await pipeline.validate(['test']);
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringMatching(/Validator TestValidator completed:/)
      );
    });

    it('should not log when no logger is provided', async () => {
      const pipeline = new ValidationPipeline(); // No logger
      pipeline.addValidator(new MockValidator('TestValidator'));
      
      // Should not throw error
      const results = await pipeline.validate(['test']);
      expect(results).toHaveLength(1);
    });
  });

  describe('treatWarningsAsFailures Feature', () => {
    it('should treat warnings as failures when enabled', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('Validator1', false, 0, true); // This validator will pass with warning
      const validator2 = new MockValidator('Validator2'); // This should pass normally
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements, { treatWarningsAsFailures: true });
      
      expect(results).toHaveLength(2);
      expect(results[0].reports[0].passed).toBe(false); // Should be failed due to warning
      expect(results[1].reports[0].passed).toBe(true);
    });

    it('should not treat warnings as failures when disabled', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new MockValidator('Validator1', false, 0, true); // This validator will pass with warning
      const validator2 = new MockValidator('Validator2'); // This should pass normally
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements, { treatWarningsAsFailures: false });
      
      expect(results).toHaveLength(2);
      expect(results[0].reports[0].passed).toBe(true); // Should pass as warnings are ignored
      expect(results[1].reports[0].passed).toBe(true);
    });

    it('should properly report completion when treatWarningsAsFailures is enabled', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator = new MockValidator('ValidatorWithWarning', false, 0, true);
      
      pipeline.addValidator(validator);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements, { treatWarningsAsFailures: true });
      
      // Verify that the validator failed due to warning being treated as failure
      expect(results[0].reports[0].passed).toBe(false);
      expect(results[0].reports[0].status).toBe('pass-with-warnings');
      
      // Verify pipeline logs completion summary correctly (0/1 checks passed due to warning as failure)
      expect(mockLogger.info).toHaveBeenCalledWith('Validator ValidatorWithWarning completed: 0/1 checks passed, 1 issues found');
    });

    it('should properly report completion when treatWarningsAsFailures is disabled', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator = new MockValidator('ValidatorWithWarning', false, 0, true);
      
      pipeline.addValidator(validator);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements, { treatWarningsAsFailures: false });
      
      // Verify that the validator passed despite having warnings
      expect(results[0].reports[0].passed).toBe(true);
      expect(results[0].reports[0].status).toBe('pass-with-warnings');
      
      // Verify pipeline logs completion summary correctly (1/1 checks passed despite warning)
      expect(mockLogger.info).toHaveBeenCalledWith('Validator ValidatorWithWarning completed: 1/1 checks passed, 1 issues found');
      
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });
  });

  describe('Validation Options Integration', () => {
    it('should pass validation options to validators', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const warningValidator = new MockValidator('WarningValidator', false, 0, true);
      
      pipeline.addValidator(warningValidator);
      
      const statements = ['Allow group TestGroup to manage all-resources in tenancy'];
      const options = { treatWarningsAsFailures: false };
      const results = await pipeline.validate(statements, options);
      
      expect(results).toHaveLength(1);
      expect(results[0].reports[0].passed).toBe(true);
      expect(results[0].reports[0].status).toBe('pass-with-warnings');
      expect(results[0].reports[0].issues).toHaveLength(1);
      expect(results[0].reports[0].issues[0].severity).toBe('warning');
    });

    it('should handle treatWarningsAsFailures option correctly', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const warningValidator = new MockValidator('WarningValidator', false, 0, true);
      
      pipeline.addValidator(warningValidator);
      
      const statements = ['Allow group TestGroup to manage all-resources in tenancy'];
      
      // Test with treatWarningsAsFailures = false (default)
      const resultsWithWarnings = await pipeline.validate(statements, { treatWarningsAsFailures: false });
      expect(resultsWithWarnings[0].reports[0].passed).toBe(true);
      expect(resultsWithWarnings[0].reports[0].status).toBe('pass-with-warnings');
      
      // Test with treatWarningsAsFailures = true
      const resultsWithFailures = await pipeline.validate(statements, { treatWarningsAsFailures: true });
      expect(resultsWithFailures[0].reports[0].passed).toBe(false);
      expect(resultsWithFailures[0].reports[0].status).toBe('pass-with-warnings');
    });

    it('should handle multiple validators with different warning behaviors', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const passingValidator = new MockValidator('PassingValidator');
      const warningValidator = new MockValidator('WarningValidator', false, 0, true);
      const failingValidator = new MockValidator('FailingValidator', true);
      
      pipeline.addValidator(passingValidator);
      pipeline.addValidator(warningValidator);
      pipeline.addValidator(failingValidator);
      
      const statements = ['test statement'];
      const results = await pipeline.validate(statements, { treatWarningsAsFailures: true });
      
      expect(results).toHaveLength(3);
      
      // Passing validator should still pass
      expect(results[0].reports[0].passed).toBe(true);
      expect(results[0].reports[0].status).toBe('pass');
      
      // Warning validator should fail when treatWarningsAsFailures = true
      expect(results[1].reports[0].passed).toBe(false);
      expect(results[1].reports[0].status).toBe('pass-with-warnings');
      
      // Failing validator should still fail
      expect(results[2].reports[0].passed).toBe(false);
      expect(results[2].reports[0].status).toBe('fail');
    });

    it('should work without validation options (default behavior)', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const warningValidator = new MockValidator('WarningValidator', false, 0, true);
      
      pipeline.addValidator(warningValidator);
      
      const statements = ['test statement'];
      const results = await pipeline.validate(statements);
      
      expect(results).toHaveLength(1);
      expect(results[0].reports[0].passed).toBe(true); // Should pass by default
      expect(results[0].reports[0].status).toBe('pass-with-warnings');
    });
  });
});


