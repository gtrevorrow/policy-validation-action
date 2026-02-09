import { AntlrHclPolicyExtractor } from '../extractors/AntlrHclPolicyExtractor';
import * as fs from 'fs';
import * as path from 'path';

describe('AntlrHclPolicyExtractor Variable Resolution', () => {
    const extractor = new AntlrHclPolicyExtractor();

    it('should resolve variable references in same file', () => {
        const fixturePath = path.join(__dirname, 'fixtures', 'repro_variable.tf');
        const content = fs.readFileSync(fixturePath, 'utf8');

        const statements = extractor.extract(content);

        // Should find 3 statements total:
        // 1 from var.common_policies in "test"
        // 1 from var.common_policies in "test_mixed"
        // 1 explicit string in "test_mixed"
        expect(statements).toHaveLength(3);
        expect(statements).toContain("Allow group Administrators to manage all-resources in tenancy");
        expect(statements).toContain("Allow group Users to use all-resources in tenancy");
    });

    it('should resolve variable traversal with index literal', () => {
        const fixturePath = path.join(__dirname, 'fixtures', 'repro_variable_traversal.tf');
        const content = fs.readFileSync(fixturePath, 'utf8');

        const statements = extractor.extract(content);

        expect(statements).toHaveLength(1);
        expect(statements).toContain("Allow group Admins to manage all-resources in tenancy");
    });

    it('should resolve variable traversal with attribute access', () => {
        const fixturePath = path.join(__dirname, 'fixtures', 'repro_variable_object.tf');
        const content = fs.readFileSync(fixturePath, 'utf8');

        const statements = extractor.extract(content);

        expect(statements).toHaveLength(1);
        expect(statements).toContain("Allow group Admins to manage all-resources in tenancy");
    });
});
