import mongoose from 'mongoose';
import config from '../config/config';
import Promise from 'bluebird';

const mongodb = mongoose.connection;
//Here, we're telling to mongoose to use our own promises library, in this case Bluebird
mongoose.Promise = Promise;

const connecToMongo = () => {

    mongoose.connect(config.getMongoString());

};

const closeConnection = () => {
    return new Promise((resolve, reject) => {
        mongoose.connection.close((err, value) => {
            if (err) reject(err)
            else resolve(value)

        });
    });
};

mongodb.on("connected", () => {
    console.log("Connected to MongoDB successfullyxxx");
})

mongodb.on("error", (err) => {
    console.error('An error has occurred trying to connect ', err);
    mongoose.disconnect();
});

mongodb.on('reconnected', function() {
    console.log('Reconnected to MongoDB');
});

mongodb.on('disconnected', function() {
    console.log('Disconnected from MongoDBXXXXXXXXXXXX');
});



export default {
    connecToMongo, closeConnection
};
