
export type Action<R = void> = () => R

export class Context<T> {
  #current: T

  constructor(initialValue: T) {
    this.#current = initialValue
  }

  run<R>(value: T, action: Action<R>): R {
    const prev = this.#current;
    this.#current = value;
    let result = action();
    this.#current = prev;
    return result;
  }

  get value() {
    return this.#current;
  }
}
