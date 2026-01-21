export interface CompartmentNode {
    ocid: string;
    name: string;
    parentOcid?: string;
}

/**
 * Provides context about the organizational structure (compartments, hierarchy)
 * required for semantic policy validation.
 */
export interface ValidationContext {
    /**
     * Resolves a compartment by its name or OCID.
     * @param identifier The name or OCID of the compartment.
     */
    getCompartment(identifier: string): CompartmentNode | undefined;

    /**
     * Returns the ancestry path from the given compartment up to the root (inclusive).
     * The first element is the node itself, the last is the root.
     * @param ocid The OCID of the compartment to start from.
     */
    getAncestry(ocid: string): CompartmentNode[];

    /**
     * Checks if `possibleAncestorOcid` is strictly an ancestor of `childOcid`.
     * @param possibleAncestorOcid The OCID of the potential ancestor.
     * @param childOcid The OCID of the child compartment.
     */
    isAncestor(possibleAncestorOcid: string, childOcid: string): boolean;
}
