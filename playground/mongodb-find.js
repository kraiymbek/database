// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

console.log(new ObjectID());

MongoClient.connect('mongodb://localhost/Todoapp',(err,db) => {
    if(err){
        return console.log('Unable to connect mongodb server!');
    }

    console.log('Connected to mongodb!');


    db.collection('Todos').find().count().then((count)=>{
        console.log('Todos:');
        console.log(`Documents: ${count}`);
    },(err)=>{
        if(err){
            console.log('Unable to find!');
        }
    });



    db.close();


});