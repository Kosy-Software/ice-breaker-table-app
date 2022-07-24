<script lang="ts">
    import type { IQuestionPackListItem } from "../lib/questionPack";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function passClick(event: MouseEvent) {
        dispatch('click', event);
    }

    export var value: IQuestionPackListItem;
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
        cursor: pointer;
    }

    .question-pack-header i {
        font-size: 32px;
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
    <div class="question-pack-header"><i class="{value.icon}"></i></div>
    <div class="question-pack-app">{value.name}</div>
</div>