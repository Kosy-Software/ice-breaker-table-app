<script lang="ts">
    import type { ClientInfo, InitialInfo } from "@kosy/kosy-app-api/types";
    import { KosyApi } from "@kosy/kosy-app-api";
    import type { AppEvent } from "./lib/appEvents";
    import type { AppState } from "./lib/appState";
    import { state } from "./lib/appStateStore";
    import { clientState } from "./lib/clientStore";
    import type { ClientEvent } from "./lib/clientEvents";
    import Game from "./components/Game.svelte";
    import PickQuestionPack from "./components/PickQuestionPack.svelte";
    import Loading from "./components/Loading.svelte";
    import Waiting from "./components/Waiting.svelte";
    import EditQuestionPack from "./components/EditQuestionPack.svelte";

    //Simplest to implement -> just return the current state
    let getState = () => {
        return $state;
    }

    let setState = (newState: AppState) => {
        state.set(newState);
    }

    let onClientHasJoined = (client: ClientInfo) => {
        clientState.set({ ...$clientState, clients: { ...$clientState.clients, [client.clientUuid]: client } });
    }

    let onClientHasLeft = (clientUuid: string) => {        
        if (clientUuid === $clientState.appHostClientUuid) {
            clientState.set({ ...$clientState, appHostClientUuid: $clientState.kosyHostClientUuid });
        }
        clientState.set({ ...$clientState, clients: { ...$clientState.clients, [clientUuid]: undefined } });
    }

    let onHostHasChanged = (clientUuid: string) => {
        clientState.set({ ...$clientState, kosyHostClientUuid: clientUuid });
        if (!$clientState.clients[$clientState.appHostClientUuid]) {
            clientState.set({ ...$clientState, appHostClientUuid: clientUuid });
        }
    }

    //Process the message that was sent via the kosy network
    let processMessage = async (message: AppEvent) => {
        console.log("Received a message from Kosy: ", message);
        switch (message.type) {
            case "question-asked":
                state.set({
                    type: "playingGame",
                    questionPackId: message.questionPackId,
                    alreadyAskedQuestionsIdxs: message.previousQuestionIdxs,
                    currentQuestionIdx: message.currentQuestionIdx
                });
                break;
            case "questions-reset":
                state.set({
                    type: "playingGame",
                    questionPackId: message.questionPackId,
                    alreadyAskedQuestionsIdxs: [],
                    currentQuestionIdx: message.currentQuestionIdx
                });
                break;
            case "pick-question-pack-requested":
                state.set({
                    type: "pickingQuestionPack"
                });
                break;
            default:
                break;
        }
    }
    
    const kosyApi = new KosyApi<AppState, AppEvent, AppEvent>({
        onClientHasJoined: (client) => onClientHasJoined(client),
        onClientHasLeft: (clientUuid) => onClientHasLeft(clientUuid),
        onHostHasChanged: (clientUuid) => onHostHasChanged(clientUuid),
        //No need to deny or change the message in any way -> forward to all clients
        onReceiveMessageAsHost: (message) => message,
        onReceiveMessageAsClient: (message) => { processMessage(message) },
        onRequestState: () => getState(),
        onProvideState: (newState: AppState) => setState(newState)
    });

    let processClientMessage = (msg: ClientEvent) => {
        switch (msg.type) {
            case "nextQuestionAsked":         
                kosyApi.relayMessage({
                    type: "question-asked",
                    questionPackId: msg.questionPackId,
                    previousQuestionIdxs: msg.previousQuestionIdxs,
                    currentQuestionIdx: msg.nextQuestionIdx
                });
                break;
            case "questionsReset":
                kosyApi.relayMessage({
                    type: "questions-reset",
                    questionPackId: msg.questionPackId,
                    currentQuestionIdx: msg.nextQuestionIdx
                });
                break;
            case "appClosed":
                kosyApi.stopApp();
                break;
            case "questionPackPicked":
                kosyApi.relayMessage({
                    type: "question-asked",
                    questionPackId: msg.questionPackId,
                    previousQuestionIdxs: [],
                    currentQuestionIdx: msg.nextQuestionIdx
                });
                break;
            case "anotherQuestionPackRequested":
                kosyApi.relayMessage({
                    type: "pick-question-pack-requested"
                });
                break;
            case "questionPackCreationRequested":
                state.set({
                    type: "creatingQuestionPack"
                });
                break;
            case "questionPackEditRequested":
                state.set({
                    type: "editingQuestionPack",
                    questionPackId: msg.questionPackId
                });
                break;
            case "questionPackEdited":
            case "questionPackCreated":
            case "questionPackEditCancelled":
                state.set({
                    type: "pickingQuestionPack"
                });
                break;
            default:
                break;
        }
    };

    let loadInfo = kosyApi.startApp().then((initialInfo: InitialInfo<AppState>) => {
        clientState.set({ 
            clients: initialInfo.clients,
            appHostClientUuid: initialInfo.initializerClientUuid,
            kosyHostClientUuid: initialInfo.initializerClientUuid,
            currentClientUuid: initialInfo.currentClientUuid 
        });
        if (initialInfo.currentAppState && initialInfo.currentAppState.type !== "loading") {
            state.set(initialInfo.currentAppState)
        } else {
            state.set({ type: "pickingQuestionPack" });
        }
    });
</script>

<style lang="scss" global>
    @use "styles/_colors.scss" as colors;

    main {
        position: absolute;
        left: 0%;
        right: 0%;
        top: 0%;
        bottom: 0%;
        padding: 40px;
    }
</style>

<main>
    {#await loadInfo}
        <Loading msg="Loading icebreaker app" delay={3000}></Loading>
    {:then _data}
        {#if $state.type === "playingGame"}
            <Game state={$state} on:message={(e) => processClientMessage(e.detail)} />
        {:else if ($clientState.appHostClientUuid !== $clientState.currentClientUuid)}
            <Waiting userName={$clientState.clients[$clientState.appHostClientUuid].clientName} />
        {:else if ($state.type === "pickingQuestionPack")}
            <PickQuestionPack on:message={(e) => processClientMessage(e.detail)} />
        {:else if ($state.type === "creatingQuestionPack")}
            <EditQuestionPack state={$state} on:message={(e) => processClientMessage(e.detail)} />
        {:else if ($state.type === "editingQuestionPack")}
            <EditQuestionPack state={$state} on:message={(e) => processClientMessage(e.detail)} />
        {/if}
    {/await}
</main>