// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

console.log(new ObjectID());

MongoClient.connect('mongodb://localhost/Todoapp',(err,db) => {
    if(err){
        return console.log('Unable to connect mongodb server!');
    }

    console.log('Connected to mongodb!');

    // db.collection('Todos').insertOne({
    //     name: 'Zhake'
    // },(err,res)=>{
    //     if(err){
    //         return console.log('Unable to insert to db');
    //     }
    //
    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });
    //


    // db.collection('Users').insertOne({
    //     name: 'Raiymbek',
    //     age: 25,
    //     location: 'Almaty'
    // },(err,res)=>{
    //     if(err){
    //         return console.log('Unable to insert to db!');
    //     }
    //
    //    console.log(JSON.stringify(res.ops,undefined,2));
    // });

    db.close();


});