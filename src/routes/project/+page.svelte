<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../lib/shared.js';
	import BudgetAllocation from '../../components/chart/budget-allocation.svelte';
	import ExpensesAllocation from '../../components/chart/expenses-allocation.svelte';
	import RemainingAllocation from '../../components/chart/remaining-allocation.svelte';
	import DateFilter from '../../components/filter/date-filter.svelte';
	import TagFilter from '../../components/filter/tag-filter.svelte';
	import { filterDate } from '../../lib/store.svelte.js';
	import { getLocalTimeZone } from '@internationalized/date';
	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	let ganttchart = $state([]);
	let ganttchartMap = $state([]);
	let filteredGantt = $state([]);

	function transformData(data) {
		const formatter = new Intl.DateTimeFormat('th-TH', {
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

	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());

		if (!start && !end) {
			filteredGantt = ganttchart;
			return;
		}

		filteredGantt = ganttchart.filter((task) => {
			const taskStart = new Date(task.start);
			const taskEnd = new Date(task.end);

			return taskStart <= end && taskEnd >= start;
		});
	});

	$effect(() => (ganttchartMap = transformData(filteredGantt)));

	let dashboard = $state({});
	let project = $state([]);
	let filterProject = $state([]);

	$effect(() => {
		const start = $filterDate.date.start?.toDate(getLocalTimeZone());
		const end = $filterDate.date.end?.toDate(getLocalTimeZone());

		if (!start || !end) {
			filterProject = project;
			return;
		}

		filterProject = project.filter((task) => {
			const taskStart = new Date(task.startDate);
			const taskEnd = new Date(task.endDate);

			return taskStart <= end && taskEnd >= start;
		});
	});

	$effect(() => {
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
		/* fetch data for ganttchart */
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
			project = json;
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
