import { Quizz } from './quizz.model';

export class User {
    _id: string;
    userName: string;
    email: string;
    created: Date;
    updated: Date;

    constructor(user?: any) {
        if (user) {
            if(user._id) this._id = user._id;
            if(user.userName) this.userName = user.userName;
            if(user.email) this.email = user.email;
            if(user.created) this.created = user.created;
            if(user.updated) this.updated = user.updated;
        }
    }
}