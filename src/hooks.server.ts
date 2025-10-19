import type { Handle } from '@sveltejs/kit';

// This hook runs on the server before the page is rendered
export const handle: Handle = async ({ event, resolve }) => {
	// Inject environment variables into the HTML
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Get environment variable from process.env
			const isDevEnv = process.env.VITE_IS_DEV || 'no';
			
			console.log('=== Server Hook Injecting ENV ===');
			console.log('process.env.VITE_IS_DEV:', process.env.VITE_IS_DEV);
			console.log('Using VITE_IS_DEV:', isDevEnv);
			console.log('================================');
			
			// Inject script right after <head>
			return html.replace(
				'<head>',
				`<head><script>window.__ENV__={VITE_IS_DEV:"${isDevEnv}"};console.log("ENV injected via hooks:",window.__ENV__);</script>`
			);
		}
	});

	return response;
};
