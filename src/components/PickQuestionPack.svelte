<script lang="ts">
    import Button from "@kosy/kosy-svelte-components/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import type { ClientEvent } from "../lib/clientEvents";
    import { delay } from "../lib/helpers";
    import type { IQuestionPackListItem } from "../lib/questionPack";
    import { questionPacks } from "../lib/temporaryStore";
    import Loading from "./Loading.svelte";
    import QuestionPackCard from "./QuestionPackCard.svelte";
    
    type PickQuestionEvent = { message: ClientEvent };

    $: publicQuestionPackPromise = Promise.all([delay(2000), Promise.resolve<IQuestionPackListItem[]>(questionPacks.filter(pack => pack.isPublic))]).then(x => x[1]); 
    $: customQuestionPackPromise = Promise.all([delay(2000), Promise.resolve<IQuestionPackListItem[]>(questionPacks.filter(pack => !pack.isPublic))]).then(x => x[1]);
    //axios.get<QuestionPackListItem[]>(`//jsonplaceholder.typeicode.com/users?keywords=${keywords.join(",")}`).then((result) => result.data);

    var dispatch = createEventDispatcher<PickQuestionEvent>();

    const pickQuestionPack = (questionPack: IQuestionPackListItem) => {
        dispatch("message", { type: "questionPackPicked", questionPackId: questionPack.id, nextQuestionIdx: 0 });
    };

    const editQuestionPack = (questionPack: IQuestionPackListItem) => {
        dispatch("message", { type: "questionPackEditRequested", questionPackId: questionPack.id });
    }

    const createQuestionPack = () => {
        dispatch("message", { type: "questionPackCreationRequested" });
    }
</script>

<style lang="scss">
    @use "../styles/_colors.scss" as colors;

    #main {
        .title {
            display: flex;
            gap: 12px;
        }

        height: 100%;

        > div:not(:last-child) {
            padding-bottom: 24px;
        }

        .placeholder {
            font-style: italic;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            color: colors.$color-grey-darker;
        }
        .question-packs {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }
    }
</style>

<div id="main">
    <div class="title">
        <img src="assets/favorite.svg" alt="Favorite icon" />
        <div style="flex-grow: 1">
            <h5>Your icebreakers</h5>
            <span>Launch your own question pack or create a new one</span>
        </div>
        {#if questionPacks.length < 50}
            <Button size="small" importance="primary" on:click={() => createQuestionPack()}><span class="text">+ Question pack</span></Button>
        {/if}
    </div>
    <div class="custom-packs">
        {#await customQuestionPackPromise}
            <Loading msg="Loading question packs" delay={20}></Loading>
        {:then questionPacks}
            <div class="question-packs">
                {#each questionPacks as questionPack}
                    <QuestionPackCard value={questionPack} on:click={() => pickQuestionPack(questionPack)}></QuestionPackCard>
                    <Button importance="tertiary" on:click={() => editQuestionPack(questionPack)}>EDIT</Button>
                {:else}
                    <span class="placeholder">Create your own question pack to make your happy hours more fun.</span>
                {/each}
            </div>
        {/await}
    </div>
    <div class="title">
        <img src="assets/rocket.svg" alt="Recommended icon" />
        <div style="flex-grow: 1">
            <h5>Kosy recommends</h5>
            <span>Pick one of our custom question packs</span>
        </div>
    </div>
    <div>
        {#await publicQuestionPackPromise}
            <Loading msg="Loading question packs" delay={20}></Loading>
        {:then questionPacks}
            <div class="question-packs">
                {#each questionPacks as questionPack}
                    <QuestionPackCard value={questionPack} on:click={() => pickQuestionPack(questionPack)}></QuestionPackCard>
                    <Button importance="tertiary" on:click={() => editQuestionPack(questionPack)}>EDIT</Button>
                {:else}
                    <span>Apparently, we haven't created our own question packs (yet)</span>
                {/each}
            </div>
        {/await}
    </div>
</div>