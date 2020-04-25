import { User } from './user.model';

export class Quizz {
    _id: string;
    title: string;
    description: string;
    createBy: User;
    scoreArray: [{
        user: User,
        score: number
    }];
    questions: [{
        question: string,
        type: string,
        answers: [{
            answer: string,
            isCorrect: boolean
        }]
    }];
    isPublic: boolean;
    ofFriend: boolean;
    created: Date;
    updated: Date;
    

    constructor(quizz?: Quizz) {
        if (quizz) {
            this._id = quizz._id;
            this.title = quizz.title;
            this.description = quizz.description;
            this.createBy = quizz.createBy;
            this.scoreArray = quizz.scoreArray;
            this.questions = quizz.questions;
            this.isPublic = quizz.isPublic;
            this.created = quizz.created;
            this.updated = quizz.updated;    
        }
    }
}