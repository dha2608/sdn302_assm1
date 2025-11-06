const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const passport = require('passport');
const authenticate = require('../authenticate');

// POST /users/signup - Đăng ký
router.post('/signup', (req, res, next) => {
    // User.register là hàm của passport-local-mongoose
    User.register(new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                // Tùy chọn: tự động set admin nếu là user đầu tiên
                // if (user.username === 'admin') {
                //     user.admin = true;
                //     user.save();
                // }
                
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Đăng ký thành công!' });
                });
            }
        });
});

// POST /users/login - Đăng nhập
router.post('/login', passport.authenticate('local'), (req, res) => {
    // Nếu đăng nhập thành công, tạo token
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'Đăng nhập thành công!' });
});

// GET /users - (Task 3) Lấy tất cả user
// [cite: 149, 150]
router.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const users = await User.find({});
            res.status(200).json(users); // [cite: 165]
        } catch (err) {
            next(err);
        }
    });

module.exports = router;