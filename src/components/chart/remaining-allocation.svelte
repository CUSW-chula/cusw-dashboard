<script lang="ts">
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { PieChart, Text } from 'layerchart';
	import { Circle } from 'lucide-svelte';

	let { dashboard } = $props();

	const chartData = [{ expense: dashboard.sumExpense, budget: dashboard.sumBudget }];
	const chartConfig = {
		budget: { label: 'เงินคงเหลือ', color: '#489CFF' },
		expense: { label: 'ค่าใช้จ่าย', color: '#EF4444' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex min-h-[430px] w-full flex-col">
	<Card.Header class="flex min-h-[62px] w-full flex-col items-center justify-start gap-1 text-center">
		<Card.Title class="text-brown text-xl font-Anuphan">ภาพรวมของงบฯโครงการ</Card.Title>
		<Card.Description class="flex flex-wrap items-center justify-center text-center text-black font-Baijamjuree text-md gap-1"
			><p>
				เงินคงเหลือ {dashboard.sumBudget?.toLocaleString('th-TH', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				}) ?? '0'} บาท
			</p>
			<p>
				ค่าใช้จ่าย
				<span class="text-red-500">
					{dashboard.sumExpense?.toLocaleString('th-TH', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}) ?? '0'}</span
				> บาท
			</p></Card.Description
		>
	</Card.Header>
	{#if dashboard?.tag_budget}
		<Card.Content class="w-full flex-1 justify-center">
			<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
				<PieChart
					data={[
						{ type: 'budget', money: dashboard.sumBudget, color: chartConfig.expense.color },
						{ type: 'expense', money: dashboard.sumExpense, color: chartConfig.budget.color }
					]}
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
							value="เงินคงเหลือ"
							textAnchor="middle"
							verticalAnchor="middle"
							class="fill-foreground text-black!"
							dy={-32}
						/>
						<Text
							value="฿ {(dashboard.sumBudget - dashboard.sumExpense)?.toLocaleString('th-TH', {
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
						<Chart.Tooltip hideLabel />
					{/snippet}
				</PieChart>
			</Chart.Container>
		</Card.Content>
		<Card.Footer class="flex h-full w-full items-start justify-center gap-2 text-sm ">
			<legend class="flex items-center gap-1"
				><Circle class="h-[14px] w-[14px] text-[#489CFF]" fill="#489CFF" />{chartConfig.budget
					.label}
				{((dashboard.sumBudget / (dashboard.sumBudget + dashboard.sumExpense)) * 100).toFixed(2)} %</legend
			>
			<legend class="flex items-center gap-1"
				><Circle class="h-[14px] w-[14px] text-[#EF4444]" fill="#EF4444" />{chartConfig.expense
					.label}
				{((dashboard.sumExpense / (dashboard.sumBudget + dashboard.sumExpense)) * 100).toFixed(2)} %</legend
			>
		</Card.Footer>
	{:else}
		<p class="text-center text-sm text-gray-500">กรุณาเลือกแท็ก</p>
	{/if}
</Card.Root>
