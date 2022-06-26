<script lang="ts">
    export var values: string[];
</script>

<style lang="scss">
    .tag {
        &:not(:first-child) {
            margin-left: 5px;
        }
        &:not(:last-child) {
            margin-right: 5px;
        }
    }
</style>

<span>
    {#each values as value}
        <span class="tag">{value}</span>
    {/each}
</span>