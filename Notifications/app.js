import Studio from 'studio';
import StatsD from 'hot-shots';
import studioCluster from 'studio-cluster';
import config from './config/config';
import centralLogger from './config/central-logger';
import RabbitQueueHandler from './handler/RabbitQueueHandler';

const clientStatsD = new StatsD(); //Start a connection to DogStatsDServer

Studio.use(Studio.plugin.retry({
    max: 3
}));
Studio.use(Studio.plugin.timeout);

Studio.use(Studio.plugin.timer(function(res) {

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    centralLogger.info('The receiver %s took %d ms to execute',res.receiver, res.time);
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

clientStatsD.socket.on('error', (error) => {
    console.error("Error in socket: ", error);
});

config.loadClusterConfig();
RabbitQueueHandler.popMessages();

//Load the Microservices
require("./components");
