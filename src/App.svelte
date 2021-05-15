<script type="ts">
    import type { ClientInfo, InitialInfo } from "@kosy/kosy-app-api/types";
    import type { AppMessage } from "./lib/appMessages";
    import type { AppState } from "./lib/appState";
    import { KosyApi } from "@kosy/kosy-app-api";
    import { questions as questionsAndAnswers } from "./lib/questions";
    
    let state: AppState = {
        alreadyAskedQuestions: {},
        currentQuestion: undefined
    };

    let initializerUuid: string;
    let currentClientUuid: string;
    let allClients: { [clientUuid: string]: ClientInfo } = {};

    let allClientsArray: ClientInfo[] = [];
    //Rebuilds the client array when allClients changes
    $: {
        allClientsArray = []
        for (const clientUuid in allClients) {
            if (Object.prototype.hasOwnProperty.call(allClients, clientUuid)) {
                const client = allClients[clientUuid];
                allClientsArray.push(client);
            }
        }
        allClientsArray.sort((a, b) => a.clientName.localeCompare(b.clientName))
    }

    $: possibleAnswers = questionsAndAnswers[state.currentQuestion]

    const allQuestionsArray: string[] = [];
    for (const question in questionsAndAnswers) {
        allQuestionsArray.push(question);
    }

    $: questionsToAsk = allQuestionsArray.filter(q => !state.alreadyAskedQuestions[q])

    //Simplest to implement -> just return the current state
    let getState = () => {
        return state;
    }

    let setState = (newState: AppState) => {
        state = newState ?? state;
    }

    let onClientHasJoined = (client: ClientInfo) => {        
        allClients[client.clientUuid] = client;
    }

    let onClientHasLeft = (clientUuid: string) => {
        delete allClients[clientUuid];
    }

    let addAnswer = (question: string, answeredByClientUuid: string, answer: string) => {
        if(!state.alreadyAskedQuestions[question]) {
            state.alreadyAskedQuestions[question] = {};
        }
        state.alreadyAskedQuestions[question][answeredByClientUuid] = answer;
    }

    //Process the message that was sent via the kosy network
    let processMessage = async (message: AppMessage) => {
        console.log("Received a message from Kosy: ", message);
        switch (message.type) {
            case "question-asked":
                state = {
                    alreadyAskedQuestions: { ...state.alreadyAskedQuestions, [message.payload]: {} },
                    currentQuestion: message.payload
                }
                break;
            case "question-answered":
                addAnswer(state.currentQuestion, message.payload.answeredByClientUuid, message.payload.answer);
                break;
            default:
                break;
        }
    }
    
    let askNextQuestion = () => {
        let nextQuestion = questionsToAsk[Math.floor(Math.random() * questionsToAsk.length)];
        state = {
            alreadyAskedQuestions: { ...state.alreadyAskedQuestions, nextQuestion: {} },
            currentQuestion: state.currentQuestion
        }
        kosyApi.relayMessage({
            type: "question-asked",
            payload: nextQuestion
        });
    }

    const kosyApi = new KosyApi<AppState, AppMessage>({
        onClientHasJoined: (client) => onClientHasJoined(client),
        onClientHasLeft: (clientUuid) => onClientHasLeft(clientUuid),
        onReceiveMessage: (message) => { processMessage(message) },
        onRequestState: () => getState(),
        onProvideState: (newState: AppState) => setState(newState)
    });

    kosyApi.startApp().then((initialInfo: InitialInfo<AppState>) => {
        initializerUuid = initialInfo.initializerClientUuid;
        currentClientUuid = initialInfo.currentClientUuid;
        allClients = initialInfo.clients;
        if (initialInfo.currentAppState) {
            state = initialInfo.currentAppState;
        }
        if (initialInfo.initializerClientUuid == initialInfo.currentClientUuid) {
            askNextQuestion();
        }
    });

    let selectAnswer = (answer: string) => {
        addAnswer(state.currentQuestion, currentClientUuid, answer);
        kosyApi.relayMessage({ 
            type: "question-answered", 
            payload: {
                question: state.currentQuestion,
                answeredByClientUuid: currentClientUuid, 
                answer: answer
            }
        });
    }
</script>

{#if state.currentQuestion && initializerUuid && currentClientUuid}
    <h1>{ state.currentQuestion }</h1>
    {#if state.alreadyAskedQuestions[state.currentQuestion] && state.alreadyAskedQuestions[state.currentQuestion][currentClientUuid]}
        <p>Your answer: {state.alreadyAskedQuestions[state.currentQuestion][currentClientUuid]}</p>
        <hr />
        {#each allClientsArray as client}
            {#if client.clientUuid !== currentClientUuid}
                {#if state.alreadyAskedQuestions[state.currentQuestion][client.clientUuid]}
                    <p>{client.clientName} answered: {state.alreadyAskedQuestions[state.currentQuestion][client.clientUuid]}</p>
                {:else}
                    <p>{client.clientName} hasn't answered yet.</p>
                {/if}
            {/if}
        {/each}
    {:else}
        <h3>Pick an answer:</h3>
        {#each possibleAnswers as answer}
            <button on:click={() => selectAnswer(answer)}>{answer}</button>
        {/each}
    {/if}
    {#if initializerUuid == currentClientUuid}
        <hr />
        {#if questionsToAsk.length === 0}
            <p>There are no more questions</p>
        {:else}
            <button on:click={() => askNextQuestion()}>Next question</button>
        {/if}
    {/if}
{:else}
    <p></p>
{/if}