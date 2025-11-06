const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');
const Question = require('./models/question.model');

// --- Cấu hình Passport sử dụng Local Strategy ---
// passport-local-mongoose cung cấp sẵn hàm .authenticate()
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// Hỗ trợ session (cần thiết cho passport-local)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Hàm tạo Token ---
exports.getToken = (user) => {
    // Tạo token có hiệu lực trong 1 giờ (3600 giây)
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

// --- Cấu hình Passport sử dụng JWT Strategy ---
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    async (jwt_payload, done) => {
        try {
            // Dùng async/await thay vì callback
            const user = await User.findOne({ _id: jwt_payload._id });

            if (user) {
                return done(null, user); // User được tìm thấy
            } else {
                return done(null, false); // Không tìm thấy user
            }
        } catch (err) {
            return done(err, false); // Bắt lỗi (ví dụ: lỗi kết nối)
        }
    }));

// --- Middleware Xác thực User ---
// Dùng để xác thực user dựa trên JWT
exports.verifyUser = passport.authenticate('jwt', { session: false });

// --- Middleware Xác thực Admin (Task 1) ---
// [cite: 130]
exports.verifyAdmin = (req, res, next) => {
    // Middleware này PHẢI chạy sau verifyUser, 
    // vì nó cần req.user do verifyUser cung cấp [cite: 133]
    if (req.user && req.user.admin) {
        next(); // User là admin, cho phép đi tiếp [cite: 136]
    } else {
        // User không phải admin [cite: 138]
        const err = new Error('Bạn không được phép thực hiện thao tác này!');
        err.status = 403; // Forbidden
        return next(err);
    }
};

// --- Middleware Xác thực Tác giả (Task 1) ---
// [cite: 139]
exports.verifyAuthor = async (req, res, next) => {
    try {
        // Lấy questionId từ params
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

        // So sánh ID tác giả và ID user đang đăng nhập [cite: 141]
        // (Cần ép kiểu về String để so sánh)
        if (question.author.toString() === req.user._id.toString()) {
            next(); // Đúng tác giả, cho phép đi tiếp
        } else {
            // Không phải tác giả
            const err = new Error('Bạn không phải là tác giả của câu hỏi này');
            err.status = 403; // Forbidden 
            return next(err);
        }
    } catch (err) {
        return next(err);
    }
};