export interface PolicyExtractor {
    extract(text: string): string[];
    name(): string;
}
