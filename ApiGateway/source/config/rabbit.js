import dotenv from 'dotenv';
import amqp from 'amqplib'


dotenv.config({
    silent: true
});

const {RABBIT_HOST, RABBIT_USER,RABBIT_PASS} = process.env;

const _getRabbitString = () => `amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}/${RABBIT_USER}`

const getConnection = () => amqp.connect(_getRabbitString());

export default {getConnection};
