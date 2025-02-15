export interface ExtractionStrategy {
    extractStatements(statement: string): string[];
}
