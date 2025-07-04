import * as fs from 'fs';
import * as path from 'path';
import {
  Logger,
  LlmValidationResponse,
  ValidationOptions,
  ValidationReport,
} from '../types';
import { PolicyValidator, ValidationCheck } from './PolicyValidator';

/**
 * A validator that uses an LLM agent to check for CIS compliance.
 * It focuses on policies containing HCL variables, which are difficult for
 * traditional parsers to analyze definitively. It sends all policies in a
 * single batch to allow for holistic analysis.
 */
export class AgenticOciCisBenchmarkValidator implements PolicyValidator {
  private readonly logger: Logger;
  private readonly knowledgeContent: string;

  constructor(logger: Logger) {
    this.logger = logger;
    // Load the knowledge base once during initialization for efficiency.
    this.knowledgeContent = fs.readFileSync(
      path.join(__dirname, '../../knowledge/oci_iam_knowledge_base.md'),
      'utf-8',
    );
    this.logger.info('Agentic validator initialized with knowledge base.');
  }

  name(): string {
    return 'Agentic CIS Benchmark Validator';
  }

  description(): string {
    return 'Performs a holistic compliance check on policies with variables using an AI agent.';
  }

  getChecks(): ValidationCheck[] {
    // The agentic validator performs a single, holistic check.
    return [
      {
        id: 'CIS-AGENTIC-1',
        name: 'Agentic CIS Compliance Check',
        description:
          'Holistic compliance check for policies with variables, performed by an AI agent.',
      },
    ];
  }

  async validate(
    statements: string[],
    options: ValidationOptions = {},
  ): Promise<ValidationReport[]> {
    const policiesWithVariables = statements.filter(
      s => s && s.includes('${var.'),
    );

    if (policiesWithVariables.length === 0) {
      this.logger.info(
        'No policies with variables found for agentic validation.',
      );
      return [];
    }

    this.logger.info(
      `Sending ${policiesWithVariables.length} policies for agentic validation.`,
    );

    // In a real implementation, this would make an API call to an LLM.
    // For now, we will return a mock response to demonstrate the flow.
    const mockLlmResponses: LlmValidationResponse[] = policiesWithVariables.map(
      (policy, index) => ({
        policyIndex: index,
        passed: false,
        severity: 'warning',
        reason: `Policy "${policy}" contains variables and requires manual review. The agent has flagged this for caution based on CIS benchmarks.`,
      }),
    );

    return [this.parseResponse(mockLlmResponses, policiesWithVariables)];
  }

  private parseResponse(
    responses: LlmValidationResponse[],
    originalPolicies: string[],
  ): ValidationReport {
    const allPassed = responses.every(r => r.passed);
    return {
      checkId: 'CIS-AGENTIC-1',
      name: 'Agentic CIS Compliance Check',
      description: 'Holistic compliance check performed by an AI agent.',
      passed: allPassed,
      status: allPassed ? 'pass' : 'fail',
      issues: responses
        .filter(r => !r.passed)
        .map(r => ({
          checkId: 'CIS-AGENTIC-1',
          statement: originalPolicies[r.policyIndex],
          message: r.reason,
          severity: r.severity,
          recommendation:
            "Review the policy based on the agent's reasoning and verify variable contents.",
        })),
    };
  }
}