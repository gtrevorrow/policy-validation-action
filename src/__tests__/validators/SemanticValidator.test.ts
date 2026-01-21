import { SemanticValidator } from '../../validators/SemanticValidator';
import { ValidationContext, CompartmentNode } from '../../validators/context/ValidationContext';
import { ValidationIssue } from '../../validators/PolicyValidator';

class MockContext implements ValidationContext {
    private compartments: Map<string, CompartmentNode> = new Map();

    constructor() {
        this.add('root', 'Root Compartment');
        this.add('compA', 'Compartment A', 'root');
        this.add('compB', 'Compartment B', 'compA');
        this.add('compC', 'Compartment C', 'compB'); // Depth 3 from root
        this.add('compD', 'Compartment D', 'compC'); // Depth 4
    }

    add(ocid: string, name: string, parent?: string) {
        this.compartments.set(ocid, { ocid, name, parentOcid: parent });
    }

    getCompartment(identifier: string) {
        if (this.compartments.has(identifier)) return this.compartments.get(identifier);
        for (const c of this.compartments.values()) {
            if (c.name === identifier) return c;
        }
        return undefined;
    }

    getAncestry(ocid: string) {
        const path: CompartmentNode[] = [];
        let curr = this.getCompartment(ocid);
        while (curr) {
            path.push(curr);
            curr = curr.parentOcid ? this.getCompartment(curr.parentOcid) : undefined;
        }
        return path;
    }

    isAncestor(ancestor: string, child: string) {
        const ancestry = this.getAncestry(child);
        return ancestry.some(n => n.ocid === ancestor && n.ocid !== child);
    }
}

describe('SemanticValidator', () => {
    let context: MockContext;
    let validator: SemanticValidator;

    beforeEach(() => {
        context = new MockContext();
        validator = new SemanticValidator(context);
    });

    test('validates valid compartment scope', async () => {
        const statements = ['Allow group Admin to read all-resources in compartment compA'];
        const reports = await validator.validate(statements, { attachmentPoint: 'root' });

        expect(reports[0].passed).toBe(true);
        expect(reports[0].issues).toHaveLength(0);
    });

    test('flags invalid scope (SEM-INVALID_SCOPE)', async () => {
        const statements = ['Allow group Admin to manage all-resources in compartment InvalidComp'];
        const reports = await validator.validate(statements, { attachmentPoint: 'root' });

        expect(reports[0].passed).toBe(false);
        const issue = reports[0].issues.find((i: ValidationIssue) => i.checkId === 'SEM-INVALID_SCOPE');
        expect(issue).toBeDefined();
        expect(issue?.message).toContain('not found in hierarchy');
    });

    test('flags hierarchy mismatch (SEM-HIERARCHY_MISMATCH)', async () => {
        // Attached to compB, but tries to scope to compA (parent)
        const statements = ['Allow group Admin to manage all-resources in compartment compA'];
        const reports = await validator.validate(statements, { attachmentPoint: 'compB' });

        expect(reports[0].passed).toBe(false);
        const issue = reports[0].issues.find((i: ValidationIssue) => i.checkId === 'SEM-HIERARCHY_MISMATCH');
        expect(issue).toBeDefined();
        expect(issue?.message).toContain('not under attachment');
    });

    test('flags deny depth deviation (SEM-DENY_DEPTH)', async () => {
        // Attached to compD (depth 4)
        const statements = ['Deny group BadActors to use all-resources in compartment compD'];
        const reports = await validator.validate(statements, { attachmentPoint: 'compD' });

        // Depth logic: compD -> compC -> compB -> compA -> root. Length = 5. Limit > 3.
        expect(reports[0].passed).toBe(false);
        const issue = reports[0].issues.find((i: ValidationIssue) => i.checkId === 'SEM-DENY_DEPTH');
        expect(issue).toBeDefined();
    });

    test('flags over-permissioned (SEM-OVER_PERMISSIONED)', async () => {
        const statements = ['Allow group Admin to manage all-resources in tenancy'];
        const reports = await validator.validate(statements, { attachmentPoint: 'root' });

        // Should warn
        const issue = reports[0].issues.find((i: ValidationIssue) => i.checkId === 'SEM-OVER_PERMISSIONED');
        expect(issue).toBeDefined();
        expect(issue?.severity).toBe('warning');
    });
});
