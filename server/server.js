const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let port = process.env.PORT || 3001;

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

        res.status(200).send({todo});
    }).catch(e=>{res.status(400).send()});



});

app.patch('/todos/:id',(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){

        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then(todo => {
        if(!todo) return res.status(404).send({message: 'is not found'});
        res.send({todo});
    }).catch(e => {res.status(400).send(e)});

});

///USER REQUESTS

app.post('/users',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    let user = new User(body);

    user.save()
        .then( () => {
        return user.generateAuthToken();
    })
        .then((token)=>{
            res.header('x-auth',token).send(user);
        })
        .catch(e => res.status(400).send(e));

});



app.get('/users/me', authenticate, (req,res)=>{

 res.send(req.user);


});

app.post('/users/login',(req,res)=>{
    let body = _.pick(req.body,['email','password']);

    return User.findByCredentials(body.email,body.password).then((user)=>{

        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });

    }).catch(e => {
        res.status(400).send();
    })

    });






app.listen(port,()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};



