const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

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


beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    })
        .then(()=>{done()});
});

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

