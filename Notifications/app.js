import Studio from 'studio';
import StatsD from 'hot-shots';
import studioCluster from 'studio-cluster';
import config from './config/config';

const clientStatsD = new StatsD(); //Start a connection to DogStatsDServer

Studio.use(Studio.plugin.retry({
    max: 3
}));
// Studio.use(Studio.plugin.timeout);

Studio.use(Studio.plugin.timer(function(res) {

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

clientStatsD.socket.on('error', (error) => {
    console.error("Error in socket: ", error);
});

config.loadClusterConfig();


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hjhorfiu:DaMb3cMfK86ah1IG0V5cfo5c5eRiyeWO@cat.rmq.cloudamqp.com/hjhorfiu', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';

        ch.assertQueue(q, {
            durable: true
        });
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
                ch.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});

//Load the Microservices
require("./components");
