const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let port = process.env.PORT || 3000;

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


app.get('/todos/:id',(req,res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
       return res.status(404).send({message:'id is invalid'});
    }

    Todo.findById(id).then((todo)=>{
        if(!todo) return res.status(404).send({message:'Object is not found'});
        res.send({todo});
    }).catch(e=>{
        res.status(400).send();
    });
});

app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo) return res.status(404).send();

        res.status(200).send(todo);
    }).catch(e=>{res.status(400).send()});



});





app.listen(port,()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};



