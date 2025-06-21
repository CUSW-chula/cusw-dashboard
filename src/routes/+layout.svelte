<script lang="ts">
	import '../app.css';
	import NavBar from '../components/nav-bar.svelte';
	let { children } = $props();
</script>

<NavBar />
{@render children()}
