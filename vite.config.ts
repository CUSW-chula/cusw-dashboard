import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
<<<<<<< HEAD
		port: 3000,
=======
		port: 4173,
>>>>>>> 2a84401225e6a05949705351427de54639a6d50e
		host: '0.0.0.0',
		hmr: { host: 'cusw-workspace.sa.chula.ac.th' },
		allowedHosts: true
	},
	preview: {
		headers: { 'Access-Control-Allow-Origin': '*' },
		port: 4173,
		host: 'https://cusw-workspace.sa.chula.ac.th',
		allowedHosts: true
	}
});
