import { PolicyExtractor } from './PolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;
    private extractionStrategy: ExtractionStrategy;

    constructor(pattern?: string, extractionStrategy?: ExtractionStrategy) {
        // Default pattern is improved to handle various formats while being more specific
        const defaultPattern = 'statements\\s*=\\s*\\[\\s*((?:[^\\[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]';
        
        this.pattern = new RegExp(
            pattern || defaultPattern,
            'sg'
        );
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

        // Process each match 
        const processedStatements = matches
            .map(match => match[1])  // Get capturing group from each match
            .filter(Boolean)         // Remove any undefined/null matches
            .map(statement => this.preprocessStatement(statement)) // Clean up common issues
            .flatMap(statement => this.extractionStrategy.extractStatements(statement));
        
        return processedStatements
            .filter(s => s && s.trim() !== '')
            .map(s => s.replace(/"\s*\+\s*"/g, '')); // Fix string concatenation in the final output
    }

    /**
     * Preprocesses statement to fix common issues before extraction
     */
    private preprocessStatement(statement: string): string {
        let result = statement;
        
        // Fix common issues with Terraform string concatenation
        result = result.replace(/"\s*\+\s*"/g, '');
        
        // Remove extraneous commas inside variable interpolation
        result = result.replace(/(\${[^}]*),\s*([^}]*})/g, '$1 $2');
        
        return result;
    }

    name(): string {
        return 'regex';
    }
}
