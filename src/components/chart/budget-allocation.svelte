<script lang="ts">
	import { PieChart } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Circle } from 'lucide-svelte';

	let { dashboard } = $props();
	const colorList = ['#69BCA0', '#489CFF', '#F4BE38', '#F79939', '#D36FFF', '#FF6B6B'];

	function getColorByIndex(index: number): string {
		return colorList[index % colorList.length];
	}
	const chartData = $derived(() =>
		dashboard.tag_budget
			? [...dashboard.tag_budget]
					.sort((a, b) => b.budget - a.budget)
					.map((project, index) => ({
						tag: project.tag,
						budget: project.budget,
						color: getColorByIndex(index)
					}))
			: []
	);

	const chartConfig = $derived(
		() =>
			dashboard.tag_budget?.reduce((acc, proj) => {
				acc[proj.tag] = {
					label: proj.tag
				};
				return acc;
			}, {}) satisfies Chart.ChartConfig
	);
</script>

<Card.Root class="flex flex-col">
	<Card.Header class="items-center justify-center gap-4 text-center">
		<Card.Title>การจัดสรรงบประมาณ</Card.Title>
		<Card.Description class="text-black"
			>งบประมาณทั้งหมด {dashboard.sumBudget?.toLocaleString('th-TH', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) ?? '0'} บาท</Card.Description
		>
	</Card.Header>
	<Card.Content class="w-[370px] flex-1">
		<Chart.Container config={chartConfig()} class="mx-auto aspect-square max-h-[250px]">
			{#if dashboard?.tag_budget}
				<PieChart
					data={chartData()}
					key="tag"
					value="budget"
					label={(d) =>
						d.tag
							.split('')
							.map((c, i) => (i === 0 ? c.toUpperCase() : c))
							.join('')}
					cRange={chartData().map((d) => d.color)}
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
				<p class="text-center text-gray-500">ไม่พบข้อมูล</p>
			{/if}
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex flex-wrap justify-center gap-2 text-sm">
		{#each chartData() as item}
			<legend class="flex items-center gap-1">
				<Circle class="h-[14px] w-[14px]" fill={item.color} style="color: {item.color}" />
				{item.tag}
				{((item.budget / dashboard.sumBudget) * 100).toFixed(2)} %
			</legend>
		{/each}
	</Card.Footer>
</Card.Root>
