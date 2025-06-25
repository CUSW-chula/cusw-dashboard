<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { parseDate } from '@internationalized/date';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange = $state({
		start: undefined,
		end: undefined
	});

	let startValue: DateValue | undefined = $state(undefined);
	let endValue: DateValue | undefined = $state(undefined);

	let currentYear = $state(new Date().getFullYear());
	let currentMonth = $state(new Date().getMonth() + 1);

	const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
	const months = [
		{ value: 1, label: 'January' },
		{ value: 2, label: 'February' },
		{ value: 3, label: 'March' },
		{ value: 4, label: 'April' },
		{ value: 5, label: 'May' },
		{ value: 6, label: 'June' },
		{ value: 7, label: 'July' },
		{ value: 8, label: 'August' },
		{ value: 9, label: 'September' },
		{ value: 10, label: 'October' },
		{ value: 11, label: 'November' },
		{ value: 12, label: 'December' }
	];

	const handleValueChange = (dateRange: DateRange) => {
		startValue = dateRange.start;
		endValue = dateRange.end;
		console.log('Selected Range:', {
			start: startValue ? startValue.toDate(getLocalTimeZone()) : null,
			end: endValue ? endValue.toDate(getLocalTimeZone()) : null
		});
	};
	function jumpAndUnselect() {
		// 1️⃣ set วันที่ 1 เพื่อให้ calendar ข้ามไปเดือนนั้น
		const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
		value = {
			start: parseDate(dateStr),
			end: undefined
		};

		// 2️⃣ unselct ทันทีหลัง render (next tick)
		setTimeout(() => {
			value = {
				start: undefined,
				end: undefined
			};
		}, 0);
	}
</script>

<div class="grid gap-2">
	<Popover.Root>
		<Popover.Trigger
			class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
		>
			<CalendarIcon class="mr-2 size-4" />
			{#if value && value.start}
				{#if value.end}
					{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
						value.end.toDate(getLocalTimeZone())
					)}
				{:else}
					{df.format(value.start.toDate(getLocalTimeZone()))}
				{/if}
			{:else if startValue}
				{df.format(startValue.toDate(getLocalTimeZone()))}
			{:else}
				Pick a date
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<div class="mb-2 flex gap-2">
				<select bind:value={currentMonth} on:change={jumpAndUnselect}>
					{#each months as month}
						<option value={month.value}>{month.label}</option>
					{/each}
				</select>

				<select bind:value={currentYear} on:change={jumpAndUnselect}>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>

			<RangeCalendar bind:value numberOfMonths={2} onValueChange={handleValueChange} />
		</Popover.Content>
	</Popover.Root>
</div>
