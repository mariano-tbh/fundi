import { $component, html } from "../../lib/dom/index.js";

export default $component(function Ooops() {

  return html`<div>
    <h1 class="text-3xl font-bold underline">oops! something went wrong</h1>
    <p>please, try again later or go back to the beginning</p>
    <button type="button">go back</button>
  </div>`
}
);
