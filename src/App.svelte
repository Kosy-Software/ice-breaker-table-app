<script type="ts">
    import type { ClientInfo, InitialInfo } from "@kosy/kosy-app-api/types";
    import type { AppMessage } from "./lib/appMessages";
    import type { AppState } from "./lib/appState";
    import { KosyApi } from "@kosy/kosy-app-api";
    import { questions } from "./lib/questions";
    import Button from "@kosy/kosy-svelte-components/Button.svelte";
    import ButtonGroup from "./components/ButtonGroup.svelte";
   
    let state: AppState = {
        alreadyAskedQuestionsIndexes: [],
        currentQuestionIndex: undefined
    };

    $: alreadyAskedQuestionIndexesSet = new Set(state.alreadyAskedQuestionsIndexes)
    let initializer: ClientInfo;
    let currentClient: ClientInfo;

    //Simplest to implement -> just return the current state
    let getState = () => {
        return state;
    }

    let setState = (newState: AppState) => {
        if (newState?.alreadyAskedQuestionsIndexes) {
            state = newState;
        }
    }

    let onClientHasJoined = (client: ClientInfo) => {        
        //Ignore
    }

    let onClientHasLeft = (clientUuid: string) => {
        if (clientUuid === initializer.clientUuid) {
            kosyApi.stopApp();
        }
    }

    //Process the message that was sent via the kosy network
    let processMessage = async (message: AppMessage) => {
        console.log("Received a message from Kosy: ", message);
        switch (message.type) {
            case "question-asked":
                state = {
                    alreadyAskedQuestionsIndexes: [ ...state.alreadyAskedQuestionsIndexes, message.index ],
                    currentQuestionIndex: message.index
                }
                break;
            case "reset-questions":
                state = {
                    alreadyAskedQuestionsIndexes: [ message.index ],
                    currentQuestionIndex: message.index
                }
            default:
                break;
        }
    }
    
    let askNextQuestion = () => {
        //Filters out the already asked questions and makes sure to preserve the original question's index
        let questionsToAsk = questions.map((q, index) => { return { index: index } }).filter((q, index) => !alreadyAskedQuestionIndexesSet.has(index));
        //Random next question
        let nextQuestion = questionsToAsk[Math.floor(Math.random() * questionsToAsk.length)];
        //Relay "A question was asked" to all Kosy clients
        kosyApi.relayMessage({
            type: "question-asked",
            index: nextQuestion.index
        });
    }

    //Resets the questions and immediately asks a random question
    let resetQuestions = () => {
        let nextQuestionIndex = Math.floor(Math.random() * questions.length);
        kosyApi.relayMessage({
            type: "reset-questions",
            index: nextQuestionIndex
        });
    }

    let closeApp = () => {
        kosyApi.stopApp();
    }

    const kosyApi = new KosyApi<AppState, AppMessage, AppMessage>({
        onClientHasJoined: (client) => onClientHasJoined(client),
        onClientHasLeft: (clientUuid) => onClientHasLeft(clientUuid),
        //No need to deny or change the message in any way -> forward to all clients
        onReceiveMessageAsHost: (message) => message,
        onReceiveMessageAsClient: (message) => { processMessage(message) },
        onRequestState: () => getState(),
        onProvideState: (newState: AppState) => setState(newState)
    });

    kosyApi.startApp().then((initialInfo: InitialInfo<AppState>) => {
        initializer = initialInfo.clients[initialInfo.initializerClientUuid];
        currentClient = initialInfo.clients[initialInfo.currentClientUuid];
        if (initialInfo.currentAppState) {
            state = initialInfo.currentAppState;
        }
        if (initialInfo.initializerClientUuid == initialInfo.currentClientUuid) {
            askNextQuestion();
        }
    });
</script>

<style lang="scss" global>
    @use "./styles/_colors.scss" as colors;

    main {        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0px;
        margin-left: 70px;
        height: 100vh;

        h1 {
            max-width: 400px;
            margin: 0;
            font-size: 24px;
        }

        p {
            margin: 0;
            font-weight: 500;
            line-height: 17px;
            color: colors.$color-grey-dark
        }
    }

    #drums {
        position: absolute;
        right: 30px;
        bottom: 39px;
        width: 260px;
        height: 260px;
    }
</style>

<main>
    {#if (state.currentQuestionIndex === 0 || state.currentQuestionIndex > 0) && initializer && currentClient}
        {#if state.alreadyAskedQuestionsIndexes.size === questions.length}
            <h1>Wow! You've answered all of the questions!</h1>
            {#if initializer.clientUuid == currentClient.clientUuid}
                <div class="gap"></div>
                <ButtonGroup>
                    <Button importance="primary" on:click={() => resetQuestions()}>
                        <span class="text">Restart</span>
                    </Button>
                    <Button importance="secondary" on:click={() => closeApp()}>
                        <span class="text">Close app</span>
                    </Button>
                </ButtonGroup>
            {/if}
        {:else}
            <h1>{ questions[state.currentQuestionIndex] }</h1>
            {#if initializer.clientUuid == currentClient.clientUuid}
                <div class="gap"></div>
                <Button importance="primary" on:click={() => askNextQuestion()}>
                    <span class="text">Next question</span>
                </Button>
            {/if}
        {/if}
        {#if initializer.clientUuid !== currentClient.clientUuid}
            <div class="gap-sm"></div>
            <p>{initializer.clientName} is the host</p>
        {/if}
        <img id="drums" src="assets/drum.svg" alt="Drum icon" />
    {:else}
        <p></p>
    {/if}
</main>