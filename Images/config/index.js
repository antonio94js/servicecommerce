import Studio from 'studio';
import studioCluster from 'studio-cluster';
import util from '../utils/Common';
import path from 'path';
import aws from 'aws-sdk';


// const getMongoString = () => `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;


/*
** Loading Cluster config for studio
*/
const loadClusterConfig = () => {


    if(true) {
        const port = util.getRandomPort();
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

/*
** Loading Amazon web services config for use the SDK
*/
aws.config.loadFromPath(path.join(__dirname,'..','/aws.json'));

export default {loadClusterConfig};
