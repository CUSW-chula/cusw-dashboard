<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index2.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { PieChart, Text } from 'layerchart';
	import { Circle } from 'lucide-svelte';

	let { overallMoney } = $props();

	const chartConfig = {
		remain: { label: 'เงินคงเหลือ', color: '#EF4444' },
		expense: { label: 'ค่าใช้จ่าย', color: '#489CFF' }
	} satisfies Chart.ChartConfig;

	const chartData = [
		{
			type: 'expense',
			money: ((overallMoney.sumExpense * 100) / overallMoney.sumBudget).toFixed(2),
			color: chartConfig.remain.color
		},
		{
			type: 'remain',
			money: (
				((overallMoney.sumBudget - overallMoney.sumExpense) / overallMoney.sumBudget) *
				100
			).toFixed(2),
			color: chartConfig.expense.color
		}
	];
</script>

<Card.Root class="flex min-h-[430px] w-full flex-col">
	<Card.Header
		class="flex min-h-[62px] w-full flex-col items-center justify-start gap-1 text-center"
	>
		<Card.Title class="text-brown font-Anuphan text-xl">ภาพรวมของงบฯ โครงการ</Card.Title>
	</Card.Header>
	{#if overallMoney?.tag_budget}
		<Card.Content class="w-full flex-1 justify-center">
			<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
				<PieChart
					data={chartData}
					key="type"
					value="money"
					c="color"
					innerRadius={120}
					padding={24}
					range={[-140, 140]}
					props={{ pie: { sort: null } }}
					cornerRadius={20}
				>
					{#snippet aboveMarks()}
						<Text
							value="งบฯ โครงการ"
							textAnchor="middle"
							verticalAnchor="middle"
							class="fill-foreground text-black!"
							dy={-32}
						/>
						<Text
							value="฿ {overallMoney.sumBudget?.toLocaleString('th-TH', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}) ?? '0'}"
							textAnchor="middle"
							verticalAnchor="middle"
							class="fill-foreground text-2xl! font-bold"
							dy={-4}
						/>
					{/snippet}
					{#snippet tooltip()}
						<Chart.Tooltip hideLabel>
							{#snippet formatter({ name, value })}
								{chartConfig[name as keyof typeof chartConfig]?.label || name}
								<div
									class="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums"
								>
									{value}
									<span class="text-muted-foreground font-normal"> % </span>
								</div>
							{/snippet}
						</Chart.Tooltip>
					{/snippet}
				</PieChart>
			</Chart.Container>
		</Card.Content>
		<Card.Footer class="h-full w-full items-start justify-center text-sm">
			<section class="grid w-fit grid-rows-2 items-start gap-2">
				<legend class="flex items-center gap-1"
					><Circle class="text-red h-[14px] w-[14px]" fill="#EF4444" />ค่าใช้จ่าย
					{overallMoney.sumExpense.toLocaleString('th-TH', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})} บาท
				</legend>
				<legend class="flex items-center gap-1"
					><Circle class="text-blue h-[14px] w-[14px]" fill="#489CFF" />เงินคงเหลือ
					{(overallMoney.sumBudget - overallMoney.sumExpense).toLocaleString('th-TH', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})} บาท
				</legend>
			</section>
		</Card.Footer>
	{:else}
		<p class="text-center text-sm text-gray-500">กรุณาเลือกแท็ก</p>
	{/if}
</Card.Root>
