import { component, effect, html } from '@lib/dom'
import { Counter } from './components/counter.js'
import { Context } from '@lib/ctx/context.js'
import { appSettings } from './stores/settings.js'
// import router from './_router.js'



const App = component(() => {
	effect(() => {
		document.title = appSettings.title
	})

	return html`
			<main class="container mx-auto p-5 my-10 border-solid border-2 rounded shadow-md">
				${Counter({
		initialValue: 10,
		onChange(value) {
			console.log('value changed: ', value)
		},
	})}
			</main>
		`
})

const root = document.getElementById('root')

if (!root) throw new Error('root not found')

App({})(root)
