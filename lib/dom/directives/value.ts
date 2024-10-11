import { Observable } from "../operators/state.js";
import { directive } from "./_directive.js";

export const $value = directive(
  <T>(
    state: Observable<T>,
    config: {
      event?: "change" | "blur" | "input";
      toState?(value: string): T;
      toValue?(value: T): string;
    } = {},
  ) => {
    const {
      event = "change",
      toState = (value) => value as T,
      toValue = (value) => String(value),
    } = config;

    return ((input: HTMLInputElement) => {
      input.addEventListener(event, ({ currentTarget }) => {
        if (currentTarget instanceof HTMLInputElement) {
          state.value = toState(currentTarget.value);
        }
      });

      state.subscribe((value) => {
        input.value = toValue(value);
      }, { hot: true });
    });
  },
);
