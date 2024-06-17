import { describe, expect, test } from "vitest";
import { store } from "./store.js";
import { derived } from "./derived.js";

describe("store", () => {
  test("should create a state object which updates dependencies when property values are updated", () => {
    const appState = store({
      user: "bob",
      likes: 1124,
      following: 123,
      followers: 14,
      loginAt: Date.now(),
    });

    const popularity = derived(() => {
      const score = appState.followers - appState.following;
      if (score > 0) return "popular";
      if (score < 0) return "newbie";
      else return "neutral";
    });

    expect(popularity.value).toEqual("newbie");
    appState.followers += 109;
    expect(popularity.value).toEqual("neutral");
    appState.followers += 1;
    expect(popularity.value).toEqual("popular");
  });
});
