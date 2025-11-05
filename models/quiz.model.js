const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// [cite: 18]
const quizSchema = new Schema({
    title: { // [cite: 20]
        type: String,
        required: true
    },
    description: { // [cite: 21]
        type: String
    },
    // [cite: 29] Dùng để tham chiếu đến các questions
    questions: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;