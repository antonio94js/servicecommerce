import Studio from 'studio';
import studioCluster from 'studio-cluster';
import dotenv from 'dotenv';
import util from '../utils/Common';
import path from 'path';
import aws from 'aws-sdk';


// const getMongoString = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
dotenv.config();

let {REDIS_HOST, REDIS_PORT, REDIS_PASS} = process.env;

const getRedisObject = () => ({port: REDIS_PORT,host: REDIS_HOST, password: REDIS_PASS});

/*
** Loading Cluster config for studio
*/
const loadClusterConfig = () => {


    if(process.env.NETWORK_ENV === 'local') {
        // const port = util.getRandomPort();
        const port = 10121;
        Studio.use(studioCluster({rpcPort:port}));
    } else {
        const port = 10121;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port, getRedisObject())
        }));
    }
};

/*
** Loading Amazon web services config for use the SDK
*/
aws.config.loadFromPath(path.join(__dirname,'..','/aws.json'));

export default {loadClusterConfig};
