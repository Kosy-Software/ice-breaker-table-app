<script lang="ts">
    import axios from "axios";
    import { createEventDispatcher } from "svelte";
    import type { ClientEvent } from "../lib/clientEvents";
    import type { QuestionPackListItem } from "../lib/questionPack";
    import { questionPacks } from "../lib/temporaryStore";
    import Loading from "./Loading.svelte";
    import Tags from "./Tags.svelte";    
    type PickQuestionEvent = { message: ClientEvent };

    $: questionPackPromise = Promise.resolve<QuestionPackListItem[]>(questionPacks); 
    //axios.get<QuestionPackListItem[]>(`//jsonplaceholder.typeicode.com/users?keywords=${keywords.join(",")}`).then((result) => result.data);

    var dispatch = createEventDispatcher<PickQuestionEvent>();

    const pickQuestionPack = (questionPack: QuestionPackListItem) => {
        dispatch("message", { type: "questionPackPicked", questionPackId: questionPack.id, nextQuestionIdx: 0 });
    };

    //Times out after 3 seconds to show a loading screen if necessary
    let showLoadingPromise: Promise<void> = new Promise((resolve, _reject) => {
        setTimeout(() => { resolve(); }, 3000);
    });
</script>

{#await questionPackPromise}
    {#await showLoadingPromise then _data}
        <Loading msg="Loading question packs"></Loading>
    {/await}
{:then questionPacks}
    <ul>
        {#each questionPacks as questionPack}
            <li on:click={() => pickQuestionPack(questionPack)}>{questionPack.name} {questionPack.isPublic ? "(public)" : ""} <Tags values={questionPack.keywords}></Tags></li>
        {/each}
    </ul>
{/await}