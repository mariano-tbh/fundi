import { describe, expect, test } from "vitest";
import { state } from "./state.js";
import { scope } from "./scope.js";

describe("scope", () => {
  test("should collect all deps that are registed inside action call", () => {
    const depA = state(0);
    const depB = state(0);
    const depC = state(0);

    const action = () => {
      depC.value = depA.value + depB.value;
    };

    const deps = scope(action);

    expect(deps).toContain(depA);
    expect(deps).toContain(depB);
    expect(deps).not.toContain(depC);
  });

  test("should not mix deps in nested scopes", () => {
    const depA = state(0);
    const depB = state(0);
    const depC = state(0);

    const deps = scope(() => {
      depC.value = depA.value + depB.value;

      const deps = scope(() => {
        depB.value = depC.value + depA.value;

        const deps = scope(() => {
          depA.value = depC.value + depB.value;
        });
        expect(deps).not.toContain(depA);
        expect(deps).toContain(depB);
        expect(deps).toContain(depC);
      });
      expect(deps).toContain(depA);
      expect(deps).not.toContain(depB);
      expect(deps).toContain(depC);
    });
    expect(deps).toContain(depA);
    expect(deps).toContain(depB);
    expect(deps).not.toContain(depC);
  });
});
