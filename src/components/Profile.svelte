<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { goto } from '$app/navigation';

	interface ProfileProp {
		id: string;
		name?: string;
		email?: string;
		organization?: string;
		position?: string;
		isOutsourced?: boolean;
		admin?: boolean;
		head?: boolean;
		activated?: boolean;
		fallback?: any;
	}

	export let profile: ProfileProp;

	const getInitials = (name?: string) => {
		if (!name) return '';
		return name
			.split(' ')
			.map((part) => part[0])
			.join('');
	};

	const handleLogout = () => {
		document.cookie = 'auth=; Max-Age=0; path=/;';
		window.location.href = 'https://cusw-workspace.sa.chula.ac.th/';
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<div class="border-brown text-brown flex cursor-pointer items-center space-x-2">
			<div
				class="border-brown flex h-[40px] w-[40px] items-center justify-center rounded-full border-[1px] bg-gray-100 transition-colors hover:bg-gray-200"
			>
				<span class="text-brown font-BaiJamjuree text-[16px]">
					{getInitials(profile.name)}
				</span>
			</div>
		</div>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56" align="start">
		<DropdownMenu.Label class="font-BaiJamjuree px-2 text-[18px] font-bold text-black">
			{profile.name || 'Profile'}
		</DropdownMenu.Label>

		<DropdownMenu.Group>
			{#if profile.admin}
				<DropdownMenu.Item onclick={() => goto('/admin')}>Admin</DropdownMenu.Item>
			{/if}
			{#if profile.admin || profile.head}
				<DropdownMenu.Item onclick={() => goto('/dashboards')}>Dashboard</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>

		<DropdownMenu.Separator />

		<DropdownMenu.Item onclick={handleLogout} class="font-bold text-red-600">
			Sign out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
