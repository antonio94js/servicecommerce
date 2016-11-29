//
// const addUser = {"prueba":"hola","loca":1,"nimpora":2,"prueba2":"como","prueba3":"estas"};
// const {prueba,prueba2,prueba3} =  addUser;
//
// console.log(`${prueba} ${prueba2} ${prueba3}`);

import dotenv from 'dotenv';

import mongodb from './config/db';
// import router from './routes/';
// import * as test from './utils/testExportEc6';
// import whatever from './utils/testExportEc6';

const port = process.env.PORT || 3000;

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config({
    silent: true
});

try {
    mongodb.connecToMongo();
} catch (e) {
    console.error(e);
}
