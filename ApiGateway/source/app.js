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
Studio.use(Studio.plugin.retry({max:2}));
config.loadClusterConfig();

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/
dotenv.config({
    silent: true
});

//Setting up the Express App

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(config.CorssConfig);

app.use(morgan('dev'));

app.use("/api", router);

app.use(function(req, res, next) {

    res.status(404).send({
        message: "No HTTP resource was found that matches the request URI",
        endpoint: req.url,
        method: req.method
    });
});

app.use(function(err, req, res, next) {
    // console.error(err.stack);
    res.status(500).json(err);
});

const serverInstancesArray = [];

for (let i = 3000; i < 3003; i++) {
    const server = app.listen(i,'0.0.0.0', (error) => {
        if (error)
            throw error;
        else
            console.info(`sever running on port ${i}`);

    });

    serverInstancesArray.push(server)
}



/*Graceful Shutdown our Http Server*/

const gracefulShutdown = () => {
    for (const server of serverInstancesArray) {
        server.close(() => {process.exit(0)})
    }
};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGQUIT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);
