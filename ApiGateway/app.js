//
// const addUser = {"prueba":"hola","loca":1,"nimpora":2,"prueba2":"como","prueba3":"estas"};
// const {prueba,prueba2,prueba3} =  addUser;
//
// console.log(`${prueba} ${prueba2} ${prueba3}`);

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import mongodb from './config/db';
import router from './routes/';
// import * as test from './utils/testExportEc6';
// import whatever from './utils/testExportEc6';

const app = express();
const port = process.env.PORT || 3000;

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config({silent: true});

try {
    mongodb.connecToMongo();
} catch (e) {
    console.error(e);
}



//Set config to the app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use("/api",router);



app.get("/",function (req,res) {
    res.send("Api Gateway");
});


app.listen(3000, (error) => {
    if (error) {
        console.error(error);
        throw error;
    } else {
        // console.log(whatever("my message"));

        console.info(`sever running on port ${port}`);

    }
});
