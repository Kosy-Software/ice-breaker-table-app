import axios from 'axios';
import { Readable, Writable, writable } from 'svelte/store';
import { derivedPromisable } from 'svelte-promisable-stores';
import type { AppState, ClientState } from './appState';
import type { QuestionPack } from './questionPack';
import { state } from './appStateStore';
import { fetchQuestionPack as fetchQuestionPackFromTemporaryStore } from "./temporaryStore";

export const clientState: Writable<ClientState> = writable({ clients: {}, appHostClientUuid: "", kosyHostClientUuid: "", currentClientUuid: "" });

const fetchQuestionPack = async (appState: AppState): Promise<QuestionPack> => {
    if (appState?.type === "game") {
        return await Promise.resolve(fetchQuestionPackFromTemporaryStore(appState.questionPackId));
    } else {
        return Promise.resolve(null);
    }
};

export const questionPack: Readable<Promise<QuestionPack>> = derivedPromisable(
    state,
    fetchQuestionPack,
    (_previousResult: Promise<QuestionPack>, $currentState: AppState, $previousState: AppState) => {
        return ($currentState.type === "game" && ($previousState?.type !== "game" || $previousState.questionPackId !== $currentState.questionPackId))
    }
);