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
		dashboard.tag_expense
			? [...dashboard.tag_expense]
					.sort((a, b) => b.expense - a.expense)
					.map((project, index) => ({
						tag: project.tag,
						expense: project.expense,
						color: getColorByIndex(index)
					}))
			: []
	);

	const chartConfig = $derived(
		() =>
			dashboard.tag_expense?.reduce((acc, proj) => {
				acc[proj.tag] = {
					label: proj.tag
				};
				return acc;
			}, {}) satisfies Chart.ChartConfig
	);
</script>

<Card.Root class="flex min-h-[430px] w-full flex-col">
	<Card.Header class="flex w-full min-h-[62px] flex-col items-center justify-start gap-1 text-center">
		<Card.Title class="text-brown text-xl font-Anuphan">งบฯค่าใช้จ่ายจริงของโครงการ</Card.Title>
		<Card.Description class="text-black font-Baijamjuree text-md"
			>ค่าใช้จ่ายทั้งหมด <span class="text-red-500"
				>{dashboard.sumExpense?.toLocaleString('th-TH', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				}) ?? '0'}</span
			> บาท</Card.Description
		>
	</Card.Header>
	<Card.Content class="w-full flex-1">
		<Chart.Container config={chartConfig()} class="mx-auto aspect-square max-h-[250px]">
			{#if dashboard?.tag_expense}
				<PieChart
					data={chartData()}
					key="tag"
					value="expense"
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
				<p class="text-center text-sm text-gray-500">กรุณาเลือกแท็ก</p>
			{/if}
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex w-full flex-wrap items-start justify-center gap-2 text-sm">
		{#each chartData() as item}
			{#if item.expense > 0}
				<legend class="flex items-center gap-1">
					<Circle class="h-[14px] w-[14px]" fill={item.color} style="color: {item.color}" />
					{item.tag}
					{((item.expense / dashboard.sumExpense) * 100).toFixed(2)} %
				</legend>
			{/if}
		{/each}
	</Card.Footer>
</Card.Root>
