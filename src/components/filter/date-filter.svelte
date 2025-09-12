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
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index2.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { filterDate } from '$lib/store.svelte.js';
	import { parseDate } from '@internationalized/date';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange = $state({
		start: parseDate(`${new Date().getFullYear() - 1}-10-01`),
		end: parseDate(`${new Date().getFullYear()}-09-30`)
	});

	let startValue: DateValue | undefined = $state(undefined);
	let isOpen = $state(false);
	let refDate: DateRange = $state({ start: undefined, end: undefined });

	function resetDate() {
		filterDate.set({
			date: {
				start: undefined,
				end: undefined
			}
		});
		value = {
			start: undefined,
			end: undefined
		};
		isOpen = false; // Close popover after reset
	}
	function applyDate() {
		filterDate.set({
			date: {
				start: value.start,
				end: value.end
			}
		});
		refDate = { ...value };
		isOpen = false; // Close popover after applying
	}
	function closePopover(isOpen: boolean) {		
		if (isOpen) return;
		isOpen = false;
		value = { ...refDate };
	}
</script>

<div class="grid gap-2">
	<Popover.Root bind:open={isOpen} onOpenChange={(open) => closePopover(open)}>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline' }),
				value && value.start ? 'font-bold' : 'font-normal',
				'border-brown text-brown h-[40px] w-[240px] cursor-pointer justify-start rounded-[6px]'
			)}
		>
			<CalendarIcon class="size-4 font-normal" />
			{#if value && value.start}
				{#if value.end}
					{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
						value.end.toDate(getLocalTimeZone())
					)}
				{:else}
					{df.format(value.start.toDate(getLocalTimeZone()))}
					-
					{df.format(value.start.toDate(getLocalTimeZone()))}
				{/if}
			{:else if startValue}
				{df.format(startValue.toDate(getLocalTimeZone()))}
			{:else}
				Filter by date
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				onStartValueChange={(v) => {
					startValue = v;
				}}
				numberOfMonths={2}
				className="cursor-pointer"
			/>
			<div class="flex justify-end gap-2 pr-2 pb-2">
				<button
					onclick={resetDate}
					class="border-brown text-brown h-[32px] cursor-pointer rounded-[6px] border px-2 text-sm hover:bg-gray-50"
					>Reset</button
				>
				<button
					onclick={applyDate}
					class="bg-brown h-[32px] cursor-pointer rounded-[6px] px-2 text-sm text-white hover:bg-black"
					>Apply</button
				>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
