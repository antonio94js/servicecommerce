import mongoose from 'mongoose';
import config from '../config/config';


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
