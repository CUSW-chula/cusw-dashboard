<script lang="ts">
	import { PieChart } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	export let dashboard;

	let chartData = dashboard.projects;

	function randomColor(budget: number): string {
		const letters = '0123456789ABCDEF';
		let color = ['#69BCA0','#489CFF','#F4BE38','#F79939'];
		return color[Math.floor(Math.random() * color.length)];
	}
	const chartConfig = {
		visitors: { label: 'Visitors' },
		bb: { label: 'bb', color: 'var(--chart-1)' },
		aa: { label: 'aa', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col">
	<Card.Header class="items-center justify-center gap-4 text-center">
		<Card.Title>การจัดสรรงบประมาณ</Card.Title>
		<Card.Description>งบประมาณทั้งหมด {dashboard.sumBudget} บาท</Card.Description>
	</Card.Header>
	<Card.Content class="w-[370px] flex-1">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
			{#if dashboard?.projects}
				<PieChart
					data={dashboard.projects}
					key="projectTag"
					value="budget"
					label={(d) =>
						d.projectTag
							.split('')
							.map((c, i) => (i === 0 ? c.toUpperCase() : c))
							.join('')}
					cRange={dashboard.projects.map((d) => randomColor(d.budget))}
					props={{
						pie: {
							motion: 'tween'
						}
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel />
					{/snippet}
				</PieChart>
			{:else}
				<p class="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
			{/if}
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex-col gap-2 text-sm"></Card.Footer>
</Card.Root>
