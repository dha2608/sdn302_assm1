const Question = require('../models/question.model');

//POST /question
exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//GET /question
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /question/:questionId
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /question/:questionId
exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /question/:questionId
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.questionId);
        if (!deletedQuestion) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json({ message: 'Đã xóa câu hỏi' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};