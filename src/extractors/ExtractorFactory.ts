import { PolicyExtractor } from './PolicyExtractor';
import { RegexPolicyExtractor } from './RegexPolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';

export type ExtractorType = 'regex' | 'json';

export class ExtractorFactory {
    static create(type: ExtractorType = 'regex', options?: { pattern?: string, extractionStrategy?: ExtractionStrategy }): PolicyExtractor {
        switch (type) {
            case 'regex':
                return new RegexPolicyExtractor(options?.pattern, options?.extractionStrategy);
            default:
                throw new Error(`Unsupported extractor type: ${type}`);
        }
    }
}
