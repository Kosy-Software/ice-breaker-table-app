export type QuestionPack = {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
    orderNumber: number;
    questions: string[];
}

export type QuestionPackListItem = {
    id: string;
    name: string;
    icon: string;
    isPublic: boolean;
}