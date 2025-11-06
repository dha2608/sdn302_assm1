const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const authenticate = require('../authenticate');

// GET thì ai cũng xem được [cite: 108]
router.route('/')
    .get(questionController.getAllQuestions)
    // POST (tạo mới) thì phải đăng nhập 
    .post(authenticate.verifyUser, questionController.createQuestion);

// GET thì ai cũng xem được [cite: 108]
router.route('/:questionId')
    .get(questionController.getQuestionById)
    // PUT (cập nhật) thì phải là TÁC GIẢ [cite: 154, 168]
    .put(authenticate.verifyUser, authenticate.verifyAuthor, questionController.updateQuestion)
    // DELETE (xóa) thì phải là TÁC GIẢ [cite: 154, 168]
    .delete(authenticate.verifyUser, authenticate.verifyAuthor, questionController.deleteQuestion);

module.exports = router;