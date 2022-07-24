import type { IQuestion, IQuestionPack } from './questionPack';
import { v4 as uuidv4 } from "uuid";

export class EditorQuestionPack {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
    orderNumber: number;
    questions: EditorQuestion[];

    constructor(questionPack: IQuestionPack) {
        this.id = questionPack.id;
        this.name = questionPack.name;
        this.icon = questionPack.icon;
        this.isPublic = questionPack.isPublic;
        this.orderNumber = questionPack.orderNumber;
        this.questions = questionPack.questions.map((question) => new EditorQuestion(question));
    }

    public toQuestionPack(): IQuestionPack {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            isPublic: this.isPublic,
            orderNumber: this.orderNumber,
            questions: this.questions.map((question) => question.question)
        };
    }
}

//For the editor we need a questionId. Otherwise, Svelte can't tell which question is which.
export class EditorQuestion {
    id: String;
    question: IQuestion;

    constructor(question: IQuestion) {
        this.id = uuidv4();
        this.question = question;
    }
}