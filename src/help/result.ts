export type Opposite<T extends boolean> = T extends true ? false : true;

export class Result<Ok extends boolean, Payload = {}> {
  readonly #ok: Ok;
  readonly #payload: Payload;

  private constructor(ok: Ok, payload: Payload) {
    this.#ok = ok;
    this.#payload = payload;
  }

  get ok() {
    return this.#ok;
  }

  get error() {
    return !this.#ok as Opposite<Ok>;
  }

  get payload() {
    return this.#payload;
  }

  static ok<Payload = {}>(payload: Payload = {} as Payload) {
    return new Result(true, payload);
  }

  static error<E extends Error = Error>(reason: E | string) {
    if (typeof reason === "string") {
      reason = Error(reason) as E;
    }

    return new Result(false, reason);
  }
}

export const { ok, error } = Result;
