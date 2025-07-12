<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../lib/shared.js';
	import BudgetAllocation from '../../components/chart/budget-allocation.svelte';
	import ExpensesAllocation from '../../components/chart/expenses-allocation.svelte';
	import RemainingAllocation from '../../components/chart/remaining-allocation.svelte';
	import DateFilter from '../../components/filter/date-filter.svelte';
	import TagFilter from '../../components/filter/tag-filter.svelte';
	import { filterDate, tagsList, filterGanttTag } from '../../lib/store.svelte.js';
	import { getLocalTimeZone } from '@internationalized/date';
	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	let ganttchart = $state([]);
	let ganttchartMap = $state([]);
	let filterProject = $state([]); // projects filtered by date
	let filteredGantt = $state([]);
	let filterTag = $state([]); // tags filtered

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

			const endPlus = new Date(end);
			endPlus.setDate(end.getDate() + 1);

			// Update min/max
			if (!minStart || start < minStart) minStart = start;
			if (!maxEnd || endPlus > maxEnd) maxEnd = endPlus;

			projects.push({
				...item,
				startF: formatter.format(start),
				endF: formatter.format(end),
				end: endPlus.toISOString()
			});
		}

		return {
			projects,
			fDate: minStart ? isoFormatter(minStart) : null,
			lDate: maxEnd ? isoFormatter(maxEnd) : null
		};
	}

	// ---- side effects ----
	// Handling filtering of gantt chart data based on date and tags
	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());
		const tags = $filterGanttTag;
		filterTag = tags; // Update the filterTag store with selected tags; Hook to dashboard.

		if (!start && !end && tags.length === 0) {
			filteredGantt = ganttchart;
			return;
		}

		filteredGantt = ganttchart.filter((proj) => {
			const projStart = new Date(proj.start);
			const projEnd = new Date(proj.end);
			const projTags = proj.tag;
			let filterDateBool = true;

			// Handling date filtering
			if (!start) {
				if (!projStart) {
					filterDateBool = false;
				} else if (!projEnd) {
					filterDateBool = start <= projStart && projStart <= end;
				} else if (projStart > end || projEnd < start) {
					filterDateBool = false;
				}
			}

			const bool =
				filterDateBool && (projTags.some((tag) => tags.includes(tag)) || tags.length === 0);
			return bool;
		});
	});

	$effect(() => (ganttchartMap = transformData(filteredGantt)));

	let project = $state([]); // all projects fetched from the API
	let dashboard = $state({}); //new dashboard object

	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());
		const tags = $filterGanttTag;

		if (!start && !end && tags.length === 0) {
			filterProject = project;
			return;
		}

		filterProject = project.filter((proj) => {
			const projStart = new Date(proj.startDate);
			const projEnd = new Date(proj.endDate);
			const projTags = proj.tags.map((t) => t.name);
			let filterDateBool = true;
			// console.log('proj', proj, projStart, projEnd, projTags);

			// Handling date filtering
			if (!start) {
				if (!projStart) {
					filterDateBool = false;
				} else if (!projEnd) {
					filterDateBool = start <= projStart && projStart <= end;
				} else if (projStart > end || projEnd < start) {
					filterDateBool = false;
				}
			}

			const bool =
				filterDateBool && (projTags.some((tag) => tags.includes(tag)) || tags.length === 0);
			console.log('bool', bool, projTags, tags);
			return bool;
		});
	});

	$effect(() => {
		if (filterProject.length === 0) {
			dashboard = {};
			return;
		}
		const sumBudget = filterProject.reduce((sum, proj) => sum + proj.budget, 0);
		const sumExpense = filterProject.reduce((sum, proj) => sum + proj.expense, 0);

		const tag_budget = filterProject.reduce((arr, proj) => {
			const tags = proj.tags?.map((t) => t.name) ?? ['other'];

			tags.forEach((tag) => {
				const index = arr.findIndex((item) => item.tag === tag);

				if (index === -1) {
					arr.push({ tag, budget: proj.budget });
				} else {
					arr[index].budget += proj.budget;
				}
			});

			return arr;
		}, []);

		const tag_expense = filterProject.reduce((arr, proj) => {
			const tags = proj.tags?.map((t) => t.name) ?? ['other'];

			tags.forEach((tag) => {
				const index = arr.findIndex((item) => item.tag === tag);

				if (index === -1) {
					arr.push({ tag, expense: proj.expense });
				} else {
					arr[index].expense += proj.expense;
				}
			});

			return arr;
		}, []);

		Object.assign(dashboard, {
			sumBudget,
			sumExpense,
			tag_budget,
			tag_expense
		});
	});

	onMount(async () => {
		/* fetch data for ganttchart and all projects*/
		try {
			const response = await fetch(`${API_BASE_URL}/v2/ganttchart/project`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			ganttchart = [...json];
			filteredGantt = [...json];
		} catch (error) {
			console.log('Fetch error:', error);
		}

		try {
			const response = await fetch(`${API_BASE_URL}/v2/projects/`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			project = [...json];
			console.log('project', project);
		} catch (error) {
			console.log('Fetch error:', error);
		}

		/* fetch data*/
		try {
			const response = await fetch(`${API_BASE_URL}/v2/tags/`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			const temp = json
				.filter((tag) => {
					if (tag.isProject) return tag;
				})
				.map((tag) => tag.name);
			tagsList.set(temp);
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
		{#key filteredGantt}
			<GanttChart {ganttchartMap} />
		{/key}
	</section>
	<section class="flex flex-wrap justify-evenly">
		{#key dashboard}
			<RemainingAllocation {dashboard} />
			<BudgetAllocation {dashboard} />
			<ExpensesAllocation {dashboard} />
		{/key}
	</section>
</div>
