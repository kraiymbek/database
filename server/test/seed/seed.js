const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


let userOneId = new ObjectID();
let userTwoId = new ObjectID();

let users = [{
    _id: userOneId,
    email: 'kraiymbek@yahoo.com',
    password: 'userOnePass',
    tokens: [
        {
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'},'123abc').toString()
        }
    ]
},{
   _id: userTwoId,
    email: 'rayxk@gmail.com',
    password: 'userTwoPass',
    tokens: []
}];

let todos = [
    {
        _id: new ObjectID(),
        text: 'First todo text'
    },
    {
        _id: new ObjectID(),
        text: 'second todo text',
        completed: true,
        completedAt: 333
    }
];

let populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    })
        .then(()=>{done()});
};

let populateUsers = (done) => {
    User.remove({}).then(()=>{
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(() => {
        done();
    });
};


module.exports = {todos,populateTodos,users, populateUsers};