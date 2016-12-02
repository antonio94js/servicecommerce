import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import util from '../utils';

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let { MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASS } = process.env;
let { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASS } = process.env;
let { PRIVATE_TOKEN_KEY } = process.env;


const getMongoString = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
const getRedisString = () => '';
const getPrivateTokenKey = () => PRIVATE_TOKEN_KEY;

const loadClusteringConfig = () => {
    const port = util.getRandomPort();

    if(process.env.NETWORK_ENV === 'local') {
        Studio.use(studioCluster({rpcPort:port}));
    } else {
        const port = 10120;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port,
                'redis://redistogo:7b985a9e87e5289ad23e9c25173d47c2@crestfish.redistogo.com:9624')
        }));
    }
};

export default {getMongoString,getRedisString,getPrivateTokenKey,loadClusteringConfig};
