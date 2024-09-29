import { component } from '../src/dom/index.js'
import { Counter } from './components/counter.js'
// import router from './_router.js'

const App = component(() => {
	return ({ ref }) => {
		ref.innerHTML = /*html*/ `
			<main class="container mx-auto p-5 my-10 border-solid border-2 rounded shadow-md">
				<div id="counter"></div>
			</main>
		`

		Counter({
			start: 10,
			onChange(value) {
				console.log('value changed: ', value)
			},
		})(document.getElementById('counter')!)

	}
})

const root = document.getElementById('root')

if (!root) throw new Error('root ')

App({})(root)
