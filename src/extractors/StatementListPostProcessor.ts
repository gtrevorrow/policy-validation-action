/**
 * Post-processes a raw "statement list" value extracted from some source (e.g., a regex capture group)
 * into individual normalized policy statements.
 *
 * This is intentionally narrower than `PolicyExtractor`: it does not scan the full input for policies.
 */
export interface StatementListPostProcessor {
    extractStatements(raw: string): string[];
}

