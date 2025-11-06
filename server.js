const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport'); //
const session = require('express-session'); //


const authenticate = require('./authenticate'); //


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 


app.use(session({
    secret: 'secret-key-12345-67890',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const dbURI = 'mongodb://localhost:27017/SimpleQuiz'; //
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Kết nối thành công tới MongoDB SimpleQuiz database...'))
    .catch(err => console.error('Không thể kết nối tới MongoDB...', err));


const quizRouter = require('./routes/quiz.router');
const questionRouter = require('./routes/question.router');
const userRouter = require('./routes/user.router'); //


app.use('/users', userRouter); //
app.use('/quizzes', quizRouter);
app.use('/question', questionRouter);

app.listen(port, () => {
    console.log(`Server đang chạy trên port ${port}`);
});