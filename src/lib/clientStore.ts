import { Readable, Writable, writable, get } from 'svelte/store';
import type { AppState, ClientState } from './appState';
import type { IQuestionPack } from './questionPack';
import { state } from './appStateStore';
import { fetchQuestionPack as fetchQuestionPackFromTemporaryStore } from "./temporaryStore";

export const clientState: Writable<ClientState> = writable({ clients: {}, appHostClientUuid: "", kosyHostClientUuid: "", currentClientUuid: "" });


const cachedQuestionPack: Writable<IQuestionPack> = writable(null);

export const clearCache = () => {
    cachedQuestionPack.set(null);
}

export const fetchQuestionPack = (appState: AppState): Promise<IQuestionPack> => {
    switch (appState?.type) {
        case "playingGame":
        case "editingQuestionPack":
            var cached = get(cachedQuestionPack);
            if (cached?.id === appState.questionPackId) {
                return Promise.resolve(cached);
            } else {
                var fetched = fetchQuestionPackFromTemporaryStore(appState.questionPackId);
                cachedQuestionPack.set(fetched);
                return Promise.resolve(fetched);
            }
        default:
            return Promise.resolve(null);
    }
};