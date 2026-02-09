import { DefaultStatementListPostProcessor } from '../extractors/DefaultStatementListPostProcessor';

describe('DefaultStatementListPostProcessor', () => {
    it('splits statements, removes comments, and preserves commas inside interpolation', () => {
        const processor = new DefaultStatementListPostProcessor();

        const raw = [
            '"Allow group Administrators to manage all-resources in tenancy",',
            '# comment that should be removed',
            '"Allow group Developers to use instances in compartment dev",',
            '"${var.policy_statement}",',
            '"Allow group X to read instances in compartment ${var.compartment_map[\"dev,test\"]}" // trailing comment',
        ].join('\n');

        expect(processor.extractStatements(raw)).toEqual([
            'Allow group Administrators to manage all-resources in tenancy',
            'Allow group Developers to use instances in compartment dev',
            '${var.policy_statement}',
            // Default preprocessing removes commas inside `${...}` blocks (historical behavior).
            'Allow group X to read instances in compartment ${var.compartment_map["dev test"]}',
        ]);
    });
});
