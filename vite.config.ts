import {defineConfig} from 'vitest/config';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		dts({
			insertTypesEntry: true,
			include: ['src/**'],
		}),
	],
	test: {
		environment: 'node',
	},
	build: {
		outDir: 'lib',
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'fundi',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
		sourcemap: true,
		minify: 'esbuild',
		rollupOptions: {
			external: ['node:async_hooks'],
			treeshake: true,
		},
	},
});
