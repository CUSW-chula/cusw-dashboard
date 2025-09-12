<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { sortedGantt } from '$lib/store.svelte.js';
	import { writable, get } from 'svelte/store';

	let { ganttchartMap = [] } = $props<{ ganttchartMap: any[] }>();
	type DateKey = 'start' | 'end';

	const sortItem = [
		{ value: 'Start123', label: 'Start date ↑' },
		{ value: 'Start321', label: 'Start date ↓' },
		{ value: 'End123', label: 'End date ↑' },
		{ value: 'End321', label: 'End date ↓' }
	];

	function toTime(v: unknown): number {
		if (!v) return Number.POSITIVE_INFINITY;
		const t = new Date(v as string).getTime();
		return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
	}

	function sortTasksByDate(tasks: any[], dateType: DateKey, asc: boolean): any[] {
		let project = tasks.projects;
		if (!project) return [];
		const withDate = project.filter((t) => t.start != null && t.end !== null);
		withDate.sort((a, b) => {
			const ta = toTime(a[dateType]);
			const tb = toTime(b[dateType]);
			return asc ? ta - tb : tb - ta;
		});

		return withDate;
	}

	function handleSort(val: string) {
		let sorted = ganttchartMap;
		switch (val) {
			case 'Start123':
				sorted = sortTasksByDate(ganttchartMap, 'start', true);
				break;
			case 'Start321':
				sorted = sortTasksByDate(ganttchartMap, 'start', false);
				break;
			case 'End123':
				sorted = sortTasksByDate(ganttchartMap, 'end', true);
				break;
			case 'End321':
				sorted = sortTasksByDate(ganttchartMap, 'end', false);
				break;
			default:
				return;
		}
		sortedGantt.set({ ...ganttchartMap, projects: sorted });
	}

	let value = $state('Start123');
	const triggerContent = $derived(sortItem.find((f) => f.value === value)?.label ?? 'Start date ↑');

	$effect(() => {
		if (value !== '') handleSort(value);
	});
</script>

<Select.Root type="single" name="taskSort" bind:value>
	<Select.Trigger
		class="border-brown text-brown font-BaiJamjuree w-[172px] rounded-[6px] bg-white font-normal focus:ring-0 focus:ring-offset-0 focus:outline-none data-[size=default]:h-[40px]"
	>
		Sort by: {triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each sortItem as item (item.value)}
				<Select.Item class="text-brown font-BaiJamjuree" value={item.value} label={item.label}>
					Sort by: {item.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
