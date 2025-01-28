module.exports = {
    preset: 'ts-jest',  // Use TypeScript preset for Jest
    testEnvironment: 'node',  // Run tests in Node.js environment
    verbose: true,  // Show detailed test output
    
    // Ignore node_modules and other build artifacts
    transformIgnorePatterns: [
        "/node_modules/",
        "\\.pnp\\.[^\\/]+$"
    ],
    
    // Configure TypeScript settings for tests
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'  // Use project's TypeScript config
        }
    },
    
    // Test file patterns to look for
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    
    // Coverage reporting configuration
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    
    // Setup files to run before tests
    setupFiles: ["./jest.setup.js"]
};
