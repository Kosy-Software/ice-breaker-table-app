//Collection of internal messages
export type ClientEvent = 
    | AppClosed
    | NextQuestionAsked
    | QuestionsReset
    | QuestionPackPicked
    | AnotherQuestionPackRequested

export type NextQuestionAsked = {
    type: "nextQuestionAsked";
    questionPackId: string;
    previousQuestionIdxs: number[];
    nextQuestionIdx: number;
}

export type QuestionsReset = {
    type: "questionsReset";
    questionPackId: string;
    nextQuestionIdx: number;
}

export type AppClosed = {
    type: "appClosed";
}

export type QuestionPackPicked = {
    type: "questionPackPicked";
    questionPackId: string;
    nextQuestionIdx: number;
}

export type AnotherQuestionPackRequested = {
    type: "anotherQuestionPackRequested";
}