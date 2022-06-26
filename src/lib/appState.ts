import type { ClientInfo } from "@kosy/kosy-app-api/types";

//Represents the shared app state over all clients
export type AppState = 
    | Loading 
    | PickQuestionPackState 
    | GameState;

export type Loading = {
    type: "loading";
}

export type GameState = {
    type: "game";
    questionPackId: string;
    alreadyAskedQuestionsIdxs: Array<number>;
    currentQuestionIdx?: number;
}

export type PickQuestionPackState = {
    type: "pickQuestionPack";
}

//Internal state specific to this client
export type ClientState = {
    clients: { [clientUuid: string]: ClientInfo };
    appHostClientUuid: string;
    kosyHostClientUuid: string;
    currentClientUuid: string;
}