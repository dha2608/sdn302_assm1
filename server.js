const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport'); //
const session = require('express-session'); //

// Yêu cầu file cấu hình Passport
const authenticate = require('./authenticate'); //

// Khởi tạo app Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Cần thiết cho Passport

// --- Cấu hình Passport ---
app.use(session({
    secret: 'your-session-secret-key', // Thay bằng key bí mật của bạn
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// -------------------------

// Kết nối tới MongoDB
const dbURI = 'mongodb://localhost:27017/SimpleQuiz'; //
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Kết nối thành công tới MongoDB SimpleQuiz database...'))
    .catch(err => console.error('Không thể kết nối tới MongoDB...', err));

// Import routes
const quizRouter = require('./routes/quiz.router');
const questionRouter = require('./routes/question.router');
const userRouter = require('./routes/user.router'); //

// Sử dụng routes
app.use('/users', userRouter); //
app.use('/quizzes', quizRouter);
app.use('/question', questionRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy trên port ${port}`);
});