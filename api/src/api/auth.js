const express = require('express');
const AuthController = require('../controller/auth');
const passport = require('passport');

module.exports = (auth) => {
    const api = express.Router();

    api.post('/', auth, (req, res) => {
        AuthController.signUp(req)
            .then(data => res.send({ data }))
            .catch(error => res.send({ error }));
    });

    api.post('/login', auth, (req, res, next) => {
        AuthController.logIn(req, res, next)
    })


    api.post('/relog', auth, (req, res) => {
        AuthController.relog(req.body.token)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })
    return api
}
