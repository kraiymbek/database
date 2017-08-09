const {SHA256} = require('crypto-js');
const jsw = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jsw.sign(data,'data');
console.log('tk1',token);

data.id = 5;
console.log('tk2',token);


let decoded = jsw.verify(token,'data');
console.log('dec',decoded);


// let message = 'I am number one';
// let hashMessage = SHA256(message).toString();
//
// console.log(hashMessage);
//
// let data = {
//     id: 4
// };
//
// console.log(JSON.stringify(data));
// console.log(SHA256(JSON.stringify(data) + 'somesecret').toString());
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data)).toString()
// };
//
// token.data.id = 5;
// //token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// console.log(token.hash);
//
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// console.log(resultHash);