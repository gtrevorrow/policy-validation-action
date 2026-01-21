import { ValidationContext, CompartmentNode } from './ValidationContext';

export interface CompartmentInput {
    name: string;
    parent?: string; // parent OCID
    description?: string;
}

export interface HierarchyInput {
    compartments: Record<string, CompartmentInput>;
}

/**
 * Adapts a raw JSON hierarchy structure into a ValidationContext.
 */
export class ContextAdapter implements ValidationContext {
    private compartmentsByOcid: Map<string, CompartmentNode> = new Map();
    private compartmentsByName: Map<string, string> = new Map(); // name -> ocid

    constructor(input: HierarchyInput) {
        this.buildIndex(input);
    }

    private buildIndex(input: HierarchyInput) {
        for (const [ocid, data] of Object.entries(input.compartments)) {
            const node: CompartmentNode = {
                ocid,
                name: data.name,
                parentOcid: data.parent
            };
            this.compartmentsByOcid.set(ocid, node);
            this.compartmentsByName.set(data.name, ocid);
        }
    }

    getCompartment(identifier: string): CompartmentNode | undefined {
        // Try direct OCID match
        if (this.compartmentsByOcid.has(identifier)) {
            return this.compartmentsByOcid.get(identifier);
        }
        // Try name match
        const ocidFromName = this.compartmentsByName.get(identifier);
        if (ocidFromName) {
            return this.compartmentsByOcid.get(ocidFromName);
        }
        return undefined;
    }

    getAncestry(ocid: string): CompartmentNode[] {
        const path: CompartmentNode[] = [];
        let currentOcid: string | undefined = ocid;

        const visited = new Set<string>();

        while (currentOcid) {
            if (visited.has(currentOcid)) {
                // cycle detection
                break;
            }
            visited.add(currentOcid);

            const node = this.compartmentsByOcid.get(currentOcid);
            if (!node) {
                break;
            }
            path.push(node);
            currentOcid = node.parentOcid;
        }

        return path;
    }

    isAncestor(possibleAncestorOcid: string, childOcid: string): boolean {
        const ancestry = this.getAncestry(childOcid);
        // Exclude self (strict ancestor check)? 
        // Logic in policy_rules.py seemed to imply "ancestor of attachment", 
        // usually strictly higher for "subtree scopes", but let's check definitions.
        // Usually is_ancestor implies strict.

        // Let's assume strict if they are not the same OCID.
        if (possibleAncestorOcid === childOcid) return false;

        return ancestry.some(node => node.ocid === possibleAncestorOcid);
    }
}
