import { component, effect, state } from '../../src/dom/index.js'

export const Counter = component<{
  start: number
  onChange(value: number): void
}>(({ start, onChange }) => {
  const count = state(start)

  count.subscribe(onChange)

  effect(() => {
    if (count.value < 0) {
      count.value = 0
    }
  })

  return ({ ref }) => {
    ref.innerHTML = /*html*/ `<div>
      <h3>the count is: ${count.value}</h3>
      <div>
        <button class="btn btn-blue" id="inc">increment</button>
        <button class="btn btn-blue" id="dec">decrement</button>
      </div>
      </div>`

    document.getElementById('inc')!.addEventListener('click', () => count.value++)
    document.getElementById('dec')!.addEventListener('click', () => count.value--)
  }
})
