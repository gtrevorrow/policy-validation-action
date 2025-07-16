import {
  ValidationIssue,
  ValidationOptions,
  shouldPassWithValidatorConfig,
} from '../validators/PolicyValidator';

describe('Per-Validator Warning Configuration', () => {
  const validatorName = 'TestValidator';
  const warningIssue: ValidationIssue = {
    checkId: 'test-check',
    statement: 'test statement',
    message: 'This is a warning.',
    severity: 'warning',
  };

  const errorIssue: ValidationIssue = {
    checkId: 'test-check',
    statement: 'test statement',
    message: 'This is an error.',
    severity: 'error',
  };

  it('should pass with warnings if no config is provided', () => {
    const { passed, status, issues } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      {}
    );
    expect(passed).toBe(true);
    expect(status).toBe('pass-with-warnings');
    expect(issues[0].severity).toBe('warning');
  });

  it('should fail if treatWarningsAsFailures is true globally', () => {
    const options: ValidationOptions = { treatWarningsAsFailures: true };
    const { passed, status } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      options
    );
    expect(passed).toBe(false);
    expect(status).toBe('pass-with-warnings');
  });

  it('should pass if validator-specific config overrides global treatWarningsAsFailures to false', () => {
    const options: ValidationOptions = {
      treatWarningsAsFailures: true,
      validatorWarningConfig: {
        [validatorName]: { treatWarningsAsFailures: false },
      },
    };
    const { passed, status } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      options
    );
    expect(passed).toBe(true);
    expect(status).toBe('pass-with-warnings');
  });

  it('should fail if validator-specific config overrides global treatWarningsAsFailures to true', () => {
    const options: ValidationOptions = {
      treatWarningsAsFailures: false,
      validatorWarningConfig: {
        [validatorName]: { treatWarningsAsFailures: true },
      },
    };
    const { passed, status } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      options
    );
    expect(passed).toBe(false);
    expect(status).toBe('pass-with-warnings');
  });

  it('should remap warning to error and fail if warningLevel is "error"', () => {
    const options: ValidationOptions = {
      validatorWarningConfig: {
        [validatorName]: { warningLevel: 'error' },
      },
    };
    const { passed, status, issues } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      options
    );
    expect(passed).toBe(false);
    expect(status).toBe('fail');
    expect(issues[0].severity).toBe('error');
  });

  it('should remap warning to info and pass if warningLevel is "info"', () => {
    const options: ValidationOptions = {
      treatWarningsAsFailures: true, // This should be ignored as the warning is remapped
      validatorWarningConfig: {
        [validatorName]: { warningLevel: 'info' },
      },
    };
    const { passed, status, issues } = shouldPassWithValidatorConfig(
      [warningIssue],
      validatorName,
      options
    );
    expect(passed).toBe(true);
    expect(status).toBe('pass');
    expect(issues[0].severity).toBe('info');
  });

  it('should not remap errors even with a warningLevel config', () => {
    const options: ValidationOptions = {
      validatorWarningConfig: {
        [validatorName]: { warningLevel: 'info' },
      },
    };
    const { passed, status, issues } = shouldPassWithValidatorConfig(
      [errorIssue],
      validatorName,
      options
    );
    expect(passed).toBe(false);
    expect(status).toBe('fail');
    expect(issues[0].severity).toBe('error');
  });
});