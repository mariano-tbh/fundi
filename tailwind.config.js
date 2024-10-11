import twElementsPlugin from 'tw-elements/plugin.cjs';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./app/**/*.{js,ts}',
		'./node_modules/tw-elements/js/**/*.js',
	],
	theme: {
		extend: {},
	},
	plugins: [twElementsPlugin],
	darkMode: 'class',
};
