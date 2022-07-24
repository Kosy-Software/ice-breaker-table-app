import type { IQuestionPack } from './questionPack';

//Collection of internal messages
export type ClientEvent = 
    | AppClosed
    | NextQuestionAsked
    | QuestionsReset
    | QuestionPackPicked
    | AnotherQuestionPackRequested    
    | QuestionPackCreationRequested
    | QuestionPackCreated
    | QuestionPackEditRequested
    | QuestionPackEdited
    | QuestionPackEditCancelled

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

export type QuestionPackCreationRequested = {
    type: "questionPackCreationRequested";
}

export type QuestionPackCreated = {
    type: "questionPackCreated";
    questionPack: IQuestionPack;
}

export type QuestionPackEditRequested = {
    type: "questionPackEditRequested";
    questionPackId: string;
}

export type QuestionPackEdited = {
    type: "questionPackEdited";
    questionPack: IQuestionPack;
}

export type QuestionPackEditCancelled = {
    type: "questionPackEditCancelled";
}