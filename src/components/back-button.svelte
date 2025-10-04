<script>
	import { goto } from '$app/navigation';
	import { Redo2 } from 'lucide-svelte';
	let { path } = $props();

	const handleClick = () => {
		if (path) {
			goto(path);
		} else {
			goto(`/dashboards`);
		}
	};
</script>

<button
	on:click={handleClick}
	class="font-BaiJamjuree border-brown text-brown text-md inline-flex w-fit cursor-pointer items-center gap-2 self-end rounded-[6px] border-x border-y bg-white px-3 py-1.5 text-sm font-medium underline-offset-4"
>
	<Redo2 class="text-brown rotate-180 transform" />
	Back
</button>
