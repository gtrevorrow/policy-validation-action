const { RegexPolicyExtractor } = require('./lib/extractors/RegexPolicyExtractor');

// Test the improved regex extractor with configurable timeouts
console.log('Testing RegexPolicyExtractor with timeout functionality...');

// Test 1: Normal input should work fine
const normalInput = `
resource "oci_identity_policy" "test" {
  statements = [
    "Allow group Developers to use instances in compartment dev"
  ]
}
`;

const extractor = new RegexPolicyExtractor(undefined, undefined, {
    timeoutMs: 1000,
    maxInputSize: 5000,
    maxNestingDepth: 10,
    maxConsecutiveChars: 15
});

try {
    console.log('Test 1: Normal input');
    const results = extractor.extract(normalInput);
    console.log('✓ Success:', results);
} catch (error) {
    console.log('✗ Failed:', error.message);
}

// Test 2: Large input should be rejected
const largeInput = 'a'.repeat(10000);
try {
    console.log('\nTest 2: Large input (should fail)');
    extractor.extract(largeInput);
    console.log('✗ Should have failed but did not');
} catch (error) {
    console.log('✓ Correctly rejected:', error.message);
}

// Test 3: High nesting should be rejected
const highNestingInput = '['.repeat(60) + ']'.repeat(60);
try {
    console.log('\nTest 3: High nesting (should fail)');
    extractor.extract(highNestingInput);
    console.log('✗ Should have failed but did not');
} catch (error) {
    console.log('✓ Correctly rejected:', error.message);
}

// Test 4: Repeated characters should be rejected
const repeatedInput = 'a'.repeat(30);
try {
    console.log('\nTest 4: Repeated characters (should fail)');
    extractor.extract(repeatedInput);
    console.log('✗ Should have failed but did not');
} catch (error) {
    console.log('✓ Correctly rejected:', error.message);
}

console.log('\nAll tests completed!');
