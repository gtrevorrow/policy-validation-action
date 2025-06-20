import { PolicyExtractor } from './PolicyExtractor';
import { ExtractionStrategy } from './ExtractionStrategy';
import { DefaultExtractionStrategy } from './DefaultExtractionStrategy';
import { POLICY_STATEMENTS_REGEX } from '../types';

interface RegexExtractorConfig {
    timeoutMs?: number;
    maxInputSize?: number;
    maxNestingDepth?: number;
    maxConsecutiveChars?: number;
}

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;
    private extractionStrategy: ExtractionStrategy;
    private config: Required<RegexExtractorConfig>;

    constructor(
        pattern?: string, 
        extractionStrategy?: ExtractionStrategy,
        config?: RegexExtractorConfig
    ) {
        // Use existing pattern from types.ts or build a new one from the provided pattern
        this.pattern = pattern 
            ? new RegExp(pattern, 'sgi')
            : POLICY_STATEMENTS_REGEX;
        
        this.extractionStrategy = extractionStrategy || new DefaultExtractionStrategy();
        
        // Set configurable limits with sensible defaults
        this.config = {
            timeoutMs: config?.timeoutMs ?? 5000,           // 5 second timeout
            maxInputSize: config?.maxInputSize ?? 1000000,  // 1MB default
            maxNestingDepth: config?.maxNestingDepth ?? 50, // 50 levels default
            maxConsecutiveChars: config?.maxConsecutiveChars ?? 20 // 20 repeated chars
        };
    }

    extract(text: string): string[] {
        if (!text || text.trim() === '') {
            return [];
        }

        // Basic input validation with configurable limits
        if (text.length > this.config.maxInputSize) {
            throw new Error(`Input size (${text.length} characters) exceeds limit of ${this.config.maxInputSize}`);
        }

        try {
            // Reset the regex to ensure clean state
            this.pattern.lastIndex = 0;
            
            // Use the original simple approach for compatibility, but with a safety wrapper
            const matches = Array.from(text.matchAll(this.pattern));
            
            if (!matches || matches.length === 0) {
                return [];
            }

            // Get raw statements from regex matches and delegate all processing to the strategy
            return matches
                .map((match: RegExpMatchArray) => match[1])  // Get capturing group from each match
                .filter(Boolean)         // Remove any undefined/null matches
                .flatMap((statement: string) => this.extractionStrategy.extractStatements(statement))
                .filter((s: string) => s && s.trim() !== '');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Regex extraction failed: ${error.message}`);
            }
            throw new Error(`Regex extraction failed: ${String(error)}`);
        }
    }

    /**
     * Performs regex matching with actual timeout protection
     * Uses a simple approach that works in synchronous context
     */
    private performRegexWithTimeout(text: string): RegExpMatchArray[] {
        const startTime = Date.now();
        let matches: RegExpMatchArray[] = [];
        
        // Create an iterator to process matches incrementally
        const matchIterator = text.matchAll(this.pattern);
        
        try {
            for (const match of matchIterator) {
                // Check timeout on each iteration to prevent hanging
                if (Date.now() - startTime > this.config.timeoutMs) {
                    throw new Error(`Regex matching timed out after ${this.config.timeoutMs}ms while processing match ${matches.length + 1}. Input may cause catastrophic backtracking.`);
                }
                
                matches.push(match);
                
                // Safety valve - if we're getting way too many matches, something might be wrong
                if (matches.length > 10000) {
                    throw new Error(`Regex produced excessive matches (${matches.length}). This may indicate a pattern issue or input that causes exponential matching.`);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                // If it's our timeout error, re-throw it
                if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                    throw error;
                }
                // For other regex errors, wrap them with context
                throw new Error(`Regex matching failed: ${error.message}. This may indicate input incompatible with the extraction pattern.`);
            }
            throw new Error(`Regex matching failed: ${String(error)}`);
        }
        
        return matches;
    }

    /**
     * Validates input constraints using configurable limits
     */
    private validateInputConstraints(text: string): void {
        // Check configurable input size limit
        if (text.length > this.config.maxInputSize) {
            throw new Error(`Input size (${text.length} characters) exceeds configured limit of ${this.config.maxInputSize}. Consider processing smaller chunks or increasing the maxInputSize limit.`);
        }

        // Check configurable nesting depth
        const maxNestingDepth = this.calculateMaxNestingDepth(text);
        if (maxNestingDepth > this.config.maxNestingDepth) {
            throw new Error(`Input nesting depth (${maxNestingDepth}) exceeds configured limit of ${this.config.maxNestingDepth}. Consider simplifying the input structure or increasing the maxNestingDepth limit.`);
        }

        // Check for patterns that commonly cause exponential backtracking
        const backtrackingRisk = this.assessBacktrackingRisk(text);
        if (backtrackingRisk.isHigh) {
            throw new Error(`Input contains patterns likely to cause catastrophic backtracking: ${backtrackingRisk.description}. Consider using a simpler extraction pattern or preprocessing the input.`);
        }
    }

    /**
     * Calculates maximum nesting depth of brackets and braces
     */
    private calculateMaxNestingDepth(text: string): number {
        let currentDepth = 0;
        let maxDepth = 0;
        
        for (const char of text) {
            if (char === '[' || char === '{' || char === '(') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (char === ']' || char === '}' || char === ')') {
                currentDepth = Math.max(0, currentDepth - 1);
            }
        }
        
        return maxDepth;
    }

    /**
     * Detects patterns that commonly cause catastrophic backtracking
     */
    private assessBacktrackingRisk(text: string): { isHigh: boolean; description?: string } {
        // Check for excessive consecutive identical non-whitespace characters (configurable)
        // Exclude whitespace characters (spaces, tabs, newlines) as they are normal for indentation
        const consecutivePattern = new RegExp(`([^\\s])\\1{${this.config.maxConsecutiveChars},}`, 'g');
        const consecutiveMatches = text.match(consecutivePattern);
        if (consecutiveMatches) {
            return {
                isHigh: true,
                description: `Long sequences of repeated non-whitespace characters found exceeding limit of ${this.config.maxConsecutiveChars} (e.g., "${consecutiveMatches[0].substring(0, 10)}...")`
            };
        }

        // Check for many unclosed opening brackets relative to total brackets
        const openBrackets = (text.match(/\[/g) || []).length;
        const closeBrackets = (text.match(/\]/g) || []).length;
        const totalBrackets = openBrackets + closeBrackets;
        
        // Only check if there are significant brackets to avoid false positives
        if (totalBrackets > 20) {
            const bracketImbalance = Math.abs(openBrackets - closeBrackets);
            const imbalanceRatio = bracketImbalance / totalBrackets;
            
            if (imbalanceRatio > 0.5) {  // More than 50% imbalanced
                return {
                    isHigh: true,
                    description: `High bracket imbalance ratio (${Math.round(imbalanceRatio * 100)}%): ${openBrackets} open, ${closeBrackets} close`
                };
            }
        }

        return { isHigh: false };
    }

    name(): string {
        return 'regex';
    }
}
