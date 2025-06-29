<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../../../lib/shared.js';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import DateFilter from '../../../../components/filter/date-filter.svelte';
	import TagFilter from '../../../../components/filter/tag-filter.svelte';
	import { filterDate } from '../../../../lib/store.svelte.js';
	import { getLocalTimeZone } from '@internationalized/date';

	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	const { params } = get(page);
	const projectId = params.project_id;

	let ganttchart = $state([]);
	let ganttchartMap = $state([]);
	let filteredGantt = $state([]);

	function transformData(data) {
		const formatter = new Intl.DateTimeFormat('th-TH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});

		return data.map((item) => {
			const end = new Date(item.end);
			const endPlus = new Date(end);
			const start = new Date(item.start);
			endPlus.setDate(end.getDate() + 1);

			return {
				...item,
				startF: formatter.format(start),
				end: endPlus.toISOString(),
				endF: formatter.format(end),
				parent: item.parentId
			};
		});
	}

	$effect(() => (ganttchartMap = transformData(filteredGantt)));

	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());

		if (!start || !end) {
			filteredGantt = ganttchart;
			return;
		}

		filteredGantt = ganttchart.filter((task) => {
			const taskStart = new Date(task.start);
			const taskEnd = new Date(task.end);

			return taskStart <= end && taskEnd >= start;
		});
	});

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
		{#key ganttchartMap}
			<GanttChart {ganttchartMap} />
		{/key}
	</section>
</div>
