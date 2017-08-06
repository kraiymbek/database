const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('./../server/models/todo');


let id = '598604e0c674a33af9e4b95b1';


if(ObjectID.isValid(id)) return new Error('ID is not valid!');

Todo.findById(id).then((todo)=>{
    console.log(todo);
}).catch((e)=>{console.log(e)});