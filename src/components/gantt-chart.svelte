<script>
	import { Gantt, Willow } from 'wx-svelte-gantt';

	let { ganttchartMap } = $props();

	const tasks = ganttchartMap.projects;

	const columns = [
		{ id: 'text', header: 'Title', flexgrow: 2 },
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
		},
		{
			id: 'progress_string',
			header: 'Progress',
			align: 'center',
			flexgrow: 1
		}
	];

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
				minCellWidth: 80,
				maxCellWidth: 80,
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
		zoom={zoomConfig}
		{readonly}
		scales={complexScales}
		{lengthUnit}
		start={ganttchartMap.first_display_date}
	/>
</Willow>
