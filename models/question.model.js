const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    text: { 
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    keywords: [{ 
        type: String
    }],
    correctAnswerIndex: { 
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;