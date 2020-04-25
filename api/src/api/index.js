const express = require("express");

const QuizzRoute = require("./quizz");
const UserRoute = require ('./user');
const AuthRoute = require ('./auth')

const auth = require("../middleware/auth")

module.exports = () => {
    const api = express.Router();
    api.use('/quizz', QuizzRoute(auth.required));
    api.use('/user', UserRoute(auth.required));
    api.use('/auth', AuthRoute(auth.optional));

    return api;
}