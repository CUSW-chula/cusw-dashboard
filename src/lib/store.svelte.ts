import { writable } from 'svelte/store';
import type { DateValue } from '@internationalized/date';
export const filterDate = writable<{
	date: {
		start: DateValue | undefined;
		end: DateValue | undefined;
	};
}>({
	date: {
		start: undefined,
		end: undefined
	}
});
export const filterGanttTag = writable<string[]>([]);
export const tagsList = writable<string[]>([]);
export const sortedGantt = writable([]);
