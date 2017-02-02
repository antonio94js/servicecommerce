import rabbit from '../config/rabbit';
import Promise from 'bluebird';
import Studio from 'studio';
Studio.use(Studio.plugin.retry({max: 3}));
require('../components');

const acknowledgments = {noAck: false}

const popMessages = (queue_name) => {
    rabbit.getConnection()
    .then(conn =>  conn.createChannel())
    .then((channel) => {
        const queue = queue_name;

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);

        channel.consume(queue, (msg) => {
            console.log(JSON.parse(msg.content.toString()));
            _callService(JSON.parse(msg.content.toString()))
            _messageAcknowledgments(channel,msg);
        }, acknowledgments);
    })
    .catch((err) => {
        console.log(err);
    })
}

const _messageAcknowledgments = (channel,msg) => {
    setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
    },1000);
}

const _callService = ({component,service,data}) => {

    const StudioComponent = Studio.module(component);
    const StudioService = StudioComponent(service);

    StudioService(data)
}

export default {popMessages};
