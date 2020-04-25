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

    api.get('/google', passport.authenticate('google', { scope: ['email'] }));

    api.get('/google/callback', passport.authenticate('google', {
        failureRedirect: 'http://localhost:4200/connexion'
        }), function(req, res) {
            const data = JSON.stringify(req.user)
            var response = '<script>window.opener.postMessage(' + data + ', "*");window.close();</script>'
            res.status(200).send(response);
        });

    api.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    api.get('/facebook/callback', passport.authenticate('facebook', {
            failureRedirect: 'http://localhost:4200/connexion'
            }), function(req, res) {
                const data = JSON.stringify(req.user)
                var response = '<script>window.opener.postMessage(' + data + ', "*");window.close();</script>'
                res.status(200).send(response);
            });

    api.post('/relog', auth, (req, res) => {
        AuthController.relog(req.body.token)
        .then(data => res.send({data}))
        .catch(error => res.send({error}));
    })
    return api
}
