const mongoose = require("mongoose");

const quizzSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    scoreArray: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            default: null
        },
        score: {
            type: Number,
            required: false,
            default: null
        }
    }],
    questions: [
        {
            _id: false,
            question: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: false,
                default: 'radio'
            },
            answers: [
                {
                    _id: false,
                    answer: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: false,
                        default: false
                    }
                }
            ]
        }
    ],
    isPublic: {
        type: Boolean,
        required: false,
        default: null
    },
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

module.exports = mongoose.model('Quiz', quizzSchema);

