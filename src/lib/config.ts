// Runtime configuration that reads from window object
// This allows changing config without rebuilding

declare global {
	interface Window {
		__ENV__?: {
			VITE_IS_DEV?: string;
		};
	}
}

// Get IS_DEV from runtime window object or fallback to build-time env
const runtimeEnv = typeof window !== 'undefined' && window.__ENV__?.VITE_IS_DEV;
const buildTimeEnv = import.meta.env.VITE_IS_DEV;
export const IS_DEV = runtimeEnv || buildTimeEnv || 'no';

// Debug logging
if (typeof window !== 'undefined') {
	console.log('=== Environment Debug ===');
	console.log('window.__ENV__:', window.__ENV__);
	console.log('window.__ENV__.VITE_IS_DEV:', window.__ENV__?.VITE_IS_DEV);
	console.log('import.meta.env.VITE_IS_DEV:', import.meta.env.VITE_IS_DEV);
	console.log('Final IS_DEV:', IS_DEV);
	console.log('========================');
}

// API base URL configuration
export const API_BASE_URL = import.meta.env.DEV
	? 'http://localhost:4000/api'
	: IS_DEV === 'yes'
		? 'https://dev-cusw-workspace.sa.chula.ac.th/api'
		: 'https://cusw-workspace.sa.chula.ac.th/api';

// Base domain configuration
export const BASE_DOMAIN = IS_DEV === 'yes'
	? 'dev-cusw-workspace.sa.chula.ac.th'
	: 'cusw-workspace.sa.chula.ac.th';

// Full base URL (for redirects, etc.)
export const BASE_URL = `https://${BASE_DOMAIN}`;

// Debug URLs
if (typeof window !== 'undefined') {
	console.log('=== URL Configuration ===');
	console.log('API_BASE_URL:', API_BASE_URL);
	console.log('BASE_DOMAIN:', BASE_DOMAIN);
	console.log('BASE_URL:', BASE_URL);
	console.log('========================');
}
