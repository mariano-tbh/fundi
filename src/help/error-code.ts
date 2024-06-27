
export class ErrorCode<Code extends string | number> extends Error {
    readonly #code: Code;

    constructor(code: Code, message: string) {
        super(message);
        this.#code = code;
    }

    get code() {
        return this.#code;
    }
}
