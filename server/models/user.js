const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');



let UserScheme = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type:String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type:String,
                required: true
            }
        }
    ]
});

UserScheme.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserScheme.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';

    let token = jwt.sign({_id: user._id.toHexString(),access},'123abc').toString();

    user.tokens.push({token,access});

    return user.save().then(()=>{
        return token;
    });
};

UserScheme.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try{
      decoded = jwt.verify(token,"123abc");
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });

};

UserScheme.statics.findByCredentials = function (email,password) {
    let User = this;

    return User.findOne({email}).then((user)=>{
        if(!user) return Promise.reject();

        return new Promise( (resolve,reject)=>{
            bcrypt.compare(password, user.password, (err,res) =>{
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    }).catch(e => {});

};

UserScheme.pre('save',function (next) {
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt) =>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});


let User = mongoose.model('User', UserScheme);

module.exports = {User};