import type { QuestionPack } from "./questionPack";
import type { QuestionPackListItem } from './questionPack';

//TODO: replace me with an actual store...
const _questionPacks: QuestionPack[] = [
    {
        id: "1",
        icon: "far fa-face-smile",
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
        icon: "far fa-comment-dots",
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
        icon: "far fa-face-surprise",
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
        icon: "far fa-sun",
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
        icon: "far fa-calendar",
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
        icon: "far fa-face-smile",
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
        icon: "far fa-comments",
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
        icon: "fas fa-fire-flame-curved",
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