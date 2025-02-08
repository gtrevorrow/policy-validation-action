# Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/). The version number is bumped using the `standard-version` tool.

## Guidelines

- **MAJOR** version when you make incompatible API changes.
- **MINOR** version when you add functionality in a backward-compatible manner.
- **PATCH** version when you make backward-compatible bug fixes.

## Usage

Run:
```bash
npm run release
```
This command will update the version number, generate/update the CHANGELOG, and create a new Git tag.
