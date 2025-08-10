<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../components/gantt-chart.svelte';
	import { API_BASE_URL } from '../../lib/shared.js';
	import BudgetAllocation from '../../components/chart/budget-allocation.svelte';
	import ExpensesAllocation from '../../components/chart/expenses-allocation.svelte';
	import RemainingAllocation from '../../components/chart/remaining-allocation.svelte';
	import BudgetAllocation_byProject from '../../components/chart_byProject/budget-allocation.svelte';
	import ExpensesAllocation_byProject from '../../components/chart_byProject/expenses-allocation.svelte';
	import RemainingAllocation_byProject from '../../components/chart_byProject/remaining-allocation.svelte';
	import DateFilter from '../../components/filter/date-filter.svelte';
	import TagFilter from '../../components/filter/tag-filter.svelte';
	import BackButton from '../../components/back-button.svelte';
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
			const progress = item.progress+' %'
			const newEnd = new Date(end);
			newEnd.setDate(end.getDate() + 1);

			// Update min/max
			if (!minStart || start < minStart) minStart = start;
			if (!maxEnd || newEnd > maxEnd) maxEnd = newEnd;

			projects.push({
				...item,
				newStart: formatter.format(start),
				newEnd: formatter.format(end),
				end: newEnd.toISOString(),
				progress: progress
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
			if (start) {
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
	let overallMoney = $state({}); // overall money object for remaining allocation chart

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

			// Handling date filtering
			if (start) {
				if (!projStart) {
					filterDateBool = false;
				} else if (!projEnd) {
					filterDateBool = projStart <= start && start <= projEnd;
				} else if (projStart > end || projEnd < start) {
					filterDateBool = false;
				}
			}

			const bool =
				filterDateBool && (projTags.some((tag) => tags.includes(tag)) || tags.length === 0);
			return bool;
		});
	});

	function calculateTagSummary(
		projects,
		key // 'budget' or 'expense'
	) {
		return projects.reduce((arr, proj) => {
			const tags = proj.tags?.map((t) => t.name) ?? ['other'];
			tags.forEach((tag) => {
				if (!filterTag.includes(tag)) return;
				const index = arr.findIndex((item) => item.tag === tag);
				if (index === -1) {
					arr.push({ tag, [key]: proj[key] });
				} else {
					arr[index][key] += proj[key];
				}
			});
			return arr;
		}, []);
	}

	$effect(() => {
		const sumBudget = filterProject.reduce((sum, proj) => sum + proj.budget, 0);
		const sumExpense = filterProject.reduce((sum, proj) => sum + proj.expense, 0);

		const tag_budget = calculateTagSummary(filterProject, 'budget');
		const tag_expense = calculateTagSummary(filterProject, 'expense');

		const projectList = filterProject.map((pj) => ({
			projectName: pj.title,
			budget: pj.budget,
			budgetPercent: calPercentageMoney(pj.budget, sumBudget),
			expense: pj.expense,
			expensePercent: calPercentageMoney(pj.expense, sumExpense)
		}));

		const result = {
			sumBudget,
			sumExpense,
			tag_budget,
			tag_expense,
			projectList
		};

		if (filterTag.length === 0) {
			Object.assign(overallMoney, result);
			dashboard = {};
		} else {
			Object.assign(dashboard, result);
			Object.assign(overallMoney, result);
		}
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

	function calPercentageMoney(value, sum) {
		if (sum === 0) return '0.00%';

		const percentage = (value / sum) * 100;
		return `${percentage.toFixed(2)}%`;
	}
</script>

<div class="flex flex-col gap-4 px-20">
	<h1 class="font-Anuphan text-5xl font-semibold">Project Data Overview</h1>
	<!-- <section class="flex gap-2 bg-black"> -->
	<section class="flex min-w-full flex-row">
		<div class="flex justify-start gap-2">
			<DateFilter />
			<TagFilter />
		</div>
		<div class="flex w-full justify-end">
			<BackButton />
		</div>
	</section>
	<h2 class="font-Anuphan text-3xl font-semibold">Gantt Chart</h2>
	<section class="h-[650px] overflow-y-auto rounded-md border bg-white">
		{#key filteredGantt}
			<GanttChart {ganttchartMap} />
		{/key}
	</section>
	<h2 class="font-Anuphan text-3xl font-semibold">Money Allocation</h2>
	<section class="grid grid-cols-3 gap-3">
		{#key dashboard}
			<RemainingAllocation {overallMoney} />
			<BudgetAllocation {dashboard} />
			<ExpensesAllocation {dashboard} />
		{/key}
	</section>
</div>
