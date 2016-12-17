import mongodb from './config/db';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import config from './config/config';


Studio.use(Studio.plugin.retry({max : 3}));

config.loadClusteringConfig();

mongodb.connecToMongo();


//Load the Microservices
require("./components");
