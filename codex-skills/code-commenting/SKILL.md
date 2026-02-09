---
name: code-commenting
description: Add or improve code comments and documentation so code is easier to understand and maintain. Use when asked to "add comments", "document this code", "annotate/explain this file", "add docstrings", "add JSDoc/TSDoc", "add Go doc comments", or when refactoring requires clarifying intent, invariants, edge cases, side effects, or non-obvious behavior.
---

# Code Commenting

Add comments that increase long-term readability and maintainability without restating the obvious.

## Workflow

1. Identify the language and existing conventions in the repo (docstring/JSDoc style, comment tone, line width, etc.). Match what exists unless it is clearly inconsistent or harmful.
2. Decide what needs comments:
   - Public API surfaces: exported functions/classes/types/modules.
   - Tricky logic: parsing, validation, complex conditionals, concurrency, caching, retries, backoff.
   - Domain rules: business constraints, policy semantics, security assumptions.
   - Invariants and contracts: preconditions, postconditions, units, ordering, nullability expectations, allowed ranges.
   - "Sharp edges": performance implications, error handling, partial failures, compatibility quirks.
3. Write comments that answer "why" and "what are the guarantees/constraints", not "what this line does".
4. Keep changes minimal and localized:
   - Prefer adding a small number of high-value comments over blanket commenting.
   - Avoid large reformatting/whitespace changes unless requested.
5. Validate after edits:
   - Ensure comments are accurate.
   - Run existing tests/lints if available, or at least typecheck/build where relevant.

## What To Write (High-Value Targets)

- **Function/class/module doc**: purpose, inputs/outputs, side effects, error behavior, thread-safety/reentrancy, ordering guarantees.
- **Non-obvious decisions**: why a specific approach was chosen; alternatives that were rejected (briefly).
- **Edge cases**: what happens on empty input, missing config, partial parse, unknown enum values, etc.
- **Invariants**: assumptions that must remain true for correctness, especially across refactors.
- **References**: link to a spec, issue, RFC, standard, or bug explaining a workaround (short; include enough context).

## What Not To Write (Noise)

- Comments that merely translate code into English ("increment i", "set x to 0").
- Type restatements ("userId is a string") unless clarifying format/units/semantics.
- Commented-out code (delete it; use version control).
- Redundant "TODO" notes without clear owner/next action, unless the repo already uses that pattern.
- Author tags, timestamps, or jokes that will age poorly.

## Style Rules

- Prefer complete sentences for doc comments; short phrases for inline clarifications.
- Be precise about conditions (use "only if", "unless", "must", "may").
- Avoid ambiguous pronouns ("this", "that") when the referent is not obvious.
- If the code already conveys *what*, focus on *why* or *constraints*.
- If a comment can go stale easily, re-check whether it is truly necessary; stale comments are worse than none.

## Language-Specific Guidance

Read `references/language-patterns.md` for ready-to-use patterns for:

- TypeScript/JavaScript (JSDoc/TSDoc)
- Python (docstrings)
- Go (exported identifier comments)

## Quick Self-Review Checklist

- Does each new comment add information that isn't already obvious from the code?
- Does it clarify intent, constraints, invariants, edge cases, or side effects?
- Would a future maintainer be less likely to introduce a bug after reading it?
- Is it accurate and consistent with current behavior?

