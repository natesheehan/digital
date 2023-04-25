<script lang="ts">
	import { drawerStore } from "@skeletonlabs/skeleton";

    function drawerClose(): void {
        drawerStore.close();
    }
</script>

<nav class="list-nav  p-4">
    <ul>
        <li><a href="/" on:click={drawerClose}>BIO</a></li>
        <li><a href="/projects" on:click={drawerClose}>SOFTWARE</a></li>
        <li><a href="/writing" on:click={drawerClose}>PUBLICATIONS</a></li>
        <li><a href="/poems" on:click={drawerClose}>PROSE</a></li>
    </ul>
</nav>