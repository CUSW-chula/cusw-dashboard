<script>
	import { onMount } from 'svelte';
	import GanttChart from '../../components/gantt-chart.svelte';
	import { BASE_URL } from '../../lib/shared.js';
	import BudgetAllocation from '../../components/chart/budget-allocation.svelte';
	import ExpensesAllocation from '../../components/chart/expenses-allocation.svelte';
	import RemainingAllocation from '../../components/chart/remaining-allocation.svelte';
	import DateFilter from '../../components/filter/date-filter.svelte';
	import TagFilter from '../../components/filter/tag-filter.svelte';
	let auth = '';
	const cookieString = document.cookie;
	const match = cookieString.match(/auth=([^;]+)/);
	if (match) {
		auth = decodeURIComponent(match[1]);
	}
	function generateRandomData(count = 5) {
		const tags = ['aa', 'bb', 'cc', 'dd', 'ee'];
		const texts = ['Design', 'Development', 'Testing', 'Deployment', 'Review'];

		const randomDate = () => {
			const start = new Date();
			const end = new Date();
			start.setDate(start.getDate() + Math.floor(Math.random() * 30));
			end.setDate(start.getDate() + Math.floor(Math.random() * 10) + 1);
			return {
				start: start.toISOString(),
				end: end.toISOString()
			};
		};

		const data = Array.from({ length: count }, (_, i) => {
			const { start, end } = randomDate();
			return {
				id: `task_${i}_${Math.random().toString(36).substring(2, 10)}`,
				text: texts[Math.floor(Math.random() * texts.length)],
				start,
				end,
				duration: 0,
				tag: tags[Math.floor(Math.random() * tags.length)]
			};
		});

		return data;
	}

	// ตัวอย่างการใช้งาน
	let ganttchart = [];
	let dashboard = [];
	onMount(async () => {
		/* fetch data for ganttchart */
		try {
			const response = await fetch(`http://localhost:4000/api/v2/ganttchart/project`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			ganttchart = [...json];
		} catch (error) {
			console.log('Fetch error:', error);
		}

		/* fetch data for dashboard */
		try {
			const response = await fetch(`http://localhost:4000/api/v2/dashboard/project`, {
				headers: {
					Authorization: auth
				}
			});

			const json = await response.json();
			console.log('Dashboard data:', auth);
			dashboard = { ...json };
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
	<section class="flex flex-wrap justify-between">
		<RemainingAllocation {dashboard} />
		<BudgetAllocation {dashboard} />
		<ExpensesAllocation {dashboard} />
	</section>
</div>
