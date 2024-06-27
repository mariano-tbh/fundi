import { test } from "vitest";
import { error, ok } from "./result.js";

test("result", () => {
  function parseInt(it: unknown) {
    const asNumber = Number(it);
    if (Number.isFinite(asNumber)) {
      return ok(asNumber);
    } else {
      return error("value is not numeric");
    }
  }

  function _() {
    const { ok, payload } = parseInt("123");

    if (ok) {
      console.log("successfully parsed:", payload);
    } else {
      throw payload;
    }
  }
});
