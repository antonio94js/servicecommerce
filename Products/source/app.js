import mongodb from './config/db';
import Studio from 'studio';
import StatsD from 'hot-shots';
import studioCluster from 'studio-cluster';
import centralLogger from './config/central-logger';
import config from './config/config';
import RabbitQueueHandler from './handler/RabbitQueueHandler';
import {stopMicroservices} from './handler/StopComponentHandler';

const clientStatsD = new StatsD(); //Start a connection to DogStatsD Server

Studio.use(Studio.plugin.retry({max : 3}));

Studio.use(Studio.plugin.timer(function(res){

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    centralLogger.info('The receiver %s took %d ms to execute',res.receiver, res.time);
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

clientStatsD.socket.on('error', (error) => {
   console.error("Error in socket: ", error);
});

config.loadClusterConfig();

mongodb.connecToMongo();
RabbitQueueHandler.popMessages('product_queue');

const gracefulShutdown = () => {
    mongodb.closeConnection()
        .then(value => closeApp(0))
        .catch(err => closeApp(1))

    function closeApp(status) {
        stopMicroservices();
        setTimeout(function() {
            // console.log("chao");
            process.exit(status);
        }, 1000);
    }
};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);


//Load the Microservices
require("./components");
