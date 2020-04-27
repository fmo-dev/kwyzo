const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook')
const authId = require('../config.json').oAuth
const Users = mongoose.model('User')

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use(new LocalStrategy(
    {
        usernameField: 'user[email]',
        passwordField: 'user[password]'
    },
    (email, password, done) => {
        Users.findOne({ email })
            .then((user) => {
                if (!user || !user.validatePassword(password)) {

                    return done(null, false, { error: { message: "Utilisateur ou mot de passe incorrect" } });
                }
                return done(null, user);
            })
            .catch(done);
    }))
