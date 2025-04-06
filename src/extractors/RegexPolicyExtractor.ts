import { PolicyExtractor } from './PolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';
import { POLICY_STATEMENTS_REGEX } from '../types';

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;
    private extractionStrategy: ExtractionStrategy;

    constructor(pattern?: string, extractionStrategy?: ExtractionStrategy) {
        // Use existing pattern from types.ts or build a new one from the provided pattern
        this.pattern = pattern 
            ? new RegExp(pattern, 'sgi')
            : POLICY_STATEMENTS_REGEX;
        
        this.extractionStrategy = extractionStrategy || new DefaultExtractionStrategy();
    }

    extract(text: string): string[] {
        if (!text || text.trim() === '') {
            return [];
        }
        
        // With global flag, matchAll returns an iterator of all matches
        const matches = Array.from(text.matchAll(this.pattern));
        if (!matches || matches.length === 0) {
            return [];
        }

        // Get raw statements from regex matches and delegate all processing to the strategy
        return matches
            .map(match => match[1])  // Get capturing group from each match
            .filter(Boolean)         // Remove any undefined/null matches
            .flatMap(statement => this.extractionStrategy.extractStatements(statement))
            .filter(s => s && s.trim() !== '');
    }

    name(): string {
        return 'regex';
    }
}
