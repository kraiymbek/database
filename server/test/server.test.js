const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {populateTodos, todos, users, populateUsers} = require('./seed/seed');



beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
    it('it should create a new Todo',(done)=>{
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err,res)=>{
                if(err) return done(err);

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                    .catch(e=>done(e));
            })
    });

    it('should not create todo with invalid data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err) return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                })
                    .catch(e=>done(e));
            })
    });

});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id',()=>{


    it('it should return object by id',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should return 404 if todo is not found',(done)=>{
        let hexId = new ObjectID().toHexString();
        request(app)
            .get(`todos/${hexId}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE/ todos:id',()=>{
    it('it should remove todo by id',(done)=>{
        let id =todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end((err,res)=>{
                if(err) return done(err);

                Todo.findById(id).then(todo=>{
                    expect(todo).toNotExist();
                    done()
                }).catch(e=>{done(e)});
            });
    });
});

describe('PATCH/ todos/:id',()=>{
    let id = todos[0]._id.toHexString();
    let text = "new text (testing)";

    it('it should updated data',(done)=>{
        request(app)
            .patch(`/todos/${id}`)
            .send({completed: true, text})
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
});

describe('GET /users/me',()=>{
    it('it should return user if authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('it shoudl return 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res =>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST/ users/',()=>{

    it('should create a user', (done) => {

        let email = 'rayxkz@mail.ru';
        let password = 'babababa';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err,res)=>{
                if(err) return done(err);

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch(e => done(e));
            })
    });

    it('should return validation error if request invalid', (done)=>{
        request(app)
            .post('/users')
            .send({email: 'mail@text.ru',password: 'baba'})
            .expect(400)
            .end(done);
    });

    it('it should not create a user if email is use', done => {
        request(app)
            .post('/users')
            .send({email: 'kraiymbek@yahoo.com',password: '123abc!'})
            .expect(400)
            .end(done);
    });

});

