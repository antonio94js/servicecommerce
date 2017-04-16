import Studio from 'studio';
import StatsD from 'hot-shots';
import studioCluster from 'studio-cluster';
import mongodb from './config/db';
import centralLogger from './config/central-logger';
import config from './config/config';
import RabbitQueueHandler from './handler/RabbitQueueHandler';
import {stopMicroservices} from './handler/StopComponentHandler';

const clientStatsD = new StatsD(); //Start a connection to DogStatsDServer
Studio.use(Studio.plugin.retry({
    max: 1
}));
// Studio.use(Studio.plugin.timeout);

Studio.use(Studio.plugin.timer(function(res) {

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    centralLogger.info('The receiver %s took %d ms to execute', res.receiver, res.time);
    console.info('The receiver %s took %d ms to execute', res.receiver, res.time);

}));

clientStatsD.socket.on('error', (error) => {
    console.error("Error in socket: ", error);
});


config.loadClusterConfig();

//
RabbitQueueHandler.popMessages('user_queue');

mongodb.connecToMongo();

const gracefulShutdown = () => {
    mongodb.closeConnection()
        .then(value => closeApp(0))
        .catch(err => closeApp(1))

    function closeApp(status) {
        stopMicroservices();
        console.log("killing");
        setTimeout(function() {
            process.exit(status);
        }, 1000);
    }
};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGQUIT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);

//Load the Microservices
require("./components");
