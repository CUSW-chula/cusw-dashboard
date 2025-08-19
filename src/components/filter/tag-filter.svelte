<script lang="ts">
	import { writable, get } from 'svelte/store';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { tagsList, filterGanttTag } from '$lib/store.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check } from 'lucide-svelte';

	/** Prop: ฟังก์ชัน callback เมื่อ tag เปลี่ยน */
	export let onSelectTagChange: (values: string[]) => void = () => {};
	// local state
	const selectedValues = writable<string[]>([]);
	const isPopoverOpen = writable(false);
	let inputValue = '';
	// ---- side effects ----
	// 1) sync ไป global filterTag / callback parent
	selectedValues.subscribe((vals) => {
		filterGanttTag.set(vals);
		onSelectTagChange(vals);
	});

	// ---- helper ----
	function toggleOption(val: string) {
		selectedValues.update((cur) =>
			cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val]
		);
	}

	function toggleAll() {
		const allValues = get(tagsList);
		selectedValues.update((cur) => (cur.length === allValues.length ? [] : allValues));
	}

	function handleClear() {
		selectedValues.set([]);
	}

	function handleInputKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') isPopoverOpen.set(true);
		else if (e.key === 'Backspace' && !inputValue) {
			selectedValues.update((cur) => cur.slice(0, -1));
		}
	}
</script>

<!-- ---------- UI ---------- -->
<Popover.Root bind:open={$isPopoverOpen}>
	<Popover.Trigger>
		<Button
			on:click={() => isPopoverOpen.update((o) => !o)}
			class="border-brown text-brown flex h-10 cursor-pointer items-center gap-2 rounded-[6px] border bg-white hover:bg-white"
		>
			<span
				class="font-BaiJamjuree class:text-black
                   text-sm font-bold={$selectedValues.length}
                   class:text-brown font-normal={!$selectedValues.length}"
			>
				Select {$selectedValues.length} tag(s)
			</span>
		</Button>
	</Popover.Trigger>

	<Popover.Content class="p-0">
		<Command.Root>
			<Command.Input
				placeholder="Type a tag..."
				bind:value={inputValue}
				on:keydown={handleInputKeyDown}
			/>

			<Command.List>
				<Command.Empty>No results found.</Command.Empty>

				<!-- tag rows -->
				{#each $tagsList as tag}
					<Command.Item
						><button
							on:click={() => toggleOption(tag)}
							class="flex h-full w-full cursor-pointer items-center"
						>
							<div
								class="border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border opacity-50
                "
								class:[&_svg]:invisible={!$selectedValues.includes(tag)}
								class:text-primary-foreground={$selectedValues.includes(tag)}
								class:opacity-50={!$selectedValues.includes(tag)}
								class:[&_svg\\:visible]={$selectedValues.includes(tag)}
							>
								<Check class="text-black" />
							</div>

							<span>{tag}</span>
						</button>
					</Command.Item>
				{/each}

				<Command.Separator />

				<!-- footer -->
				<div class="absolute bottom-0 flex w-full justify-between">
					{#if $selectedValues.length}
						<button
							on:click={handleClear}
							class="flex-1 cursor-pointer justify-center"
							type="button"
						>
							Clear
						</button>
					{/if}
					<button
						on:click={() => isPopoverOpen.set(false)}
						class="flex-1 cursor-pointer justify-center"
						type="button"
					>
						Close
					</button>
				</div>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
