import { describe, expect, test, vi } from "vitest";
import { declare, Impl } from "./declare.js";
import { context } from "./context.js";
import { run } from "./run.js";
import { use } from "./use.js";

describe("ioc", () => {
  const $logger = declare<{ log(...args: unknown[]): void }>({
    name: "logger",
  });
  const $greeter = declare<{ greet(id: string): void }>({ name: "greeter" });

  test("declare context and access it with default config", async () => {
    const loggerImpl: Impl<typeof $logger> = {
      log(...args) {
        console.log(...args);
      },
    };

    const ctx = context({ defaultScope: "singleton" });
    ctx.add($logger, { value: loggerImpl });

    await run(
      async () => {
        const logger = use($logger);

        expect(logger).toBe(loggerImpl);
      },
      { context: ctx }
    );
  });

  test("declare context with scoped provider", async () => {
    const loggerFactory = (): Impl<typeof $logger> => ({
      log(...args) {
        console.log(...args);
      },
    });

    const ctx = context();
    ctx.add($logger, { factory: loggerFactory, scope: "scoped" });

    await run(
      async () => {
        const logger1 = use($logger, { scope: { id: 1 } });
        const logger2 = use($logger, { scope: { id: 2 } });

        expect(logger1).not.toBe(logger2);
      },
      { context: ctx }
    );
  });

  test("declare context with transient provider", async () => {
    const loggerFactory = (): Impl<typeof $logger> => ({
      log(...args) {
        console.log(...args);
      },
    });

    const ctx = context();
    ctx.add($logger, { factory: loggerFactory, scope: "transient" });

    await run(
      async () => {
        const scope = {};
        const logger1 = use($logger, { scope });
        const logger2 = use($logger, { scope });

        expect(logger1).not.toBe(logger2);
      },
      { context: ctx }
    );
  });

  test("declare context with dependant dependencies", async () => {
    const loggerImpl = {
      log: vi.fn(),
    } satisfies Impl<typeof $logger>;

    class GreeterImpl implements Impl<typeof $greeter> {
      constructor(private readonly logger = use($logger)) {}

      greet(name: string): void {
        this.logger.log("hello, " + name + "!");
      }
    }

    const ctx = context();
    ctx.add($logger, { value: loggerImpl });
    ctx.add($greeter, { class: GreeterImpl });

    await run(
      async () => {
        const scope = {};
        const greeter = use($greeter, { scope });

        greeter.greet("world");

        expect(loggerImpl.log).toHaveBeenCalledWith("hello, world!");
      },
      { context: ctx }
    );
  });
});
