const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authenticate = require('../authenticate');

// GET thì ai cũng xem được [cite: 108, 162]
router.route('/')
    .get(quizController.getAllQuizzes)
    // POST (tạo mới) thì phải là ADMIN [cite: 109, 146]
    .post(authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);

// GET thì ai cũng xem được [cite: 108, 162]
router.route('/:quizId')
    .get(quizController.getQuizById)
    // PUT (cập nhật) thì phải là ADMIN [cite: 109, 146]
    .put(authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz)
    // DELETE (xóa) thì phải là ADMIN [cite: 109, 146]
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);
    
// GET .../populate thì ai cũng xem được
router.route('/:quizId/populate')
    .get(quizController.getQuizWithFilteredQuestions);

// POST .../question (Thêm 1 câu hỏi)
// Đây là hành động TẠO CÂU HỎI, nên áp dụng Task 4 -> cần verifyUser 
router.route('/:quizId/question')
    .post(authenticate.verifyUser, quizController.addQuestionToQuiz);

// POST .../questions (Thêm nhiều câu hỏi)
// Tương tự, cần verifyUser 
router.route('/:quizId/questions')
    .post(authenticate.verifyUser, quizController.addManyQuestionsToQuiz);

module.exports = router;