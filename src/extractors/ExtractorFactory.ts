import { PolicyExtractor } from './PolicyExtractor';
import { RegexPolicyExtractor } from './RegexPolicyExtractor';
import { AntlrHclPolicyExtractor } from './AntlrHclPolicyExtractor';
import { StatementListPostProcessor } from './StatementListPostProcessor';

export type ExtractorType = 'regex' | 'json' | 'antlr-hcl';

export class ExtractorFactory {
    /**
     * Creates a policy extractor by type.
     *
     * Note: `statementListPostProcessor` only applies to the `regex` extractor.
     */
    static create(
        type: ExtractorType = 'regex',
        options?: { pattern?: string; statementListPostProcessor?: StatementListPostProcessor }
    ): PolicyExtractor {
        switch (type) {
            case 'regex':
                return new RegexPolicyExtractor(options?.pattern, options?.statementListPostProcessor);
            case 'antlr-hcl':
                return new AntlrHclPolicyExtractor();
            default:
                throw new Error(`Unsupported extractor type: ${type}`);
        }
    }
}
