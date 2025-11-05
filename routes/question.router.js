const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// Định tuyến cho /question
router.route('/')
    .get(questionController.getAllQuestions)
    .post(questionController.createQuestion);

//Định tuyến cho /question/:questionId
router.route('/:questionId')
    .get(questionController.getQuestionById)
    .put(questionController.updateQuestion)
    .delete(questionController.deleteQuestion);

module.exports = router;