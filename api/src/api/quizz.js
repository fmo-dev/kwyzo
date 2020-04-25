const QuizzController = require("../controller/quizz");
const express = require("express");

module.exports = (auth) => {
    const api = express.Router();

    api.post('/', auth, (req, res) => {
        QuizzController.create(req.body, QuizzController.defineType, req.userId)
        .then(data => {
            res.send({data})
        })
        .catch(error => res.send({error}));
    })

    api.get('/', auth, (req, res) => {
        QuizzController.getAll()
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.get('/user/edit', auth, (req, res) => {
        QuizzController.getAllOfUser(req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.get('/user/play', auth, (req, res) => {
        QuizzController.getPlayableQuizz(req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.get('/edit/:id', auth, (req, res) => {
        QuizzController.getOneEdit(req.params.id, req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.get('/play/:id', auth, (req, res) => {
        QuizzController.getOnePlay(req.params.id, req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.put('/:id', auth, (req, res) => {
        QuizzController.update(req.params.id, req.body, QuizzController.defineType, req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.delete('/:id', auth, (req, res) => {
        QuizzController.delete(req.params.id, req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.post('/:id', (req, res) => {
        QuizzController.checkAnswer(req.params.id, req.body)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    api.post('/end/:id', auth, (req, res) => {
        QuizzController.endGame(req.params.id, req.body, req.userId)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })

    return api;
}