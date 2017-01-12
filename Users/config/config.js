import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import util from '../utils/Common';

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let { MONGO_DB, MONGO_USER, MONGO_PASS } = process.env;
let { MONGO_HOST_LOCAL,MONGO_HOST_REMOTE, MONGO_PORT_LOCAL,MONGO_PORT_REMOTE} = process.env;
let { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env;
let { PRIVATE_TOKEN_KEY } = process.env;


const getMongoString = () => process.env.NETWORK_ENV === 'local' ? _getMongoLocalString() : _getMongoRemoteString();

const getRedisObject = () => ({port: REDIS_PORT,host: REDIS_HOST, password: REDIS_PASS});
const getPrivateTokenKey = () => PRIVATE_TOKEN_KEY;

const loadClusterConfig = () => {


    if(process.env.NETWORK_ENV === 'local') {

        // const port = util.getRandomPort();
        const port = 10120;
        Studio.use(studioCluster({rpcPort:port}));
    } else {

        const port = 10120;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port, getRedisObject())
        }));
    }
};


const _getMongoLocalString = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST_LOCAL}:${MONGO_PORT_LOCAL}/${MONGO_DB}`;
const _getMongoRemoteString = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST_REMOTE}:${MONGO_PORT_REMOTE}/${MONGO_DB}`;

export default {
    getMongoString, getPrivateTokenKey, loadClusterConfig
};
