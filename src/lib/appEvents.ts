/// App-wide Events that happened for all applications for all kosy clients that are using this app
export type AppEvent =
    | QuestionAsked
    | QuestionsReset
    | PickQuestionPackRequested

export interface QuestionAsked {
    type: "question-asked";
    questionPackId: string;
    previousQuestionIdxs: number[];
    currentQuestionIdx: number;
}

export interface QuestionsReset {
    type: "questions-reset";
    questionPackId: string;
    currentQuestionIdx: number;
}

export interface PickQuestionPackRequested {
    type: "pick-question-pack-requested";
}