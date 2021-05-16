/// Messages that are relayed to all of the clients
export type AppMessage =
    | QuestionAsked
    | ResetQuestions

export interface QuestionAsked {
    type: "question-asked";
    index: number;
}

export interface ResetQuestions {
    type: "reset-questions";
    index: number;
}