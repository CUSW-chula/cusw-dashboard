import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		port: 4173,
		host: '0.0.0.0',
		hmr: {
			host: 'cusw-workspace.sa.chula.ac.th'
		}
	},
	preview: {
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		allowedHosts: ['cusw-workspace.sa.chula.ac.th']
	}
});
