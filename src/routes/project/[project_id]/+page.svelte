<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../../lib/shared.js';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import DateFilter from '../../../components/filter/date-filter.svelte';
	import TagFilter from '../../../components/filter/tag-filter.svelte';
	import { filterDate } from '../../../lib/store.svelte.js';
	import { filterGanttTag, tagsList } from '../../../lib/store.svelte.js';
	import { getLocalTimeZone } from '@internationalized/date';

	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	const { params } = get(page);
	const projectId = params.project_id;

	let project = $state([]); // all projects fetched from the API
	let ganttchart = $state([]);
	let ganttchartMap = $state([]);
	let filteredGantt = $state([]);

	function transformData(data) {
		const formatter = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
		const isoFormatter = (date) => date.toISOString().split('T')[0];

		let minStart = null;
		let maxEnd = null;

		const projects = [];

		for (const item of data) {
			if (!item.start || !item.end) continue;

			const start = new Date(item.start);
			const end = new Date(item.end);
			if (isNaN(start) || isNaN(end)) continue;

			const newEnd = new Date(end);
			newEnd.setDate(end.getDate() + 1);
			const progress = item.progress+' %'
			// Update min/max
			if (!minStart || start < minStart) minStart = start;
			if (!maxEnd || newEnd > maxEnd) maxEnd = newEnd;

			projects.push({
				...item,
				newStart: formatter.format(start),
				newEnd: formatter.format(end),
				end: newEnd.toISOString(),
				parent: item.parentId,
				progress: progress
			});
		}

		return {
			projects,
			fDate: minStart ? isoFormatter(minStart) : null,
			lDate: maxEnd ? isoFormatter(maxEnd) : null
		};
	}

	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());
		const tags = $filterGanttTag;

		if (!start && !end && tags.length === 0) {
			filteredGantt = ganttchart;
			return;
		}

		filteredGantt = ganttchart.filter((task) => {
			const taskStart = new Date(task.start);
			const taskEnd = new Date(task.end);
			const taskTags = task.tags || [];
			let filterDateBool = true;

			if (start) {
				if (!taskStart) {
					filterDateBool = false;
				} else if (!taskEnd) {
					filterDateBool = start <= taskStart && taskStart <= end;
				} else if (taskStart > end || taskEnd < start) {
					filterDateBool = false;
				}
			}

			return filterDateBool && (taskTags.some((tag) => tags.includes(tag)) || tags.length === 0);
		});
	});

	$effect(() => (ganttchartMap = transformData(filteredGantt)));

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
		try {
			const response = await fetch(`${API_BASE_URL}/v2/projects/${projectId}`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			project = json;
		} catch (error) {
			console.log('Fetch error:', error);
		}
		// fetch tags เหมือนหน้า /project
		try {
			const response = await fetch(`${API_BASE_URL}/v2/tags/`, {
				headers: {
					Authorization: auth
				}
			});
			const json = await response.json();
			const temp = json.filter((tag) => !tag.isProject).map((tag) => tag.name);
			tagsList.set(temp);
		} catch (error) {
			console.log('Fetch error:', error);
		}
	});
</script>

<div class="flex flex-col gap-4 px-20">
	<h1 class="font-Anuphan text-5xl font-semibold">{project.title}</h1>
	<section class="flex flex-wrap gap-2">
		<DateFilter />
		<TagFilter />
	</section>
	<section class="h-[650px] overflow-y-auto rounded-md border bg-white">
		{#key filteredGantt}
			<GanttChart {ganttchartMap} />
		{/key}
	</section>
</div>
