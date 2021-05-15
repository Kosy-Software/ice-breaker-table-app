/// Messages that are relayed to all of the clients
export type AppMessage =
    | QuestionAsked
    | QuestionAnswered

export interface QuestionAsked {
    type: "question-asked";
    payload: string;
}

export interface QuestionAnswered {
    type: "question-answered";
    payload: {
        question: string;
        answeredByClientUuid: string;
        answer: string;
    }
}