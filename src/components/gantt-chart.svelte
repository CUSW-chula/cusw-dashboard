<script>
	import { Gantt } from 'wx-svelte-gantt';
	import { Willow } from 'wx-svelte-gantt';

	export let ganttchartMap;
	const tasks = ganttchartMap;

	const columns = [
		{ id: 'text', header: 'Task name', flexgrow: 2 },
		{
			id: 'startF',
			header: 'Start date',
			flexgrow: 1,
			align: 'center'
		},
		{
			id: 'endF',
			header: 'End date',
			align: 'center',
			flexgrow: 1
		}
	];
	const links = [{ id: 1, source: 20, target: 21, type: 'e2e' }];

	let readonly = true;
	let lengthUnit = 'month';
	const complexScales = [
		{ unit: 'year', step: 1, format: 'yyyy' },
		{ unit: 'month', step: 2, format: 'MMMM yyy' },
		{ unit: 'week', step: 1, format: 'w' }
	];
	const zoomConfig = {
		level: 2,
		levels: [
			{
				minCellWidth: 250,
				maxCellWidth: 350,
				scales: [
					{ unit: 'year', step: 1, format: 'yyyy' },
					{ unit: 'month', step: 1, format: 'MMMM' }
				]
			},

			{
				minCellWidth: 50,
				maxCellWidth: 50,
				scales: [
					{ unit: 'month', step: 1, format: 'MMMM yyy' },
					{ unit: 'day', step: 1, format: 'd' }
				]
			}
		]
	};
</script>

<Willow>
	<Gantt
		{columns}
		{tasks}
		{links}
		zoom={zoomConfig}
		{readonly}
		scales={complexScales}
		{lengthUnit}
	/>
</Willow>
