const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    age: {
        type: Number,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    }
});

let newTodo = new Todo({
    name: 'Raiymbek'
});

newTodo.save().then((docs)=>{
    console.log(docs);
},(e)=>{
    console.log('Unable to save to the server!',err)
});