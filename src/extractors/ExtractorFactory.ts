import { PolicyExtractor } from './PolicyExtractor';
import { RegexPolicyExtractor } from './RegexPolicyExtractor';

export type ExtractorType = 'regex' | 'json';

export class ExtractorFactory {
    static create(type: ExtractorType = 'regex', options?: { pattern?: string }): PolicyExtractor {
        switch (type) {
            case 'regex':
                return new RegexPolicyExtractor(options?.pattern);
            default:
                throw new Error(`Unsupported extractor type: ${type}`);
        }
    }
}
