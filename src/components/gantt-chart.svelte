<script>
	import { Gantt } from 'wx-svelte-gantt';
	import { Willow } from 'wx-svelte-gantt';

	export let ganttchart;
	const tasks = ganttchart;

	const columns = [
		{ id: 'text', header: 'Task name', flexgrow: 2 },
		{
			id: 'start',
			header: 'Start date',
			flexgrow: 1,
			align: 'center'
		},
		{
			id: 'end',
			header: 'End date',
			align: 'center',
			flexgrow: 1
		}
	];
	const links = [{ id: 1, source: 20, target: 21, type: 'e2e' }];

	const scales = [
		{ unit: 'month', step: 1, format: 'MMMM yyy' },
		{ unit: 'day', step: 1, format: 'd' }
	];
	let readonly = true;
</script>

<Willow>
	<Gantt {columns} {tasks} {links} {scales} zoom={true} {readonly} />
</Willow>
