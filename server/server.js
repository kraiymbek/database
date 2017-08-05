const express = require('express');
const bodyParser = require('body-parser');


let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((docs)=>{
        res.send(docs)
    },(e)=>{
        res.status(400).send(e);
    });
});


app.get('/todos',(req,res)=>{
    Todo.find().then(todos=>{
        res.send({todos});
    },err => res.status(400).send(e));
});


app.listen(3001,()=>{
    console.log('Startde on port 3000');
});

module.exports = {app};



