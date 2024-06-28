import { derived } from "../../state/derived.js";
import { subscribe } from "../../state/pubsub.js";
import { extend, state } from "../../state/state.js";
import { Component } from "../component.js";

export type Path = `/${string}`;

export function router<
  Paths extends Record<Path, ({}: {}) => Component>,
>(config: {
  basePath?: Path;
  initialPath?: keyof Paths & Path;
  fallback: ({}: {}) => Component;
  paths: Paths;
}) {
  const {
    basePath = window.location.pathname as Path,
    initialPath = window.location.pathname as Path,
    paths,
    fallback,
  } = config;

  const path = state<Path>(initialPath);

  let lastRoute: Path | undefined;
  subscribe(path, (value, old) => {
    lastRoute = old;
    window.history.pushState({}, "", value);
  });

  addEventListener("popstate", ({ target }) => {
    const pathname = window.location.pathname as Path;
    const route = paths[pathname];

    if (typeof route === "undefined") {
      return console.warn("no route defined for path:", pathname);
    }

    path.value = pathname;
  });

  const _router = extend(
    derived(() => paths[path.value] ?? fallback),
    {
      go(to: keyof Paths & Path) {
        path.value = to;
      },
      back() {
        if (typeof lastRoute !== "undefined") {
          path.value = lastRoute;
        }
      },
      paths: Object.keys(paths).map((k) => [k, k]) as { [K in keyof Paths]: K },
    }
  );

  return _router;
}
