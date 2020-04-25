const User = require('../model/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Config = require('../config.json')

module.exports = class {

    static async signUp(req) {
        const { body : { user}} = req;
        if(!user.userName) return { code: 400, message: "Pseudo nécessaire" };
        if(!user.email) return { code: 400, message: "Email nécessaire" };
        if(!user.password) return { code: 400, message: "Mot de passe nécessaire" };
        if(await User.findOne({userName: user.userName})) return { code: 200, message: "Pseudo non disponible" };
        if(await User.findOne({email: user.email})) return { code: 200, message: "Email déjà utilisée" };
        const finalUser = new User(user);
        finalUser.setPassword(user.password);
        return finalUser.save()
        .then(() => ({ user : finalUser.toAuthJSON()}))
        .catch( () => ({
            error : "Ce pseudo est déjà existant"
        }))
    }
    

    static logIn(req, res, next){
        const { body : { user }} = req;
        if(!user.email) {
            return res.status(422).json({
                error : "L'email' est nécessaire"
            })
        }

        if(!user.password) {
            return res.status(422).json({
                error : "Le mot de passe est nécessaire" 
            }) 
        }    
        
        return passport.authenticate('local', { session : false }, (err, passportUser, info) => {
            if(err) {
                return next(err);
            }
            if(passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                return res.status(200).json({ user: user.toAuthJSON()});
            }
            return res.status(202).json({user: info});
        })(req, res, next)
    }

    static async relog(token) {   
        const decodedToken = jwt.verify(token, Config.jwt.token);
        const userId = decodedToken.id;
        return User.findOne({ _id: userId }).select('_id userName email created updated');
    }

}