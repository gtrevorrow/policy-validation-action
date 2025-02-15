import { PolicyExtractor } from './PolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;
    private extractionStrategy: ExtractionStrategy;

    constructor(pattern?: string, extractionStrategy?: ExtractionStrategy) {
        this.pattern = new RegExp(
            pattern ||
            'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]',
            'sg'
        );
        this.extractionStrategy = extractionStrategy || new DefaultExtractionStrategy();
    }

    extract(text: string): string[] {
        // With global flag, matchAll returns an iterator of all matches
        const matches = Array.from(text.matchAll(this.pattern));
        if (!matches || matches.length === 0) {
            return [];
        }

        // Process each match and flatten the results
        const processedStatements = matches
            .map(match => match[1])  // Get capturing group from each match
            .filter(Boolean)         // Remove any undefined/null matches
            .flatMap(statement => this.extractionStrategy.extractStatements(statement));
        
        return processedStatements;
    }
     // Log the entire array
    name(): string {
        return 'regex';
    }
}
