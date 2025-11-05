const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// [cite: 28] Định tuyến cho /question
router.route('/')
    .get(questionController.getAllQuestions)
    .post(questionController.createQuestion);

// [cite: 28] Định tuyến cho /question/:questionId
router.route('/:questionId')
    .get(questionController.getQuestionById)
    .put(questionController.updateQuestion)
    .delete(questionController.deleteQuestion);

module.exports = router;