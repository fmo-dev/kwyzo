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

passport.use('google', new GoogleStrategy(
    {
        ...authId.google,
        profileFields: ['id', 'emails', 'name']
    },
    async (acces_token, refresh_token, profile, done) => {
        const email = profile.emails[0].value
        const user = await Users.findOne({ email })
        if (user) done(null, { user: user.toAuthJSON() })
        else {
            let userName = email.split('@')[0]
            let userCreated = false;
            for (let i = 0; !userCreated; i++) {
                const test = await Users.findOne({ userName })
                test ? userName += 1 : userCreated = true;
            }
            const newUser = new Users({ userName, email })
            newUser.save()
                .then(user => done(null, { user: user.toAuthJSON() }))
                .catch(err => done(err))
        }
    }
));

passport.use(new FacebookStrategy({
    ...authId.facebook,
    profileFields: ['id', 'emails', 'name']
},
   async (acces_token, refresh_token, profile, done) => {
        const email = profile.emails[0].value
        const user = await Users.findOne({ email })
        if (user) done(null, { user: user.toAuthJSON() })
        else {
            let userName = email.split('@')[0]
            let userCreated = false;
            for (let i = 0; !userCreated; i++) {
                const test = await Users.findOne({ userName })
                test ? userName += 1 : userCreated = true;
            }
            const newUser = new Users({ userName, email })
            newUser.save()
                .then(user => done(null, { user: user.toAuthJSON() }))
                .catch(err => done(err))
        }
    }
))
