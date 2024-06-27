import { Declaration } from "./declare.js";
import { getContextOrThrow } from "./run.js";

export function use<T>(contract: Declaration<T>, config: { scope?: {} } = {}) {
  const ctx = getContextOrThrow();

  const value = ctx.resolve(contract, config);

  return value;
}
