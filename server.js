const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Cho phép gọi API từ bên ngoài

// Khởi tạo app Express 
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Phân tích body của request dưới dạng JSON

// Kết nối tới MongoDB 
// Đảm bảo MongoDB của bạn đang chạy trên localhost:27017
const dbURI = 'mongodb://localhost:27017/SimpleQuiz';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Kết nối thành công tới MongoDB SimpleQuiz database...'))
    .catch(err => console.error('Không thể kết nối tới MongoDB...', err));

// Import routes
const quizRouter = require('./routes/quiz.router');
const questionRouter = require('./routes/question.router');

// Sử dụng routes 
app.use('/quizzes', quizRouter);
app.use('/question', questionRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy trên port ${port}`);
});