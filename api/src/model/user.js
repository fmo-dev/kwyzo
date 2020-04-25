const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const token = require('../config.json').jwt.token

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    logger: {
        hash: {
            type: String,
            required: false
        },
        salt: {
            type: String,
            required: false
        },
    },
    scores: [
        {
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quizz',
                required: false,
                default: null
            },
            score: {
                type: Number,
                required: false,
                default: null
            }
        }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    }],
    friendsRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    }],
    friendsDemands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    }],
    quizzPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quizz',
        required: false,
        default: null
    }],
    created: {
        type: Date,
        required: false,
        default: Date.now
    },
    updated: {
        type: Date,
        required: false,
        default: Date.now
    }
});

UserSchema.methods.setPassword = function(password) {
    this.logger.salt = crypto.randomBytes(16).toString('hex');
    this.logger.hash = crypto.pbkdf2Sync(password, this.logger.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.logger.salt, 10000, 512, 'sha512').toString('hex');
    return this.logger.hash == hash;
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign(
        {
            id: this._id,
            userName: this.userName,
            exp: parseInt(expirationDate.getTime() / 1000, 10)
        },
        token
    );
};

UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        userName: this.userName,
        token: this.generateJWT()
    };
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);