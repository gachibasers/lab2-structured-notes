// tests/testRunner.js
// Very small test runner for running unit tests in the browser console.

const tests = [];

/**
 * Register a test case.
 */
export function test(name, fn) {
    tests.push({ name, fn });
}

/**
 * Assert that two values are strictly equal.
 */
export function assertEqual(actual, expected, message = "") {
    if (actual !== expected) {
        throw new Error(
            message || `Expected ${expected}, but got ${actual}`
        );
    }
}

/**
 * Assert that a condition is true.
 */
export function assert(condition, message = "Assertion failed") {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Run all registered tests and log results to console.
 */
export function runTests() {
    let passed = 0;
    let failed = 0;

    console.log("=== Running tests ===");
    for (const t of tests) {
        try {
            t.fn();
            console.log(`✅ ${t.name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${t.name}:`, e.message);
            failed++;
        }
    }
    console.log(`=== Done. Passed: ${passed}, Failed: ${failed} ===`);
}
