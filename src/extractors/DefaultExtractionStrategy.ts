import { ExtractionStrategy } from './ExtractionStrategy';

export class DefaultExtractionStrategy implements ExtractionStrategy {
    extractStatements(statement: string): string[] {
        // Split into lines and remove comments
        const lines = statement.split('\n')
            .map(line => line.replace(/\s*#.*$/, '').trim()) // Remove comments and trim
            .filter(line => line); // Remove empty lines

        // Split each line by commas
        return lines.flatMap(line =>
            line.split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
                .map(s => s.trim())
                .map(s => s.replace(/^["'](.*)["']$/, '$1'))
                .map(s => s.replace(/\\(["'])/, '$1'))
                .filter(s => s) // Remove empty strings after processing
        );
    }
}
