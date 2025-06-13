import { ValidationPipeline } from '../validators/ValidationPipeline';
import { PolicyValidator, ValidationCheck, ValidationReport } from '../validators/PolicyValidator';
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
  
  constructor(name: string, shouldFail: boolean = false, delay: number = 0) {
    this.name_ = name;
    this.shouldFail = shouldFail;
    this.delay = delay;
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
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
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
        issues: [{
          checkId: `MOCK-${this.name_}-001`,
          statement: statements[0] || '',
          message: `Mock validation failure from ${this.name_}`,
          severity: 'error'
        }]
      }];
    }
    
    return [{
      checkId: `MOCK-${this.name_}-001`,
      name: `Mock Test for ${this.name_}`,
      description: 'Test check for validation pipeline',
      passed: true,
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
      const validator1 = new ErrorValidator('Test error message');
      const validator2 = new MockValidator('Validator2');
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      
      const statements = ['Allow group Admins to manage all-resources in tenancy'];
      const results = await pipeline.validate(statements);
      
      // Should still get results from the second validator
      expect(results).toHaveLength(1);
      expect(results[0].validatorName).toBe('Validator2');
      
      // Should log error for the first validator
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error running validator ErrorValidator: Test error message')
      );
    });

    it('should handle multiple validator errors', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validator1 = new ErrorValidator('Error 1');
      const validator2 = new ErrorValidator('Error 2');
      const validator3 = new MockValidator('WorkingValidator');
      
      pipeline.addValidator(validator1);
      pipeline.addValidator(validator2);
      pipeline.addValidator(validator3);
      
      const statements = ['test statement'];
      const results = await pipeline.validate(statements);
      
      // Should only get results from working validator
      expect(results).toHaveLength(1);
      expect(results[0].validatorName).toBe('WorkingValidator');
      
      // Should log both errors
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error running validator ErrorValidator: Error 1')
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error running validator ErrorValidator: Error 2')
      );
    });

    it('should continue pipeline execution after individual validator errors', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const validators = [
        new MockValidator('Success1'),
        new ErrorValidator('Failed validator'),
        new MockValidator('Success2'),
        new ErrorValidator('Another failed validator'),
        new MockValidator('Success3')
      ];
      
      validators.forEach(v => pipeline.addValidator(v));
      
      const results = await pipeline.validate(['test']);
      
      // Should get results from successful validators only
      expect(results).toHaveLength(3);
      expect(results.map(r => r.validatorName)).toEqual(['Success1', 'Success2', 'Success3']);
    });
  });

  describe('Performance and Concurrency', () => {
    it('should handle validators with different execution times', async () => {
      const pipeline = new ValidationPipeline(mockLogger);
      const fastValidator = new MockValidator('Fast', false, 10);
      const slowValidator = new MockValidator('Slow', false, 100);
      const instantValidator = new MockValidator('Instant', false, 0);
      
      pipeline.addValidator(slowValidator);
      pipeline.addValidator(fastValidator);
      pipeline.addValidator(instantValidator);
      
      const startTime = Date.now();
      const results = await pipeline.validate(['test statement']);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(3);
      expect(duration).toBeGreaterThanOrEqual(100); // Should wait for slowest validator
      
      // Should maintain order regardless of execution time
      expect(results[0].validatorName).toBe('Slow');
      expect(results[1].validatorName).toBe('Fast');
      expect(results[2].validatorName).toBe('Instant');
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
});
    

