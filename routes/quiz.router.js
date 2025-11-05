const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// [cite: 28] Định tuyến cho /quizzes
router.route('/')
    .get(quizController.getAllQuizzes)
    .post(quizController.createQuiz);

// [cite: 28] Định tuyến cho /quizzes/:quizId
router.route('/:quizId')
    .get(quizController.getQuizById)
    .put(quizController.updateQuiz)
    .delete(quizController.deleteQuiz);
    
// --- Các Yêu Cầu Đặc Biệt Của Bài ---

// [cite: 33] GET /quizzes/:quizId/populate (Lọc câu hỏi)
router.route('/:quizId/populate')
    .get(quizController.getQuizWithFilteredQuestions);

// [cite: 34] POST /quizzes/:quizId/question (Thêm 1 câu hỏi)
router.route('/:quizId/question')
    .post(quizController.addQuestionToQuiz);

// [cite: 35] POST /quizzes/:quizId/questions (Thêm nhiều câu hỏi)
router.route('/:quizId/questions')
    .post(quizController.addManyQuestionsToQuiz);

module.exports = router;