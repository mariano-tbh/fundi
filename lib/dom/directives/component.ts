import { Context } from "../../ctx/context.js";
import { IDestroyable } from "../../r8y/destroyable.js";
import { effect } from "../operators/effect.js";
import { Directive } from "./_directive.js";

export const ComponentContext = new Context(new Set<IDestroyable>())

export type RenderFunction = ({ ref, signal }: { ref: HTMLElement, signal: AbortSignal }) => void

export type ComponentDefinition<Props extends {} = {}> = (props: Props) => RenderFunction

export function component<Props extends {} = {}>(
    definition: ComponentDefinition<Props>
) {
    return function instance(props: Props): Directive<HTMLElement> {
        const deps = new Set<IDestroyable>()

        function mount() {
            return definition(props)
        }

        return (ref) => {
            const render = ComponentContext.run(deps, mount)

            const effectRef = effect(({ signal }) => {
                requestAnimationFrame(() => {
                    render({ ref, signal })
                })
            })

            ComponentContext.value.add({
                destroy() {
                    effectRef.destroy()
                    deps.forEach(dep => dep.destroy())
                },
            })
        }
    }

}