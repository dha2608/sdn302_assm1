const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

// POST /quizzes
exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//GET /quizzes (sử dụng populate) [cite: 29]
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions');
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /quizzes/:quizId
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /quizzes/:quizId
exports.updateQuiz = async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
        if (!updatedQuiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });
        res.status(200).json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /quizzes/:quizId
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        // Xóa tất cả các câu hỏi liên quan
        if (quiz.questions && quiz.questions.length > 0) {
            await Question.deleteMany({ _id: { $in: quiz.questions } });
        }
        
        // Xóa quiz
        await Quiz.findByIdAndDelete(req.params.quizId);
        
        res.status(200).json({ message: 'Đã xóa quiz và các câu hỏi liên quan' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//POST /quizzes/:quizId/question (Tạo 1 câu hỏi mới trong quiz)
exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        // Tạo câu hỏi mới
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();

        // Thêm ID câu hỏi mới vào mảng questions của quiz
        quiz.questions.push(savedQuestion._id);
        await quiz.save();
        
        res.status(201).json(savedQuestion); // Trả về câu hỏi vừa tạo
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /quizzes/:quizId/questions (Tạo nhiều câu hỏi mới trong quiz)
exports.addManyQuestionsToQuiz = async (req, res) => {
     try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        // req.body phải là một mảng các đối tượng question
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Request body phải là một mảng (array)' });
        }

        // Tạo nhiều câu hỏi
        const newQuestions = await Question.insertMany(req.body);
        
        // Lấy ID của các câu hỏi vừa tạo
        const questionIds = newQuestions.map(q => q._id);
        
        // Thêm các ID này vào quiz
        quiz.questions.push(...questionIds);
        await quiz.save();
        
        res.status(201).json({ message: 'Các câu hỏi đã được thêm thành công.', questions: newQuestions });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /quizzes/:quizId/populate (Lọc câu hỏi có từ "capital")
exports.getQuizWithFilteredQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            // Chỉ "match" các question có chữ "capital" trong text hoặc keywords
            match: { 
                $or: [
                    { text: { $regex: /capital/i } }, // i = không phân biệt hoa thường
                    { keywords: { $regex: /capital/i } }
                ]
            }
        });

        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy quiz' });

        //Quiz sẽ được trả về,
        // nhưng mảng 'questions' sẽ CHỈ chứa các câu hỏi khớp với điều kiện "match"
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};