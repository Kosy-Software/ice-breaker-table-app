import { Readable, Writable, writable, get } from 'svelte/store';
import { derivedPromisable } from 'svelte-promisable-stores';
import type { AppState, ClientState } from './appState';
import type { IQuestionPack } from './questionPack';
import { state } from './appStateStore';
import { fetchQuestionPack as fetchQuestionPackFromTemporaryStore } from "./temporaryStore";

export const clientState: Writable<ClientState> = writable({ clients: {}, appHostClientUuid: "", kosyHostClientUuid: "", currentClientUuid: "" });


const cachedQuestionPack: Writable<IQuestionPack> = writable(null);

export const clearCache = () => {
    cachedQuestionPack.set(null);
}

const fetchQuestionPack = async (appState: AppState): Promise<IQuestionPack> => {
    switch (appState?.type) {
        case "playingGame":
        case "editingQuestionPack":
            var cached = get(cachedQuestionPack);
            if (cached?.id === appState.questionPackId) {
                return Promise.resolve(cached);
            } else {
                var fetched = await new Promise<IQuestionPack>((resolve, reject) => resolve(fetchQuestionPackFromTemporaryStore(appState.questionPackId)));
                cachedQuestionPack.set(fetched);
                return fetched;
            }
        default:
            return Promise.resolve(null);
    }
};

export const questionPack: Readable<Promise<IQuestionPack>> = derivedPromisable(
    state,
    fetchQuestionPack,
    (_previousResult: Promise<IQuestionPack>, _$currentState: AppState, _$previousState: AppState) => true
);