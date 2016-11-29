import dotenv from 'dotenv';

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let {
    MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASS
} = process.env;
let {
    REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASS
} = process.env;
let {
    PRIVATE_TOKEN_KEY
} = process.env;


const getMongoString = () =>
    `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const getRedisString = () => '';

export default {
    getMongoString, getRedisString
};
