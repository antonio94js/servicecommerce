import mongoose from 'mongoose';
import config from '../config/config';
import bluebird from 'bluebird';

//Here, we're telling to mongoose to use our own promises library, in this case Bluebird
mongoose.Promise = bluebird;

const connecToMongo = () => {

    return mongoose.connect(config.getMongoString(), (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log("Connected to MongoDB successfully");
        }
    });
};

export default {connecToMongo};
