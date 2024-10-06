import { Observable } from "../../r8y/observable.js";

export function proxy<T extends object>(src: T): T {
  const deps = new Map<keyof T, Observable>();

  function $state(target: T, p: keyof T, receiver: unknown) {
    let $ = deps.get(p);

    if (typeof $ === "undefined") {
      const initialValue = Reflect.get(target, p, receiver)
      $ = new Observable<unknown>(initialValue);
      deps.set(p, $);
    }

    return $;
  }

  return new Proxy(src, {
    get(target, p, receiver) {
      return $state(target, p as keyof T, receiver).value;
    },
    set(target, p, newValue, receiver) {
      $state(target, p as keyof T, receiver).value = newValue;
      return true;
    },
  });
}
