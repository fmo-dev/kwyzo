const Quizz = require("../model/quizz");
const User = require("../model/user")

module.exports = class {

    static defineType(content) {
        content.questions.map(
            question => {
                question.type = question.answers.filter(answer => answer.isCorrect == true).length > 1 ? 'checkbox' : 'radio'
            }
        )
        return content
    }

    static async create(content, defineType, userId) {
        let creator = await User.findOne({ _id: userId })
        content = defineType(content)
        let quiz = new Quizz({ ...content, createBy: userId })
        creator.quizzPosted.push(quiz._id)
        return quiz.save()
            .then(() => creator.save())
            .then(() => ({ id: quiz._id, creator: creator.userName, concerned: creator.friends }))
            .catch(err => console.error(err));
    }

    static getAll() {
        return Quizz.find().select('-questions.answers.isCorrect')
    }

    static getAllOfUser(userId) {
        return Quizz.find({ createBy: userId }).populate('scoreArray.user', 'userName').exec()
    }

    static async getPlayableQuizz(userId) {
        let person = await User.findOne({ _id: userId });
        let quizz = await Quizz.find({ createBy: { $ne: userId } }).select(['-questions.answers.isCorrect', '-scoreArray', '-created', '-updated']).populate('createBy', 'userName').exec()
        quizz = quizz.map(quiz => ({quiz, ofFriend : false}));
        quizz = quizz.filter(quiz => {
            if (person.friends.length > 0) {
              
                
                for (let i = 0; i < person.friends.length; i++) {
                    
                    if (person.friends[i].toString() == quiz.quiz.createBy._id.toString()) {
                        quiz.ofFriend = true;
                        return true 
                    }
                }
            }
            return quiz.quiz.isPublic ? true : false;
        });
    
        return quizz
    }

    static async update(id, content, defineType, userId) {
        let creator = await User.findOne({ _id: userId })
        content = defineType(content);
        return Quizz.updateOne({ _id: id }, { ...content })
            .then(() => ({ creator: {id: userId, userName : creator.userName}, concerned: creator.friends }))
            .catch(err => console.error(err));
    }

    static async delete(id, userId) {
        let creator = await User.findOne({ _id: userId })
        const quiz = await Quizz.findOne({ _id: id });
        creator.quizzPosted = creator.quizzPosted.filter(quiz => quiz != id)
        quiz.scoreArray.map(async score => {
            let user = await User.findOne({ _id: score.user })
            user = user.scoreArray.filter(score => score.quiz.toString() != quizId)
            user.save();
        })


        return Quizz.deleteOne({ _id: id })
            .then(() => creator.save())
            .then(() => ({ creator: creator.userName, concerned: creator.friends }))
            .catch(err => console.error(err));
    }

    static async checkAnswer(id, body) {
        const quizz = await Quizz.findOne({ _id: id })
        const question = quizz.questions[body.question];
        const goodAnswers = question.answers.map(answer => answer.isCorrect)
        const userAnswers = Object.values(body.answers)
        return question.type == 'radio' ? goodAnswers[parseInt(userAnswers[0])] : JSON.stringify(userAnswers) == JSON.stringify(goodAnswers);
    }

    static async endGame(quizId, data, userId) {
        let alreadyDidIt = false;
        const quizz = await Quizz.findOne({ _id: quizId })
        const user = await User.findOne({ _id: userId })
        user.scores.map(score => {
            if (typeof score.quiz !== null && score.quiz == quizId) {
                alreadyDidIt = true;
                if (score.score < data.score) {
                    score.score = data.score;
                    quizz.scoreArray.map(score => {
                        if (score.user == userId) {
                            score.score = data.score
                        }
                    })
                }
            }
        })
        if (!alreadyDidIt) {
            user.scores.push({ quiz: quizId, score: data.score })
            quizz.scoreArray.push({ user: userId, score: data.score })
        }
        return user.save()
            .then(() => quizz.save())
            .then(() => ({ sender: user.userName }))
            .catch(err => console.error(err));
    }




}