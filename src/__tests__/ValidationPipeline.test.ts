import { ValidationPipeline } from '../validators/ValidationPipeline';
import { PolicyValidator, ValidationCheck, ValidationReport } from '../validators/PolicyValidator';
import { Logger } from '../types';

// Mock logger for testing
const testLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock validator implementation
class MockValidator implements PolicyValidator {
  private shouldFail: boolean;
  private name_: string;
  
  constructor(name: string, shouldFail: boolean = false) {
    this.name_ = name;
    this.shouldFail = shouldFail;
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
        id: 'MOCK-001',
        name: 'Mock Test',
        description: 'Test check for validation pipeline'
      }
    ];
  }
  
  async validate(statements: string[]): Promise<ValidationReport[]> {
    if (this.shouldFail) {
      return [{
        checkId: 'MOCK-001',
        name: 'Mock Test',
        description: 'Test check for validation pipeline',
        passed: false,
        issues: [{
          checkId: 'MOCK-001',
          statement: statements[0] || '',
          message: 'Mock validation failure',
          severity: 'error'
        }]
      }];
    }
    
    return [{
      checkId: 'MOCK-001',
      name: 'Mock Test',
      description: 'Test check for validation pipeline',
      passed: true,
      issues: []
    }];
  }
}

// Mock validator that throws exceptions
class ErrorValidator implements PolicyValidator {
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
    throw new Error('Mock validation error');
  }
}

describe('ValidationPipeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should run validators in sequence', async () => {
    const pipeline = new ValidationPipeline(testLogger);
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
    
    expect(testLogger.info).toHaveBeenCalledWith('Running validation pipeline with 2 validators');
  });
  
  test('should handle validator failures', async () => {
    const pipeline = new ValidationPipeline(testLogger);
    const validator1 = new MockValidator('Validator1', true); // This validator will fail
    
    pipeline.addValidator(validator1);
    
    const statements = ['Allow group Admins to manage all-resources in tenancy'];
    const results = await pipeline.validate(statements);
    
    expect(results).toHaveLength(1);
    expect(results[0].reports[0].passed).toBe(false);
    expect(results[0].reports[0].issues).toHaveLength(1);
    expect(results[0].reports[0].issues[0].message).toBe('Mock validation failure');
  });
  
  test('should handle validator errors gracefully', async () => {
    const pipeline = new ValidationPipeline(testLogger);
    const validator1 = new ErrorValidator();
    const validator2 = new MockValidator('Validator2');
    
    pipeline.addValidator(validator1);
    pipeline.addValidator(validator2);
    
    const statements = ['Allow group Admins to manage all-resources in tenancy'];
    const results = await pipeline.validate(statements);
    
    // Should still get results from the second validator
    expect(results).toHaveLength(1);
    expect(results[0].validatorName).toBe('Validator2');
    
    // Should log error for the first validator
    expect(testLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error running validator ErrorValidator')
    );
  });
  
  test('should return empty array when no validators are added', async () => {
    const pipeline = new ValidationPipeline();
    const results = await pipeline.validate(['test']);
    
    expect(results).toEqual([]);
  });

  test('should return empty array when there are no statements', async () => {
    const pipeline = new ValidationPipeline(testLogger);
    // even with validators registered, no statements => no reports
    pipeline.addValidator(new MockValidator('Validator1'));
    const results = await pipeline.validate([]);
    expect(results).toEqual([]);
  });

  test('validators should be chainable', () => {
    const pipeline = new ValidationPipeline();
    const validator1 = new MockValidator('Validator1');
    const validator2 = new MockValidator('Validator2');
    
    const result = pipeline
      .addValidator(validator1)
      .addValidator(validator2);
      
    expect(result).toBe(pipeline);
  });
});
