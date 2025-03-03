import { ExtractionStrategy } from './ExtractionStrategy';

export class DefaultExtractionStrategy implements ExtractionStrategy {
    /**
     * Extract policy statements from raw text
     */
    extractStatements(raw: string): string[] {
        if (!raw || raw.trim() === '') {
            return [];
        }

        // Remove HCL comments first
        const uncommentedText = this.removeHclComments(raw);

        // Split the input by commas, properly handling quotes and interpolation
        const statements = this.splitStatements(uncommentedText);
        
        // Clean and filter each statement
        return statements
            .map(statement => this.cleanStatement(statement))
            .filter(statement => statement && statement.trim() !== '');
    }

    /**
     * Remove HCL comments (# and //) from the text
     */
    private removeHclComments(text: string): string {
        // Process line by line to properly handle comments
        return text.split('\n')
            .map(line => {
                // Find comment position, but ignore inside quotes
                let inQuote = false;
                let quoteChar = '';
                let commentPos = -1;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    const nextChar = i < line.length - 1 ? line[i + 1] : '';
                    
                    // Toggle quote state (handling escaped quotes)
                    if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
                        if (!inQuote) {
                            inQuote = true;
                            quoteChar = char;
                        } else if (char === quoteChar) {
                            inQuote = false;
                        }
                    }
                    
                    // Find comment start (but not inside quotes)
                    if (!inQuote && (char === '#' || (char === '/' && nextChar === '/'))) {
                        commentPos = i;
                        break;
                    }
                }
                
                // Remove comment if found
                return commentPos >= 0 ? line.substring(0, commentPos).trim() : line;
            })
            .filter(line => line.trim() !== '') // Remove empty lines
            .join(' '); // Join with spaces instead of newlines
    }

    /**
     * Split a statement string by commas, properly handling quoted content and interpolation
     */
    private splitStatements(text: string): string[] {
        // If there are no commas, return the whole text as a single statement
        if (!text.includes(',')) {
            return [text];
        }

        const results: string[] = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';
        let braceLevel = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            
            // Handle quotes
            if ((char === '"' || char === "'") && (i === 0 || text.charAt(i-1) !== '\\')) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuote = false;
                }
            }
            
            // Track interpolation blocks ${...}
            if (char === '{' && i > 0 && text.charAt(i-1) === '$') {
                braceLevel++;
            } else if (char === '}' && braceLevel > 0) {
                braceLevel--;
            }
            
            // Only split on commas outside of quotes and interpolation blocks
            if (char === ',' && !inQuote && braceLevel === 0) {
                results.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the final segment
        if (current.trim()) {
            results.push(current.trim());
        }
        
        return results;
    }
    
    /**
     * Clean a statement by removing quotes and extra whitespace
     */
    private cleanStatement(statement: string): string {
        if (!statement) return '';
        
        let result = statement.trim();
        
        // Remove surrounding quotes if present
        if ((result.startsWith('"') && result.endsWith('"')) || 
            (result.startsWith("'") && result.endsWith("'"))) {
            result = result.substring(1, result.length - 1).trim();
        }
        
        return result;
    }
}
