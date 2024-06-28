import { component } from "../../src/dom/component.js";

export const Oops = component(() => ({
  render() {
    return /*html*/ `<div>
        <h1 class="text-3xl font-bold underline">oops! something went wrong</h1>
        <p>please, try again later or go back to the beginning</p>
        <button type="button">go back</button>
    </div>`;
  },
}));
