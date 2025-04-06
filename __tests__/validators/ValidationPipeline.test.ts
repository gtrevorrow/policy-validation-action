import { ValidationPipeline } from '../../src/validators/ValidationPipeline';
import { PolicyValidator, ValidationCheck, ValidationReport } from '../../src/validators/PolicyValidator';
import { Logger } from '../../src/types';

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
  
  // ...existing code...
});