import util from '../utils/Common';
import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
import sendgrid from 'sendgrid';
import FCM from 'fcm-push';
/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let {REDIS_HOST, REDIS_PORT, REDIS_PASS} = process.env;
let {PRIVATE_TOKEN_KEY} = process.env;
let {SENDGRID_API_KEY} = process.env;
let {FCM_SERVER_KEY} = process.env;

export const fcm = new FCM(FCM_SERVER_KEY);

const getRedisObject = () => ({port: REDIS_PORT,host: REDIS_HOST, password: REDIS_PASS});

const loadClusterConfig = () => {

    if (process.env.NETWORK_ENV === 'local') {
        // const port = util.getRandomPort();
        const port = 10122;
        Studio.use(studioCluster({
            rpcPort: port
        }));
    } else {
        // console.log("qeq");
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

// MAIL CONFIGURATION
const getSendgridInstance = () => sendgrid(SENDGRID_API_KEY);

export default {loadClusterConfig, getRedisObject, getSendgridInstance,fcm
};
