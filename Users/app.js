
import mongodb from './config/db';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import config from './config/config';

function testAfter(e,a,b) {
    console.log(e);
    console.log(a);
    console.log(b);
}

Studio.use(Studio.plugin.retry({max:3,afterCall:function(options){
            // afterInfo= options;
            console.log(options);
        }}));

Studio.use(Studio.plugin.timer(function(res){
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));


config.loadClusterConfig();

mongodb.connecToMongo();


//Load the Microservices
require("./components");
