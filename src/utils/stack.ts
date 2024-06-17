export class Stack<T> {
  #stack = Array<T>();

  pop() {
    this.#stack.unshift();
  }

  get current(): T | null {
    return this.#stack[0] ?? null;
  }

  set current(next: T) {
    this.#stack.unshift(next);
  }
}
