import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import {
  PolicyValidator,
  ValidationCheck,
  ValidationReport,
  ValidationIssue,
  ValidationOptions,
  shouldPassWithValidatorConfig,
} from './PolicyValidator';
import { Logger } from '../types';
import { PolicyLexer } from '../generated/PolicyLexer';
import { PolicyParser } from '../generated/PolicyParser';
import { ReferenceLookupListener, ReferenceLookupResult } from './ReferenceLookupListener';

export class ReferenceLookupValidator implements PolicyValidator {
  private logger?: Logger;

  private static readonly CHECKS: ValidationCheck[] = [
    {
      id: 'REF-LOOKUP-1',
      name: 'Reference Lookup',
      description: 'Validates that referenced entities exist in provided lookup data',
    },
  ];

  constructor(logger?: Logger) {
    this.logger = logger;
  }

  name(): string {
    return 'Reference Lookup Validator';
  }

  description(): string {
    return 'Validates policy references against known entities (e.g., groups)';
  }

  getChecks(): ValidationCheck[] {
    return ReferenceLookupValidator.CHECKS;
  }

  async validate(
    statements: string[],
    options: ValidationOptions = {},
  ): Promise<ValidationReport[]> {
    const lookup = options.groupLookup;
    if (!lookup) {
      this.logger?.debug('ReferenceLookupValidator: No lookup provided, skipping');
      return [];
    }

    const issues: ValidationIssue[] = [];

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (!trimmed) continue;

      const results = this.analyzeStatement(trimmed);
      results.forEach(result => {
        const groupName = result.name;

        if (result.isHcl) {
          issues.push({
            checkId: 'REF-LOOKUP-1',
            statement: result.statement,
            message: `Group reference '${groupName}' uses an HCL variable and cannot be statically resolved.`,
            recommendation: 'Ensure the variable resolves to a valid group name at runtime.',
            severity: 'warning',
          });
          return;
        }

        if (!this.hasGroup(lookup, groupName)) {
          issues.push({
            checkId: 'REF-LOOKUP-1',
            statement: result.statement,
            message: `Unknown group '${groupName}' referenced in policy.`,
            recommendation: 'Create the group or update the policy to reference an existing group.',
            severity: 'error',
          });
        }
      });
    }

    const { passed, status, issues: finalIssues } = shouldPassWithValidatorConfig(
      issues,
      this.name(),
      options,
    );

    return [
      {
        checkId: 'REF-LOOKUP-1',
        name: this.name(),
        description: this.description(),
        passed,
        status,
        issues: finalIssues,
      },
    ];
  }

  private analyzeStatement(statement: string): ReferenceLookupResult[] {
    const listener = new ReferenceLookupListener(statement);
    const walker = new ParseTreeWalker();

    try {
      const inputStream = CharStreams.fromString(statement);
      const lexer = new PolicyLexer(inputStream);
      const tokenStream = new CommonTokenStream(lexer);
      const parser = new PolicyParser(tokenStream);

      parser.removeErrorListeners();
      const tree = parser.policy();
      walker.walk(listener, tree);
    } catch (error) {
      this.logger?.debug(`ReferenceLookupValidator: Skipping statement due to parse error: ${statement}`);
    }

    return listener.getResults();
  }

  private hasGroup(lookup: any, groupName: string): boolean {
    if (!lookup) return false;

    if (typeof lookup?.has === 'function') {
      return lookup.has(groupName);
    }

    if (Array.isArray(lookup)) {
      return lookup.includes(groupName);
    }

    return false;
  }
}
