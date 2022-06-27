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

        background-color: coral;
        border-radius: 5px;
        border-color: black;
        border-width: 1px;
        font-size: small;
        padding: 3px;
    }
</style>

<span>
    {#each values as value}
        <span class="tag">{value}</span>
    {/each}
</span>