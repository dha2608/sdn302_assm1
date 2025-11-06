const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authenticate = require('../authenticate');

router.route('/')
    .get(quizController.getAllQuizzes)
    .post(authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);

router.route('/:quizId')
    .get(quizController.getQuizById)
    .put(authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz)
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);
    
router.route('/:quizId/populate')
    .get(quizController.getQuizWithFilteredQuestions);

router.route('/:quizId/question')
    .post(authenticate.verifyUser, quizController.addQuestionToQuiz);

router.route('/:quizId/questions')
    .post(authenticate.verifyUser, quizController.addManyQuestionsToQuiz);

module.exports = router;