import Studio from 'studio';
import StatsD from 'hot-shots';
import studioCluster from 'studio-cluster';
import mongodb from './config/db';
import config from './config/config';


var winston = require('winston');


  //
  // Requiring `winston-papertrail` will expose
  // `winston.transports.Papertrail`
  //
  require('winston-papertrail').Papertrail;

  var winstonPapertrail = new winston.transports.Papertrail({
    host: 'logs5.papertrailapp.com',
    port: 28990
  })

  winstonPapertrail.on('error', function(err) {
    // Handle, report, or silently ignore connection errors and failures
  });

  var logger = new winston.Logger({
    transports: [winstonPapertrail]
  });



const clientStatsD = new StatsD(); //Start a connection to DogStatsDServer
Studio.use(Studio.plugin.retry({max: 3}));
// Studio.use(Studio.plugin.timeout);

Studio.use(Studio.plugin.timer(function(res) {

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    logger.info('The receiver %s took %d ms to execute',res.receiver, res.time);
    console.info('The receiver %s took %d ms to execute', res.receiver, res.time);

}));

clientStatsD.socket.on('error', (error) => {
   console.error("Error in socket: ", error);
});


config.loadClusterConfig();

mongodb.connecToMongo();

// logger.error('this is my message');


  // logger.info('this is my message');
  //  logger.error('this is my message');
  //   logger.info('this is my message');
  //    logger.info('this is my message');
  //     logger.info('this is my message');
  //      logger.info('this is my message');



const gracefulShutdown = () => {mongodb.closeConnection()};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);

//Load the Microservices
require("./components");
