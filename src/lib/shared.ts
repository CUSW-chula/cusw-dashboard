// Development mode configuration
export const IS_DEV = import.meta.env.VITE_IS_DEV || 'no'; // Set to 'yes' for dev environment, 'no' for production

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
