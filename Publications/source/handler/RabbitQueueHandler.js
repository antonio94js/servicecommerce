import rabbit from '../config/rabbit';

const pushMessage = (message, queueName) => {
    let connection;

    rabbit.getConnection()
    .then((conn) => {
        connection = conn;
        return conn.createChannel();
    })
    .then((channel) => {
        const queue = queueName;
        message = JSON.stringify(message);

        channel.assertQueue(queue, {
            durable: true
        });

        channel.sendToQueue(queue, new Buffer(message), {
            persistent: true
        });

        disconnect(connection)
    })
    .catch((err) => {
        console.log(err);
    })
};

const disconnect = (conn) => {
    setTimeout(function() {
        conn.close();

    }, 2000);
}

export default {pushMessage};
