<script lang="ts">
    import type { QuestionPackListItem } from "../lib/questionPack";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function passClick(event: MouseEvent) {
        dispatch('click', event);
    }

    export var value: QuestionPackListItem;
</script>

<style lang="scss">
    @use "../styles/_colors.scss" as colors;

    .question-pack {
        flex: 1 0 15%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 24px;
        gap: 8px;
        background: colors.$color-black-bluish;
        border-radius: 12px;
    }

    .question-pack-header {
        min-width: 25.5px;
        min-height: 25.5px;
    }

    .question-pack-app {
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: colors.$color-grey-light;
    }
</style>

<div class="question-pack" on:click={passClick}>
    <div class="question-pack-header"></div>
    <div class="question-pack-app">{value.name}</div>
</div>