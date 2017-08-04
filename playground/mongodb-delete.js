const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp',(err,db)=>{

    if(err) {
        return console.log('Unable to connect to mongo server!');
    }

    console.log('Connectec to mongodb!!!');

    // db.collection('Todos').deleteMany({name: 'Raiymbek'}).then((res)=>{
    //     console.log(res);
    // });

    db.collection('Todos').findOneAndDelete({name: 'Zhake'}).then((res)=>{
        console.log(res);
    });


    db.close();
});