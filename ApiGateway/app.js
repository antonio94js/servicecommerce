import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Studio from 'studio';

import mongodb from './config/db';
import config from './config/config';
import router from './routes/';

const app = express();
const port = process.env.PORT || 3000;
// Studio.use(Studio.plugin.retry({max:4}));
config.loadClusterConfig();

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


//Setting up the Express App

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(morgan('dev'));

app.use("/api", router);

app.get("/", function(req, res) {
    res.send("Api Gateway");
});


app.use(function(req, res, next) {
  res.status(404).send({message:"The resource that you try to access doesn't found"});
});

app.use(function(err, req, res, next) {
  // console.error(err.stack);
  res.status(500).json(err);
});


app.listen(port, (error) => {
    if (error)
        throw error;
    else
        console.info(`sever running on port ${port}`);

});
