import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		port: 5431,
		host: '0.0.0.0',
		allowedHosts: ['cusw-workspace.sa.chula.ac.th'],
		hmr: {
			host: 'cusw-workspace.sa.chula.ac.th'
		}
	},
	preview: {
		headers: {
			'Access-Control-Allow-Origin': 'https://cusw-workspace.sa.chula.ac.th'
		},
		allowedHosts: ['cusw-workspace.sa.chula.ac.th']
	}
});
