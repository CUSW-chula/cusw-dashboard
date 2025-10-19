import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd(), '');
	
	// Development mode configuration
	const IS_DEV = env.VITE_IS_DEV || 'no'; // Set to 'yes' for dev environment, 'no' for production
	const BASE_DOMAIN = IS_DEV === 'yes' 
		? 'dev-cusw-workspace.sa.chula.ac.th' 
		: 'cusw-workspace.sa.chula.ac.th';

	return {
		plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
		server: {
			port: 4173,
			host: '0.0.0.0',
			hmr: { host: BASE_DOMAIN },
			allowedHosts: true
		},
		preview: {
			headers: { 'Access-Control-Allow-Origin': '*' },
			port: 4173,
			host: `https://${BASE_DOMAIN}`,
			allowedHosts: true
		}
	};
});
