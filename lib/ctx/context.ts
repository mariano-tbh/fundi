
export type Action<ReturnType = void> = () => ReturnType

export class Context<Value> {
  #current: Value

  constructor(initialValue: Value) {
    this.#current = initialValue
  }

  with(value: Value) {
    return <Args extends unknown[], ReturnType>(action: (...args: Args) => ReturnType) => {
      return (...args: Args) => {
        return this.run(value, () => action(...args))
      }
    }
  }

  run<ReturnType>(value: Value, action: Action<ReturnType>): ReturnType {
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
