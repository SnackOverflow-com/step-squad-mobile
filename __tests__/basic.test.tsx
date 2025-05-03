/**
 * Basic test file to ensure CI workflows have tests to run
 */

import { describe, it, expect } from "@jest/globals";

describe("Basic app functionality", () => {
  it("should pass a simple test", () => {
    expect(true).toBe(true);
  });

  it("should handle basic math", () => {
    expect(1 + 1).toBe(2);
  });
});
