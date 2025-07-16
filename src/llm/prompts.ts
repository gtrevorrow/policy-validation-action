/**
 * Builds the comprehensive prompt for the LLM agent.
 * @param policies - The array of policy statements to validate.
 * @param knowledgeBase - The content of the knowledge base markdown file.
 * @returns The complete prompt string.
 */
export function buildPrompt(policies: string[], knowledgeBase: string): string {
  const policyBlock = policies
    .map((p, i) => `Policy Index ${i}:\n\`\`\`\n${p}\n\`\`\``)
    .join('\n\n');

  return `
You are an expert OCI IAM Policy validator. Your task is to analyze a batch of OCI IAM policies and determine if they comply with the provided CIS benchmark rules. The policies you need to validate are listed below. Some contain HCL variables (e.g., \`\${var.group_name}\`); you must infer the intent and potential risk based on the variable name and the policy's context.

**Knowledge Base & Rules:**

Use the following ANTLR grammar and CIS benchmark rules as your ground truth. 

${knowledgeBase}

**Policies to Validate:**

${policyBlock}

**Instructions:**

Analyze each policy against the CIS benchmark rules in the knowledge base. For each policy, provide a validation result. Your response MUST be a single, valid JSON object containing a key named "results". The value of "results" must be an array of objects, where each object corresponds to a policy you validated. Each object in the array must have the following structure:

- \`policyIndex\`: The original index of the policy you are validating.
- \`passed\`: A boolean indicating if the policy is compliant (\`true\`) or not (\`false\`).
- \`severity\`: A string, either 'info', 'warning', or 'error'. Use 'warning' for potential issues related to variables.
- \`reason\`: A string explaining your reasoning for the validation result.

Example of the required JSON output format:
\`\`\`json
{
  "results": [
    {
      "policyIndex": 0,
      "passed": false,
      "severity": "warning",
      "reason": "This policy uses a variable '\${var.admin_group}' for a high-privilege action. This requires manual verification to ensure the group does not have excessive permissions."
    },
    {
      "policyIndex": 1,
      "passed": true,
      "severity": "info",
      "reason": "This policy is compliant."
    }
  ]
}
\`\`\`

Provide only the JSON object in your response.
`;
}

/**
 * Builds an alternate, more detailed prompt for the LLM agent with explicit OCI IAM policy structure guidance.
 * @param policies - The array of policy statements to validate.
 * @param knowledgeBase - The content of the knowledge base markdown file.
 * @returns The complete prompt string with detailed OCI IAM policy structure information.
 */
export function buildAlternatePrompt(policies: string[], knowledgeBase: string): string {
  const policyBlock = policies
    .map((p, i) => `Policy Index ${i}:\n\`\`\`\n${p}\n\`\`\``)
    .join('\n\n');

  return `
You are an expert in Oracle OCI IAM policy validation. Below is an OCI IAM policy and relevant OCI CIS v2 Benchmark control descriptions. Your task is to evaluate whether the policy violates any of the listed controls, paying special attention to HCL variable interpolations (e.g., \${var.resource}, \${var.target_tenancy}).

**Policies**:
${policyBlock}

**CIS Benchmark Controls**:
${knowledgeBase}

**Instructions**:
- OCI IAM policies use three verbs:
  - 'allow <principal> to <verb> <resource> [in <compartment>] [where <condition>]': Grants permissions within the same tenancy.
  - 'endorse <principal> to <verb> <resource> in tenancy <tenancy>': Allows a principal to access resources in another tenancy, subject to the target tenancy's admit policy.
  - 'admit <principal> of tenancy <tenancy> to <verb> <resource> in <compartment>': Grants access to resources for a principal endorsed by another tenancy.
- HCL variables (e.g., \${var.resource}, \${var.target_tenancy}) may represent dynamic values. If unresolved, assume they could evaluate to any resource (including '*') or any tenancy, and assess worst-case compliance.
- Analyze each policy for violations of the CIS controls, focusing on:
  - Overly permissive actions (e.g., 'manage' on 'all-resources' or broad tenancy access).
  - Unrestricted compartments in allow or admit policies.
  - Broad cross-tenancy access in endorse or admit policies.

**Output Format**:
For each policy, provide a validation result. Your response MUST be a single, valid JSON object containing a key named "results". The value of "results" must be an array of objects, where each object corresponds to a policy you validated. Each object in the array must have the following structure:

- \`policyIndex\`: The original index of the policy you are validating.
- \`passed\`: A boolean indicating if the policy is compliant (\`true\`) or not (\`false\`).
- \`severity\`: A string, either 'info', 'warning', or 'error'. Use 'warning' for potential issues related to variables.
- \`reason\`: A string explaining your reasoning for the validation result.

Example of the required JSON output format:
\`\`\`json
{
  "results": [
    {
      "policyIndex": 0,
      "passed": false,
      "severity": "warning",
      "reason": "This policy uses a variable '\${var.admin_group}' for a high-privilege action. This requires manual verification to ensure the group does not have excessive permissions."
    },
    {
      "policyIndex": 1,
      "passed": true,
      "severity": "info",
      "reason": "This policy is compliant."
    }
  ]
}
\`\`\`

Provide only the JSON object in your response.
`;
}