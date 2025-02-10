import { PolicyExtractor } from './PolicyExtractor';

export class RegexPolicyExtractor implements PolicyExtractor {
    private pattern: RegExp;

    constructor(pattern?: string) {
        this.pattern = new RegExp(
            pattern || 
            'statements\\s*=\\s*\\[\\s*((?:[^[\\]]*?(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\'|\\$\\{(?:[^{}]|\\{[^{}]*\\})*\\})?)*)\\s*\\]',
            's'
        );
    }

    extract(text: string): string[] {
        const statementsMatch = text.match(this.pattern);
        if (!statementsMatch || !statementsMatch[1]) {
            return [];
        }

        return statementsMatch[1]
            .split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('#'))
            .map(s => s.replace(/^["'](.*)["']$/, '$1'))
            .map(s => s.replace(/\\(["'])/, '$1'))
            .filter(s => /^(Allow|Define|Endorse|Admit)\s+.+$/i.test(s));
    }

    name(): string {
        return 'regex';
    }
}
