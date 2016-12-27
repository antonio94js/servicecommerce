import Studio from 'studio';
import config from './config';



Studio.use(Studio.plugin.retry({max:3}));
Studio.use(Studio.plugin.timeout);

Studio.use(Studio.plugin.timer(function(res){
    //TODO with these metrics implement integration with Datadog platform
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));


config.loadClusterConfig();

require('./components'); // Import all the Microservices

console.log('Microservice up');
