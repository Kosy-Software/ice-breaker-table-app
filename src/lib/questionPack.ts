import { v4 as uuidv4 } from "uuid";

export interface IQuestion {
    text: string;
    imageId?: string;
}

export class Question implements IQuestion {
    text: string;
    imageId?: string;

    constructor(text: string, imageId?: string) {
        this.text = text;
        this.imageId = imageId;
    }
}

export interface IQuestionPack {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
    orderNumber: number;
    questions: IQuestion[];
}

export class QuestionPack implements IQuestionPack {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
    orderNumber: number;
    questions: IQuestion[];

    constructor() {
        this.id = uuidv4();
        this.name = "";
        this.icon = "";
        this.isPublic = false;
        this.orderNumber = -1;
        this.questions = [];
    }
}

export interface IQuestionPackListItem {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
}