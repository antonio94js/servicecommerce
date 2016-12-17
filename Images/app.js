import studio from 'studio';
import config from './config';

studio.use(studio.plugin.retry({max:3}));

config.loadClusterConfig();

require('./components'); // Import all the Microservices

console.log('Microservice up');
