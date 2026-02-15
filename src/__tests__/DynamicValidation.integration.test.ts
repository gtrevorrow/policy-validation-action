
import { ValidatorFactory } from '../validators/ValidatorFactory';
import { mockLogger } from './fixtures/test-utils';
import * as path from 'path';

describe('Dynamic Validator Loading Integration', () => {

    // Path to the fixture validator relative to CWD (since ValidatorLoader uses path.resolve(process.cwd(), identifier))
    // In tests, process.cwd() is usually the project root.
    // The fixture is in src/__tests__/validators/fixtures/CustomTestValidator.ts
    // We need to point to the TS file for ts-node execution, or JS if compiled.
    // simpler approach: use the absolute path for testing
    const fixturePath = path.resolve(__dirname, 'validators/fixtures/CustomTestValidator.ts');

    it('should dynamically load and run a custom local validator by path', async () => {
        const pipeline = await ValidatorFactory.createLocalPipeline(mockLogger, {
            validatorConfig: {
                runLocalValidators: false,
                localValidators: [fixturePath],
                runGlobalValidators: false
            }
        });

        const results = await pipeline.validate(['some statement']);

        expect(results).toHaveLength(1);
        expect(results[0].validatorName).toBe('CustomTestValidator');
        expect(results[0].reports[0].passed).toBe(true);
        expect(results[0].reports[0].checkId).toBe('CUSTOM-1');
    });

    it('should dynamically load and run a custom global validator by path', async () => {
        const pipeline = await ValidatorFactory.createGlobalPipeline(mockLogger, {
            validatorConfig: {
                runLocalValidators: false,
                runGlobalValidators: false,
                globalValidators: [fixturePath]
            }
        });

        const results = await pipeline.validate(['some statement']);

        expect(results).toHaveLength(1);
        expect(results[0].validatorName).toBe('CustomTestValidator');
        expect(results[0].reports[0].passed).toBe(true);
    });

    it('should ignore invalid validator paths gracefully', async () => {
        const pipeline = await ValidatorFactory.createLocalPipeline(mockLogger, {
            validatorConfig: {
                runLocalValidators: false,
                localValidators: ['/path/to/non/existent/validator.ts'],
                runGlobalValidators: false
            }
        });

        const results = await pipeline.validate(['some statement']);
        // Should have 0 results if no validators loaded
        expect(results).toHaveLength(0);
    });

    it('should support mixing built-in names and custom paths', async () => {
        const pipeline = await ValidatorFactory.createLocalPipeline(mockLogger, {
            validatorConfig: {
                runLocalValidators: false,
                localValidators: [
                    'OciSyntaxValidator',
                    fixturePath
                ],
                runGlobalValidators: false
            }
        });

        // OciSyntaxValidator will fail on empty string or invalid syntax
        // CustomTestValidator always passes

        const results = await pipeline.validate(['Invalid Statement']);

        expect(results).toHaveLength(2);

        const syntaxResult = results.find(r => r.validatorName === 'OCI Syntax Validator');
        const customResult = results.find(r => r.validatorName === 'CustomTestValidator');

        expect(syntaxResult).toBeDefined();
        expect(syntaxResult?.reports[0].passed).toBe(false); // Invalid syntax

        expect(customResult).toBeDefined();
        expect(customResult?.reports[0].passed).toBe(true); // Custom always passes
    });
});
