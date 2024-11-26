const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Please add the contact name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please add the contact email address"],
        unique: [true, "email address already taken"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please add the contact email address"],
    },
    picture: {
        type: String
    },
    city: {
        type: String,
        required: [true, "Please add the contact city"],
    },
    role: {
        type: String,
        enum: ['manager', 'participant'],
        default: 'participant'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})




module.exports = mongoose.model("User", userSchema);