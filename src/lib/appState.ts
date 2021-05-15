import type { ClientInfo } from '@kosy/kosy-app-api/types';

export interface AppState {
    alreadyAskedQuestions: { [question: string]: { [answeredByClientUuid: string]: string } };
    currentQuestion: string
}

export interface ComponentState extends AppState {
    /// Immutable, represents the parent kosy client
    currentClient: ClientInfo;
    /// Immutable, represents the kosy client that started the app
    initializer: ClientInfo;
}