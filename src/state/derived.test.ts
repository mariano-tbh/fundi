import { describe, expect, test, vi } from "vitest";
import { derived } from "./derived.js";
import { state } from "./state.js";

describe("derived", () => {
  test("value should be result of passed function", () => {
    const sum = derived(() => 1 + 1);

    expect(sum.value).toEqual(2);
  });

  test("value should update if deps change", () => {
    const a = state(1);
    const b = state(1);
    const sum = derived(() => a.value + b.value);

    expect(sum.value).toEqual(2);

    a.value = 2;
    expect(sum.value).toEqual(3);

    b.value = 2;
    expect(sum.value).toEqual(4);
  });

  test("function should only be called if deps have updated", () => {
    const a = state(1);
    const b = state(1);
    const fn = vi.fn(() => a.value + b.value);
    const sum = derived(fn);

    // read once
    const _1 = sum.value;
    // read twice
    const _2 = sum.value;
    // read thrice
    expect(sum.value).toEqual(2);
    expect(fn).toHaveBeenCalledOnce();
  });
});
