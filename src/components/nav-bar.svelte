<script lang="ts">
	import { base } from '$app/paths';
	import { API_BASE_URL, BASE_URL } from '../lib/shared.js';
	import Profile from './Profile.svelte';
	import { onMount } from 'svelte';
	import { jwtDecode } from 'jwt-decode';

	let auth = '';
	let profile = {
		id: '',
		name: '',
		email: '',
		organization: '',
		position: '',
		isOutsourced: false,
		admin: false,
		head: false,
		activated: false,
		fallback: 'Loading...'
	};
	let userid = '';

	onMount(() => {
		const cookieString = document.cookie;
		const match = cookieString.match(/auth=([^;]+)/);
		if (match) {
			auth = decodeURIComponent(match[1]);
			try {
				const decoded = jwtDecode<{ id: string }>(auth);
				if (decoded && decoded.id) {
					userid = decoded.id;
				}
			} catch (error) {
				console.error('Invalid token:', error);
			}
		}
		if (userid) fetchProfile();
	});

	async function fetchProfile() {
		try {
			const response = await fetch(`${API_BASE_URL}/v2/users/${userid}`, {
				headers: {
					Authorization: auth
				}
			});
			if (!response.ok) {
				const errorMessage = await response.text();
				console.error('Fetch error:', errorMessage);
				return;
			}
			const data = await response.json();
			profile = { ...profile, ...data };
		} catch (error) {
			console.error('Error fetching Owner:', error);
		}
	}

	function goToTasks() {
		window.location.href = `${BASE_URL}/my-tasks`;
	}
</script>

<div class="font-BaiJamjuree flex h-[84px] min-w-full flex-row items-center justify-between px-4">
	<a href="/projects">
		<img src="{base}/logo/s2.svg" alt="CUSW" width={240} />
	</a>
	<div class="flex flex-row gap-4">
		<button
			type="button"
			class="bg-brown flex h-[40px] items-center justify-center gap-1 rounded-[6px] px-3 text-white"
			on:click={goToTasks}
		>
			My task
		</button>
		<Profile {profile} />
	</div>
</div>
