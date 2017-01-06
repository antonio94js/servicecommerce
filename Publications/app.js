
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import StatsD from 'hot-shots';
import mongodb from './config/db';
import config from './config/config';

const clientStatsD = new StatsD(); //Start a connection to DogStatsD Server

Studio.use(Studio.plugin.retry({max:3}));
Studio.use(Studio.plugin.timer(function(res){

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server

    console.info('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

clientStatsD.socket.on('error', (error) => {
   console.error("Error in socket: ", error);
});

config.loadClusterConfig();

mongodb.connecToMongo();

const gracefulShutdown = () => {mongodb.closeConnection()};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);


//Load the Microservices
require("./components");
