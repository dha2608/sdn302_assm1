const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');
const Question = require('./models/question.model');

exports.local = passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Tạo Token ---
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ _id: jwt_payload._id });

            if (user) {
                return done(null, user); 
            } else {
                return done(null, false); 
            }
        } catch (err) {
            return done(err, false); 
        }
    }));


exports.verifyUser = passport.authenticate('jwt', { session: false });


exports.verifyAdmin = (req, res, next) => {

    if (req.user && req.user.admin) {
        next(); 
    } else {

        const err = new Error('Bạn không được phép thực hiện thao tác này!');
        err.status = 403; 
        return next(err);
    }
};


exports.verifyAuthor = async (req, res, next) => {
    try {

        const questionId = req.params.questionId;
        if (!questionId) {
            const err = new Error('Không tìm thấy Question ID');
            err.status = 400;
            return next(err);
        }

        const question = await Question.findById(questionId);

        if (!question) {
            const err = new Error('Không tìm thấy câu hỏi');
            err.status = 404;
            return next(err);
        }


        if (question.author.toString() === req.user._id.toString()) {
            next(); 
        } else {

            const err = new Error('Bạn không phải là tác giả của câu hỏi này');
            err.status = 403; 
            return next(err);
        }
    } catch (err) {
        return next(err);
    }
};