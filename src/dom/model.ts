import { ParseSelector } from "typed-query-selector/parser.js";
import { Directive } from "./directives/_directive.js";

export function model<
  M extends { [K in keyof M & string]: Directive<ParseSelector<K>> },
>(m: M): Directive<HTMLElement> {
  return (root) => {
    for (const [selector, directive] of Object.entries(m)) {
      const el = root.querySelector(selector);
      if (el === null) return;
      (directive as Directive)(el);
    }
  };
}
