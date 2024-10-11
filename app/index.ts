import { $checked, $component, $effect, html, $state } from '@lib/dom'
import Counter from './components/counter.js'
import { appSettings } from './stores/settings.js'
import UserProfile from './components/user-profile.js'

const root = document.getElementById('root')
if (!root) throw new Error('root not found')

$component<{ title: string }>(function App({ title }) {
	$effect(() => {
		document.title = title + ' ' + appSettings.title
	})

	const isCounter = $state(true)

	return html`
		<style>
			:host {
				display: block;
				background-color: #f3f4f6;
			}

			.bg-red {
				background-color: red;
			}
		</style>
		<main class="container mx-auto p-5 my-10 border-solid border-2 rounded shadow-md">
			${UserProfile({})}
			<h1>${appSettings.title}</h1>
			<label>
				<span>activar contador</span>
				<input type="checkbox" ${$checked(isCounter)} />
			</label>
			<div>
				${() => isCounter.value
			? Counter({
				initialValue: 10,
				onChange(value) {
					console.log('value changed: ', value)
				},
			}) : null}
		</div>
		<button class="bg-red" onclick=${() => {
			root.replaceChildren()
		}
		}> reset </button>
	</main>
		`
})({
	title: 'hello world',
})(root)
