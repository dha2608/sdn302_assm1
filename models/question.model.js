const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// [cite: 22]
const questionSchema = new Schema({
    text: { // [cite: 24]
        type: String,
        required: true
    },
    options: [{ // [cite: 25]
        type: String,
        required: true
    }],
    keywords: [{ // [cite: 26]
        type: String
    }],
    correctAnswerIndex: { // [cite: 27]
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;