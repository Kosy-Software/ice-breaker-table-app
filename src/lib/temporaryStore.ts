import type { IQuestionPack } from "./questionPack";
import type { IQuestionPackListItem } from './questionPack';
import { Question } from './questionPack';

//TODO: replace me with an actual store...
let _questionPacks: IQuestionPack[] = [
    {
        id: "1",
        icon: "far fa-face-smile",
        orderNumber: 1,
        isPublic: true,
        name: "Fun Icebreaker Questions",
        questions: [
            new Question("What is Kosy?"),
            new Question("Who is Kosy?"),
            new Question("Why is Kosy?"),
            new Question("When is Kosy?")
        ]
    },
    {
        id: "2",
        icon: "far fa-comment-dots",
        orderNumber: 2,
        isPublic: true,
        name: "Icebreaker Questions for Work",
        questions: [
            new Question("Why do birds, suddenly appear?"),
            new Question("Why did the chicken cross the road?"),
            new Question("How many superheroes took their name and inspiration from the animal kingdom?")
        ]
    },
    {
        id: "3",
        icon: "far fa-face-surprise",
        orderNumber: 3,
        isPublic: true,
        name: "Weird Icebreaker Questions",
        questions: [
            new Question("What are the main advantages of using typescript over javascript?"),
            new Question("What are the main disadvantages of using typescript over javascript?")
        ]
    },
    {
        id: "4",
        icon: "far fa-sun",
        orderNumber: 4,
        isPublic: true,
        name: "Holiday Icebreaker Questions",
        questions: [
            new Question("What is the most Belgian thing you can think of?"),
            new Question("What kinds of Belgian beer can you think of?")
        ]
    },
    {
        id: "5",
        icon: "far fa-calendar",
        orderNumber: 5,
        isPublic: true,
        name: "Best Questions for Meetings",
        questions: [
            new Question("What is the most Belgian thing you can think of?"),
            new Question("What kinds of Belgian beer can you think of?")
        ]
    },
    {
        id: "6",
        icon: "far fa-face-smile",
        orderNumber: 6,
        isPublic: true,
        name: "Fun Team Icebreaker Questions",
        questions: [
            new Question("What is the most Belgian thing you can think of?"),
            new Question("What kinds of Belgian beer can you think of?")
        ]
    },
    {
        id: "7",
        icon: "far fa-comments",
        orderNumber: 7,
        isPublic: true,
        name: "Community Building Questions",
        questions: [
            new Question("What is the most Belgian thing you can think of?"),
            new Question("What kinds of Belgian beer can you think of?")
        ]
    },
    {
        id: "8",
        icon: "fas fa-fire-flame-curved",
        orderNumber: 8,
        isPublic: true,
        name: "Inappropriate Icebreakers",
        questions: [
            new Question("What is the most Belgian thing you can think of?"),
            new Question("What kinds of Belgian beer can you think of?")
        ]
    }
]

const getQuestionPacks = (): IQuestionPack[] => {
    var qPacks: any = JSON.parse(localStorage.getItem("questionPacks"));

    if (!qPacks || qPacks.version !== 1) {
        localStorage.setItem("questionPacks", JSON.stringify({ version: 1, questionPacks: _questionPacks }));
        return _questionPacks;
    }
    return qPacks.questionPacks;
}

const saveQuestionPacks = (qPacks: IQuestionPack[]) => {
    localStorage.setItem("questionPacks", JSON.stringify({ version: 1, questionPacks: qPacks }));
}

const qPacks = getQuestionPacks();

console.log("Stored qPacks: ", qPacks);
export const questionPacks = (qPacks as IQuestionPackListItem[]);
export const fetchQuestionPack = (questionPackId: string) => {
    var foundQPack = qPacks.filter(qp => qp.id === questionPackId)[0];
    console.log("Found qPack:", foundQPack);
    return foundQPack;
}
export const saveQuestionPack = (questionPack: IQuestionPack) => {
    const index = qPacks.findIndex(qp => qp.id === questionPack.id);
    if (index === -1) {
        qPacks.push(questionPack);
    } else {
        qPacks[index] = questionPack;
    }
    saveQuestionPacks(qPacks);
    return Promise.resolve(true);
}