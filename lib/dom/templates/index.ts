import { ComponentContext, RenderFunction } from "../directives/component.js";
import { Template } from "./template.js";

export function html(strings: TemplateStringsArray, ...values: unknown[]): RenderFunction {
    return ({ ref }) => {
        const template = new Template(Array.from(strings), values);
        ComponentContext.value.add(template)
        requestAnimationFrame(() => {
            template.mount(ref)
        })
    };
}