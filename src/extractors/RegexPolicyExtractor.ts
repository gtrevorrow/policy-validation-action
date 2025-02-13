import { PolicyExtractor } from './PolicyExtractor';

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;

    constructor(pattern?: string) {
        this.pattern = new RegExp(
            pattern ||
            'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]',
            'sg'
        );
    }

    extract(text: string): string[] {
        // With global flag, matchAll returns an iterator of all matches
        const matches = Array.from(text.matchAll(this.pattern));
        if (!matches || matches.length === 0) {
            return [];
        }

        // Process each match and flatten the results
        return matches
            .map(match => match[1])  // Get capturing group from each match
            .filter(Boolean)         // Remove any undefined/null matches
            .flatMap(statement =>    // Process each statement block
                statement
                    .split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
                    .map(s => s.trim())
                    .filter(s => s && !s.startsWith('#'))
                    .map(s => s.replace(/^["'](.*)["']$/, '$1'))
                    .map(s => s.replace(/\\(["'])/, '$1'))
                    // .filter(s => /^(Allow|Define|Endorse|Admit)\s+.+$/i.test(s))
            );
    }

    name(): string {
        return 'regex';
    }
}
