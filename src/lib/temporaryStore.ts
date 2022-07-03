import type { QuestionPack } from "./questionPack";
import type { QuestionPackListItem } from './questionPack';

//TODO: replace me with an actual store...
const _questionPacks: QuestionPack[] = [
    {
        id: "1",
        orderNumber: 1,
        isPublic: true,
        name: "Fun Icebreaker Questions",
        questions: [
            "What is Kosy?",
            "Who is Kosy?",
            "Why is Kosy?",
            "When is Kosy?"
        ]
    },
    {
        id: "2",
        orderNumber: 2,
        isPublic: true,
        name: "Icebreaker Questions for Work",
        questions: [
            "Why do birds, suddenly appear?",
            "Why did the chicken cross the road?",
            "How many superheroes took their name and inspiration from the animal kingdom?"
        ]
    },
    {
        id: "3",
        orderNumber: 3,
        isPublic: true,
        name: "Weird Icebreaker Questions",
        questions: [
            "What are the main advantages of using typescript over javascript?",
            "What are the main disadvantages of using typescript over javascript?"
        ]
    },
    {
        id: "4",
        orderNumber: 4,
        isPublic: true,
        name: "Holiday Icebreaker Questions",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    },
    {
        id: "5",
        orderNumber: 5,
        isPublic: true,
        name: "Best Questions for Meetings",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    },
    {
        id: "6",
        orderNumber: 6,
        isPublic: true,
        name: "Fun Team Icebreaker Questions",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    },
    {
        id: "7",
        orderNumber: 7,
        isPublic: true,
        name: "Community Building Questions",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    },
    {
        id: "8",
        orderNumber: 8,
        isPublic: true,
        name: "Inappropriate Icebreakers",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    }
]

export const questionPacks = (_questionPacks as QuestionPackListItem[]);
export const fetchQuestionPack = (questionPackId: string) => _questionPacks.filter(qp => qp.id === questionPackId)[0];