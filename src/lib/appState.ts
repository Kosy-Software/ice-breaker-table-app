import type { ClientInfo } from "@kosy/kosy-app-api/types";

//Represents the shared app state over all clients
export type AppState = 
    | Loading
    | PickingQuestionPack
    | CreatingQuestionPack
    | EditingQuestionPack
    | PlayingGame

export type Loading = {
    type: "loading";
}

export type PlayingGame = {
    type: "playingGame";
    questionPackId: string;
    alreadyAskedQuestionsIdxs: Array<number>;
    currentQuestionIdx?: number;
}

export type PickingQuestionPack = {
    type: "pickingQuestionPack";
}

export type CreatingQuestionPack = {
    type: "creatingQuestionPack";
}

export type EditingQuestionPack = {
    type: "editingQuestionPack";
    questionPackId: string;
}

//Internal state specific to this client
export type ClientState = {
    clients: { [clientUuid: string]: ClientInfo };
    appHostClientUuid: string;
    kosyHostClientUuid: string;
    currentClientUuid: string;
}