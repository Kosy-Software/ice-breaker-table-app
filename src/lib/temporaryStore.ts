import type { QuestionPack } from "./questionPack";
import type { QuestionPackListItem } from './questionPack';

//TODO: replace me with an actual store...
const _questionPacks: QuestionPack[] = [
    {
        id: "1",
        isPublic: true,
        keywords: [ "Kosy" ],
        name: "Kosy company",
        questions: [
            "What is Kosy?",
            "Who is Kosy?",
            "Why is Kosy?",
            "When is Kosy?"
        ]
    },
    {
        id: "2",
        isPublic: true,
        keywords: [ "Animals" ],
        name: "Animal kingdom",
        questions: [
            "Why do birds, suddenly appear?",
            "Why did the chicken cross the road?",
            "How many superheroes took their name and inspiration from the animal kingdom?"
        ]
    },
    {
        id: "3",
        isPublic: true,
        keywords: [ "Programming", "Technology" ],
        name: "Typescript",
        questions: [
            "What are the main advantages of using typescript over javascript?",
            "What are the main disadvantages of using typescript over javascript?"
        ]
    },
    {
        id: "4",
        isPublic: true,
        keywords: [ "Tourism" ],
        name: "Belgium",
        questions: [
            "What is the most Belgian thing you can think of?",
            "What kinds of Belgian beer can you think of?"
        ]
    }
]

export const questionPacks = (_questionPacks as QuestionPackListItem[]);
export const fetchQuestionPack = (questionPackId: string) => _questionPacks.filter(qp => qp.id === questionPackId)[0];