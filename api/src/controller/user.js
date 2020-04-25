const User = require('../model/user');
const Quizz = require('../model/quizz')
const quizzController = require ('./quizz')
const jwt = require('jsonwebtoken')
const Config = require('../config.json')
module.exports = class {



    static getMe(id) {
        return User.findOne({_id: id}).select('_id userName email created updated');
    }

    static getAll() {
        return User.find()
    }

    static async deleteOne(id) {
        let quizz = await Quizz.find()
        quizz.map(quiz => {
            if (quiz.createBy.toString() == id) {
                quizzController.delete(quiz._id, id);
            }
        })
        return User.deleteOne({ _id: id })
    }

    static async updateContacts(id, content){
        const user = await User.findOne({_id: id}).select('_id userName email created updated');
        user.userName = content.userName;
        user.email = content.email;
        return user.save()
        .then( () => user)
    }

    static  updatePassword(id, password){
        const user =  User.findOne({_id: id})
        user.setPassword(password)
    }

    static async checkPassword(id, password){
        const user = await  User.findOne({_id: id})
        return user.validatePassword(password); 
    }

    // FRIENDS 


    static async  getByLetters(letters, userId) {
        const users = await User.find({ userName: { "$regex": letters, "$options": "i" }, _id: { $ne: userId } })
        const current = await User.findOne({ _id: userId })
        return users.filter(user => !current.friendsDemands.includes(user._id) && !current.friendsRequest.includes(user._id) && !current.friends.includes(user._id))
    }

    static async getFriendsSend(userId) {
        const user = await User.findOne({ _id: userId }).populate('friendsDemands', '_id userName').exec();
        return user.friendsDemands;
    }

    static async getFriendsReceived(userId) {
        const user = await User.findOne({ _id: userId }).populate('friendsRequest', '_id userName').exec();
        return user.friendsRequest;
    }

    static async getFriends(userId) {
        const user = await User.findOne({ _id: userId }).populate('friends', '_id userName scores quizzPosted').exec();
        return user.friends;
    }



    static async sendFriendRequest(id, senderId) {
        const person = await User.findOne({ _id: id })
        const sender = await User.findOne({ _id: senderId })
        person.friendsRequest.push(senderId)
        sender.friendsDemands.push(id)
        return sender.save()
            .then(() => person.save())
            .then(() => ({ id: person._id, sender: sender.userName, receiver: person.userName }))
            .catch(err => console.error(err));
    }

    static async deleteDemand(id, senderId) {
        let person = await User.findOne({ _id: id })
        let sender = await User.findOne({ _id: senderId });
        sender.friendsDemands = sender.friendsDemands.filter(demand => demand.toString() != person._id);
        person.friendsRequest = person.friendsRequest.filter(request => request.toString() != senderId)
        return sender.save()
            .then(() => person.save())
            .then(() => ({ id: person._id, sender: sender.userName, receiver: person.userName }))
            .catch(err => console.error(err));
    }

    static async deleteRequest(id, senderId) {
        let person = await User.findOne({ _id: id })
        let sender = await User.findOne({ _id: senderId });
        sender.friendsRequest = sender.friendsRequest.filter(request => request.toString() != person._id)
        person.friendsDemands = person.friendsDemands.filter(demand => demand.toString() != senderId);
        return person.save()
            .then(() => sender.save())
            .then(() => ({ id: person._id, sender: sender.userName, receiver: person.userName }))
            .catch(err => console.error(err));
    }

    static async acceptRequest(id, senderId) {
        let person = await User.findOne({ _id: id })
        let sender = await User.findOne({ _id: senderId });
        sender.friendsRequest = sender.friendsRequest.filter(request => request.toString() != person._id)
        person.friendsDemands = person.friendsDemands.filter(demand => demand.toString() != senderId);
        person.friends.push(sender._id);
        sender.friends.push(person._id)
        return person.save()
            .then(() => sender.save())
            .then(() => ({ id: person._id, sender: sender.userName, receiver: person.userName }))
            .catch(err => console.error(err));
    }

    static async deleteFriend(id, senderId) {

        let person = await User.findOne({ _id: id })
        let sender = await User.findOne({ _id: senderId });
        sender.friends = sender.friends.filter(friend => friend._id.toString() != person._id)
        person.friends = person.friends.filter(friend => friend._id.toString() != senderId);


        return person.save()
            .then(() => sender.save())
            .then(() => ({ id: person._id, sender: sender.userName, receiver: person.userName }))
            .catch(err => console.error(err));
    }

}