<script type="ts">
    import Button from "@kosy/kosy-svelte-components/Button.svelte";
    import type { GameState } from "../lib/appState";
    import { createEventDispatcher } from "svelte";
    import type { ClientEvent } from "../lib/clientEvents";
    import { clientState, questionPack } from "../lib/clientStore";
    import type { QuestionPack } from "../lib/questionPack";
    import ButtonGroup from "./ButtonGroup.svelte";
    type GameEvent = { message: ClientEvent };

    export let state: GameState;
    $: alreadyAskedQuestionIdxs = [...state.alreadyAskedQuestionsIdxs, state.currentQuestionIdx];
    let dispatch = createEventDispatcher<GameEvent>();

    let askNextQuestion = (qPack: QuestionPack) => {
        var alreadyAskedQuestionIndexesSet = new Set(alreadyAskedQuestionIdxs);
        //Filters out the already asked questions and makes sure to preserve the original question's index
        let questionsToAsk = qPack.questions.map((q, index) => { return { index } }).filter((q, index) => !alreadyAskedQuestionIndexesSet.has(index));
        //Random next question
        let nextQuestion = questionsToAsk[Math.floor(Math.random() * questionsToAsk.length)];
        //Relay next question
        dispatch("message", {
            type: "nextQuestionAsked",
            questionPackId: state.questionPackId,
            previousQuestionIdxs: alreadyAskedQuestionIdxs,
            nextQuestionIdx: nextQuestion?.index
        });
    }

    //Resets the questions and immediately asks a random question
    let resetQuestions = (qPack: QuestionPack) => {
        //Random next question
        let nextQuestionIndex = Math.floor(Math.random() * qPack.questions.length);
        //Relay reset questions
        dispatch("message", {
            type: "questionsReset",
            questionPackId: state.questionPackId,
            nextQuestionIdx: nextQuestionIndex
        });
    }

    let closeApp = () => dispatch("message", { type: "appClosed" });

    let pickAnotherQuestionPack = () => dispatch("message", { type: "anotherQuestionPackRequested" });
</script>

<style lang="scss">
    #drums {
        position: absolute;
        right: 30px;
        bottom: 39px;
        width: 260px;
        height: 260px;
    }
</style>

{#await $questionPack then qPack }
    {#if state.currentQuestionIdx !== 0 && !state.currentQuestionIdx}
        <h1>Wow! You've answered all of the questions!</h1>
        {#if $clientState.appHostClientUuid === $clientState.currentClientUuid}
            <div class="gap"></div>
            <ButtonGroup>
                <Button importance="primary" on:click={() => resetQuestions(qPack)}>
                    <span class="text">Restart</span>
                </Button>
                <Button importance="primary" on:click={() => pickAnotherQuestionPack()}>
                    <span class="text">Pick another question pack</span>
                </Button>
                <Button importance="secondary" on:click={() => closeApp()}>
                    <span class="text">Close app</span>
                </Button>
            </ButtonGroup>
        {/if}
    {:else}
        <h1>{ qPack.questions[state.currentQuestionIdx] }</h1>
        {#if $clientState.appHostClientUuid === $clientState.currentClientUuid}
            <div class="gap"></div>
            <Button importance="primary" on:click={() => askNextQuestion(qPack)}>
                <span class="text">Next question</span>
            </Button>
        {/if}
    {/if}
    {#if $clientState.appHostClientUuid !== $clientState.currentClientUuid}
        <div class="gap-sm"></div>
        <p>{$clientState.clients[$clientState.appHostClientUuid]?.clientName} is the host</p>
    {/if}
    <img id="drums" src="assets/drum.svg" alt="Drum icon" />    
{/await}