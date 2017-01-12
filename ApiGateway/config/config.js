import dotenv from 'dotenv';
import Studio from 'studio';
import studioCluster from 'studio-cluster';
// import util from '../utils';
import Common from '../utils/Common';

/*Loading envioroment vars from .env file,  this file is not available in the repository,
so if you need to test this ApiGateway in localhost you must create your own*/

dotenv.config();

let {
    REDIS_HOST, REDIS_PORT, REDIS_PASS
} = process.env;
let {
    PRIVATE_TOKEN_KEY
} = process.env;

const getRedisObject = () => ({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASS
});

const getPrivateTokenKey = () => PRIVATE_TOKEN_KEY;

const loadClusterConfig = () => {


    if (process.env.NETWORK_ENV === 'local') {
        const port = 10119;
        // const port = Common.getRandomPort();
        Studio.use(studioCluster({
            rpcPort: port
        }));
    } else {
        const port = 10119;
        Studio.use(studioCluster({
            rpcPort: port,
            balance: studioCluster.balance.random({
                percentLocal: 50
            }),
            publisher: studioCluster.publisher.redis(port, getRedisObject())
        }));
    }
};

const CorssConfig = (req, res, next) => {

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    // res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, Origin');

    if (req.method === 'OPTIONS') return res.sendStatus(200);

    return next();

};

export default {
    getPrivateTokenKey, loadClusterConfig,CorssConfig
};
