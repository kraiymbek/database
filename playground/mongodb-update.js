const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to mongodb!');
    }

    console.log('Connected to mongodb!');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('59849f4766599f2c8b61bece')
    },{
        $set: {
            name: 'Raiym'
        }
    },{
        returnOriginal: false
    }).then(res=>{
        console.log(res);
    });
});