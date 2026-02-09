# Language Patterns (Comments + Docs)

Use these patterns when they fit the codebase conventions; otherwise adapt to match existing style.

## TypeScript / JavaScript (JSDoc or TSDoc)

Add doc comments to exported/public APIs and non-obvious helpers.

Good doc comment contents:

- Purpose in one line.
- Semantics that types do not capture (units, encoding, allowed ranges, ordering, null handling).
- Side effects (I/O, mutation, global state).
- Error behavior (throws vs returns sentinel vs `Result`-style).
- Concurrency/reentrancy (safe to call concurrently, idempotent).

Example skeleton:

```ts
/**
 * <What it does, in one sentence.>
 *
 * Notes:
 * - <Non-obvious constraint or invariant.>
 * - <Edge case behavior.>
 *
 * @param foo <Meaning of foo (not its type).>
 * @returns <Meaning of result; include units/format if relevant.>
 * @throws <Only if the function actually throws and it matters.>
 */
export function doThing(foo: Foo): Bar {
  // ...
}
```

Inline comments are best for:

- Explaining a tricky conditional.
- Documenting an invariant at the point it is established/relied upon.
- Flagging a performance/safety pitfall ("must stay O(n)"; "do not log secrets").

## Python (Docstrings)

Prefer docstrings for public functions/classes and any logic that is hard to infer.

Minimal structure:

```py
def func(x: int) -> int:
    \"\"\"Return <what> given <inputs>.

    Args:
        x: <Meaning of x (units/constraints), not the type.>

    Returns:
        <Meaning of return value (units/format/ordering).>

    Raises:
        ValueError: <When/why>, only if meaningful.
    \"\"\"
```

If the project uses a specific style (Google/Numpy/reST), match it.

## Go (Doc Comments)

For exported identifiers, write a comment that starts with the identifier name.

```go
// Widget parses ... and guarantees ...
// It is safe for concurrent use if ...
type Widget struct { ... }
```

Prefer package comments when the package has a specific purpose or non-obvious constraints:

```go
// Package policy validates ... and assumes ...
package policy
```

## Java (Javadoc)

Use Javadoc for public/protected APIs and any behavior that is non-obvious or contract-heavy.

Good Javadoc contents:

- Purpose in one sentence.
- Contract and invariants (what must be true before/after).
- Nullability expectations (even if annotations exist; mention semantics when important).
- Error behavior (which exceptions and under what conditions).
- Thread-safety and immutability (especially for shared utilities).
- Performance characteristics when they matter (big-O, allocations, caching).

Example skeleton:

```java
/**
 * <What it does, in one sentence.>
 *
 * <Longer details only if needed: invariants, edge cases, ordering, or side effects.>
 *
 * @param foo <Meaning of foo (not its type).>
 * @return <Meaning of result; include units/format/ordering if relevant.>
 * @throws IllegalArgumentException <Condition>, only if meaningful.
 */
public Bar doThing(Foo foo) {
  // ...
}
```

Prefer inline comments for:

- Explaining a tricky branch or algorithmic step.
- Documenting invariants where they are established/relied upon.
- Calling out "sharp edges" (e.g., behavior differs by platform/JDK, or a workaround exists for a known bug).

## Dart (Dartdoc)

Use Dartdoc comments (`///`) for public APIs and any behavior that is non-obvious or contract-heavy.

Good Dartdoc contents:

- Purpose in one sentence.
- Semantics not captured by types (units/format, ordering, whether values are normalized).
- Null-safety semantics when it matters (e.g., when a nullable input is treated specially).
- Side effects (I/O, mutation, logging, caching).
- Error behavior (what is thrown and when).
- Async semantics (whether it can complete synchronously, cancellation/timeout behavior if relevant).

Example skeleton:

```dart
/// <What it does, in one sentence.>
///
/// Notes:
/// - <Non-obvious constraint or invariant.>
/// - <Edge case behavior.>
///
/// Throws [FormatException] if <condition>.
Future<Bar> doThing(Foo foo) async {
  // ...
}
```

Prefer inline comments for tricky control flow, invariants at the point of use, and performance/safety pitfalls.
