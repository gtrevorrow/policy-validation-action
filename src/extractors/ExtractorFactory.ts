import { PolicyExtractor } from './PolicyExtractor';
import { RegexPolicyExtractor } from './RegexPolicyExtractor';
import { AntlrHclPolicyExtractor } from './AntlrHclPolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';

export type ExtractorType = 'regex' | 'json' | 'antlr-hcl';

export class ExtractorFactory {
    static create(type: ExtractorType = 'regex', options?: { pattern?: string, extractionStrategy?: ExtractionStrategy }): PolicyExtractor {
        switch (type) {
            case 'regex':
                return new RegexPolicyExtractor(options?.pattern, options?.extractionStrategy);
            case 'antlr-hcl':
                return new AntlrHclPolicyExtractor();
            default:
                throw new Error(`Unsupported extractor type: ${type}`);
        }
    }
}
