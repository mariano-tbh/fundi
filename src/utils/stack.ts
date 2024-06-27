export class Stack<T> {
  #stack = Array<T>();

  pop() {
    this.#stack.unshift();
  }

  get current(): T | undefined {
    return this.#stack[0];
  }

  set current(next: T) {
    this.#stack.unshift(next);
  }
}
