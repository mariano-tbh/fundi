import { appSettings } from '@app/stores/settings.js'
import { $component, html, $state, $value } from '../../lib/dom/index.js'

export default $component<{
  initialValue: number
  onChange(value: number): void
}>(function Counter(props) {
  const { initialValue, onChange } = props

  const count = $state(initialValue)

  let ogTitle = appSettings.title
  count.subscribe((value) => {
    appSettings.title = ogTitle + ' | count: ' + value
    onChange(value)
  })

  function increment() {
    count.value++
  }

  function decrement() {
    if (count.value === 0) return
    count.value--
  }

  return html`<div>
      <h3>the count is: ${count}</h3>
      <h3>the double is: ${() => count.value * 2}</h3>
      <label>
        <span>set count:</span>
        <input type="number" ${$value(count, { toState: Number, toValue: String })} />
      </label>
      <div>
        <button class="btn btn-blue" id="inc" onclick=${increment}>increment</button>
        <button class="btn btn-blue" id="dec" onclick=${decrement}>decrement</button>
      </div>
      </div>
      `
})
