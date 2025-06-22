<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../../lib/shared.js';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import DateFilter from '../../../components/filter/date-filter.svelte';
	import TagFilter from '../../../components/filter/tag-filter.svelte';

	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	let ganttchart = [];
	const { params } = get(page);
	const projectId = params.project_id;
	onMount(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/v2/ganttchart/${projectId}`, {
				headers: {
					Authorization: auth
				}
			});
			const json = await response.json();
			ganttchart = [...json];
		} catch (error) {
			console.log('Fetch error:', error);
		}
	});
</script>

<div class="flex flex-col gap-4 px-20">
	<h1 class="font-Anuphan text-5xl font-semibold">Dashboard</h1>
	<section class="flex flex-wrap gap-2">
		<DateFilter />
		<TagFilter />
	</section>
	<section class="h-[650px] overflow-y-auto rounded-md border bg-white">
		{#if ganttchart.length > 0}
			<GanttChart {ganttchart} />
		{:else}
			<p class="flex h-full items-center justify-center text-xl">Loading Gantt chart...</p>
		{/if}
	</section>
</div>
