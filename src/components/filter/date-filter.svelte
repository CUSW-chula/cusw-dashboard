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
	import { RangeCalendarEdited } from '$lib/components/ui/range-calendar-wai/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange = $state({
		start: undefined,
		end: undefined
	});

	let startValue: DateValue | undefined = $state(undefined);
	let endValue: DateValue | undefined = $state(undefined);
	//let yearRange: number[] that start from 2024 to thisyear + 3 but is this year + 3 
	let yearRange: number[] = $state(
		Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i - 2)
	);


	const handleValueChange = (dateRange: DateRange) => {
		startValue = dateRange.start;
		endValue = dateRange.end;
		console.log('Selected Range:', {
			start: startValue ? startValue.toDate(getLocalTimeZone()) : null,
			end: endValue ? endValue.toDate(getLocalTimeZone()) : null
		});
	};
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
			<RangeCalendarEdited
				bind:value
				onValueChange={(dateRange) => handleValueChange(dateRange)}
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
