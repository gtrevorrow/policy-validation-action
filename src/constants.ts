/**
 * Regular expression for extracting policy statements from Terraform files
 * Handles:
 * - Multiline statements
 * - Quoted strings (both single and double quotes)
 * - Variable interpolation ${var.name}
 * - Nested structures
 * - Comments
 */
export const POLICY_STATEMENTS_REGEX = /statements\s*=\s*\[\s*((?:[^[\]]*?(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\$\{(?:[^{}]|\{[^{}]*\})*\})?)*)\s*\]/s;
