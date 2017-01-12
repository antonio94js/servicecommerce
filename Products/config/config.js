import util from '../utils/Common';
import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let {MONGO_HOST_REMOTE, MONGO_PORT_REMOTE, MONGO_HOST_LOCAL, MONGO_PORT_LOCAL, MONGO_DB, MONGO_USER, MONGO_PASS,} = process.env;
let {REDIS_HOST, REDIS_PORT, REDIS_PASS} = process.env;
let {PRIVATE_TOKEN_KEY} = process.env;

const getRedisObject = () => ({port: REDIS_PORT,host: REDIS_HOST, password: REDIS_PASS});

const getMongoString = () => process.env.NETWORK_ENV === 'local' ? _getMongoStringLocal() : _getMongoStringRemote();

const getRedisString = () => '';

const loadClusterConfig = () => {


    if (process.env.NETWORK_ENV === 'local') {
        const port = 10124;
        // const port = util.getRandomPort();
        Studio.use(studioCluster({
            rpcPort: port
        }));
    } else {
        const port = 10122;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port,getRedisObject())
        }));
    }
};

const _getMongoStringLocal = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST_LOCAL}:${MONGO_PORT_LOCAL}/${MONGO_DB}`;
const _getMongoStringRemote = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST_REMOTE}:${MONGO_PORT_REMOTE}/${MONGO_DB}`;

export default {
    getMongoString, getRedisString, loadClusterConfig, _getMongoStringLocal, _getMongoStringRemote, getRedisObject
};
