export type QuestionPack = {
    id: string;
    name: string;
    isPublic: boolean;
    orderNumber: number;
    questions: string[];
}

export type QuestionPackListItem = {
    id: string;
    name: string;
    isPublic: boolean;
}