
import mongodb from './config/db';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import config from './config/config';


Studio.use(Studio.plugin.retry({max:3}));
Studio.use(Studio.plugin.timer(function(res){
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));


config.loadClusterConfig();

mongodb.connecToMongo();


//Load the Microservices
require("./components");