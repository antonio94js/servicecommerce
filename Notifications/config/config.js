import util from '../utils/Common';
import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import sendgrid from 'sendgrid';
/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let {REDIS_HOST, REDIS_PORT, REDIS_PASS} = process.env;
let {PRIVATE_TOKEN_KEY} = process.env;
let {SENDGRID_API_KEY} = process.env;

const getRedisObject = () => ({port: REDIS_PORT,host: REDIS_HOST, password: REDIS_PASS});

const getRedisString = () => '';

const loadClusterConfig = () => {

    if (process.env.NETWORK_ENV === 'local') {
        const port = util.getRandomPort();
        Studio.use(studioCluster({
            rpcPort: port
        }));
    } else {
        const port = 10123;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port,getRedisObject())
        }));
    }
};

// MAIL CONFIGURATION
const sendgrid_instance = () => sendgrid(SENDGRID_API_KEY);

export default {
    getRedisString, loadClusterConfig, getRedisObject, sendgrid_instance
};
