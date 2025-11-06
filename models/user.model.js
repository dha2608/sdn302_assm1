const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    // username và password sẽ được Passport tự động thêm
    admin: {
        type: Boolean,
        default: false // Mặc định không phải là admin 
    }
}, {
    timestamps: true
});

// Gắn plugin passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);