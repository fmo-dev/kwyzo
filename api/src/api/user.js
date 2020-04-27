const UserController = require('../controller/user');
const express = require('express');

module.exports = (auth) => {
    const api = express.Router();

    api.get('/login', auth, (req, res) => {
        UserController.getMe(req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.get('/', (req, res) => {
        UserController.getAll()
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    });

    api.delete('/:id', (req, res) => {
        UserController.deleteOne(req.params.id)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    });

    api.put('/edit/contacts', auth, (req, res) => {
        UserController.updateContacts(req.userId, req.body)
        .then(data => res.send(data))
        .catch(error => res.send({error}));
    })

    api.put('/edit/password', auth, (req, res) => {
        UserController.updatePassword(req.userId, req.body.password)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })
    
    api.post('/checkPassword', auth, (req, res) => { 
        UserController.checkPassword(req.userId, req.body.password)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })







    // FRIENDS

    api.get('/friends/search/:letters', auth, (req, res) => {

        UserController.getByLetters(req.params.letters, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    });

    api.get('/friends/send', auth, (req, res) => {
        UserController.getFriendsSend(req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    })

    api.get('/friends/received', auth, (req, res) => {  
        UserController.getFriendsReceived(req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    })

    api.get('/friends/delete/demand/:id', auth, (req, res) => {
        UserController.deleteDemand(req.params.id, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    })

    api.get('/friends/delete/request/:id', auth, (req, res) => {
        UserController.deleteRequest(req.params.id, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    })

    api.get('/friends/accept/request/:id', auth, (req, res) => {
        UserController.acceptRequest(req.params.id, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    })


    api.post('/friends', auth, (req, res) => {
        UserController.sendFriendRequest(req.body.id, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}));
    });

    api.get('/friends', auth, (req, res) => {
        UserController.getFriends(req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}))
    })

    api.get('/friends/delete/friend/:id', auth, (req, res) => {
        UserController.deleteFriend(req.params.id, req.userId)
            .then(data => res.send({data}))
            .catch(error => res.send({error}))
    })


    return api
}