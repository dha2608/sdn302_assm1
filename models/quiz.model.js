const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 
const quizSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    description: { 
        type: String
    },
    // Dùng để tham chiếu đến các questions
    questions: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }]
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;