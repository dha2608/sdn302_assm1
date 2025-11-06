const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate({
            path: 'questions',
            populate: {
                path: 'author',
                select: 'username'
            }
        });
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            populate: {
                path: 'author',
                select: 'username'
            }
        });
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
        if (!updatedQuiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        res.status(200).json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        if (quiz.questions && quiz.questions.length > 0) {
            await Question.deleteMany({ _id: { $in: quiz.questions } });
        }
        
        await Quiz.findByIdAndDelete(req.params.quizId);
        
        res.status(200).json({ message: 'Đã xóa quiz và các câu hỏi liên quan' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        req.body.author = req.user._id; 
        
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();

        quiz.questions.push(savedQuestion._id);
        await quiz.save();
        
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.addManyQuestionsToQuiz = async (req, res) => {
     try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Request body phải là một mảng (array)' });
        }

        const questionsWithAuthor = req.body.map(q => ({
            ...q,
            author: req.user._id 
        }));

        const newQuestions = await Question.insertMany(questionsWithAuthor);
        const questionIds = newQuestions.map(q => q._id);
        
        quiz.questions.push(...questionIds);
        await quiz.save();
        
        res.status(201).json({ message: 'Các câu hỏi đã được thêm thành công.', questions: newQuestions });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getQuizWithFilteredQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            match: { 
                $or: [
                    { text: { $regex: /capital/i } },
                    { keywords: { $regex: /capital/i } }
                ]
            },
            populate: {
                path: 'author',
                select: 'username'
            }
        });

        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};