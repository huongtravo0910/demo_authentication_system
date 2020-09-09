const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User