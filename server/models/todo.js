const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completedAt: {
        type: Number,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = {Todo};
