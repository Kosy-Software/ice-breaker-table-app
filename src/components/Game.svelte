<script type="ts">
    import Button from "@kosy/kosy-svelte-components/Button.svelte";
    import type { PlayingGame } from "../lib/appState";
    import { createEventDispatcher } from "svelte";
    import type { ClientEvent } from "../lib/clientEvents";
    import { clientState, questionPack } from "../lib/clientStore";
    import type { IQuestionPack } from "../lib/questionPack";
    import ButtonGroup from "./subcomponents/ButtonGroup.svelte";
    type PlayingGameEvent = { message: ClientEvent };

    export let state: PlayingGame;
    $: alreadyAskedQuestionIdxs = [...state.alreadyAskedQuestionsIdxs, state.currentQuestionIdx];
    let dispatch = createEventDispatcher<PlayingGameEvent>();

    let askNextQuestion = (qPack: IQuestionPack) => {
        var alreadyAskedQuestionIndexesSet = new Set(alreadyAskedQuestionIdxs);
        //Filters out the already asked questions and makes sure to preserve the original question's index
        let questionsToAsk = qPack.questions.map((_q, index) => { return { index } }).filter((_q, index) => !alreadyAskedQuestionIndexesSet.has(index));
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
    let resetQuestions = (qPack: IQuestionPack) => {
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
    @use "../styles/_colors.scss" as colors;

    #drums {
        position: absolute;
        right: 30px;
        bottom: 39px;
        width: 260px;
        height: 260px;
        pointer-events: none;
    }

    .game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0px;
        margin-left: 70px;
        height: 100%;

        h1 {
            max-width: 400px;
            margin: 0;
            font-size: 24px;
        }

        p {
            margin: 0;
            font-weight: 500;
            line-height: 17px;
            color: colors.$color-grey-dark;
        }
    }
</style>

<div class="game">
    {#await $questionPack then qPack }
        {#if state.currentQuestionIdx !== 0 && !state.currentQuestionIdx}
            <h1>Wow! You've answered all of the questions!</h1>
            {#if $clientState.appHostClientUuid === $clientState.currentClientUuid}
                <div class="gap"></div>
                <ButtonGroup>
                    <Button importance="primary" on:click={() => resetQuestions(qPack)}>
                        <span class="text">Restart</span>
                    </Button>
                    <Button importance="secondary" on:click={() => pickAnotherQuestionPack()}>
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
                <ButtonGroup>
                    <Button importance="primary" on:click={() => askNextQuestion(qPack)}>
                        <span class="text">Next question</span>
                    </Button>
                </ButtonGroup>
            {/if}
        {/if}
        {#if $clientState.appHostClientUuid !== $clientState.currentClientUuid}
            <div class="gap-sm"></div>
            <p>{$clientState.clients[$clientState.appHostClientUuid]?.clientName} is the host</p>
        {/if}
        <img id="drums" src="assets/drum.svg" alt="Drum icon" />    
    {/await}
</div>