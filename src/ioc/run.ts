import { Stack } from "../utils/stack.js";
import { Context } from "./context.js";

const $$contexts = new Stack<Context>();

export async function run(
  action: () => void | Promise<void>,
  options: { context: Context }
) {
  $$contexts.current = options.context;
  await action();
  $$contexts.pop();
}

export function getContext(): Context | undefined {
  return $$contexts.current;
}

export function getContextOrThrow(): Context {
  const ctx = getContext();
  if (typeof ctx === "undefined") {
    throw new Error(
      'context is missing, did you forget to wrap your action in a call to "run"?'
    );
  }
  return ctx;
}
