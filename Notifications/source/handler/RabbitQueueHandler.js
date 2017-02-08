import rabbit from '../config/rabbit';
import Promise from 'bluebird';
import Studio from 'studio';
// Studio.use(Studio.plugin.retry({max: 3}));
// require('../components');

const acknowledgments = {noAck: false}

const popMessages = () => {
    rabbit.getConnection()
    .then(conn =>  conn.createChannel())
    .then((channel) => {
        const queue = 'notification_queue';

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

const _callService = (notificationData) => {

    const NotificationComponent = Studio.module('NotificationComponent');
    const sendPushNotification = NotificationComponent('sendPushNotification');
    const sendEmail = NotificationComponent('sendEmail');

    Promise.all([sendPushNotification(notificationData), sendEmail(notificationData)])
    .then(() => {

    })
}

export default {popMessages};


// amqp.connect('amqp://hjhorfiu:DaMb3cMfK86ah1IG0V5cfo5c5eRiyeWO@cat.rmq.cloudamqp.com/hjhorfiu', function(err, conn) {
//     conn.createChannel(function(err, ch) {
//         var q = 'task_queue';
//
//         ch.assertQueue(q, {
//             durable: true
//         });
//         ch.prefetch(1);
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
//         ch.consume(q, function(msg) {
//             var secs = msg.content.toString().split('.').length - 1;
//
//             console.log(" [x] Received %s", msg.content.toString());
//
//             //To handler the message acknowledgments
//             setTimeout(function() {
//                 console.log(" [x] Done");
//                 ch.ack(msg);
//             }, secs * 1000);
//
//         }, {
//             noAck: false
//         });
//     });
// });
