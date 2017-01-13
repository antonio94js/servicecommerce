
const Promise = require('bluebird');

class PromiseHandler {
    resolver(value){
        return new Promise((resolve,reject) => {
            resolve(value);
        })
    }

    rejecter(value){
        return new Promise((resolve,reject) => {
            reject(value);
        })
    }
}

module.exports = new PromiseHandler();
