import mongoose from 'mongoose';
import config from '../config/config';
import bluebird from 'bluebird';

const mongodb = mongoose.connection;
//Here, we're telling to mongoose to use our own promises library, in this case Bluebird
mongoose.Promise = bluebird;

const connecToMongo = () => {

    mongoose.connect(config.getMongoString());

};

const closeConnection = () => {

    mongoose.connection.close(() => {
        console.log('Mongoose default connection with DB is closed through app termination');
        process.exit(0);
    });

};

mongodb.on("connected", () => {
    console.log("Connected to MongoDB successfully");
})

mongodb.on("error", (err) => {
    console.error('An error has occurred trying to connect ', err);
    mongoose.disconnect();
});

mongodb.on('reconnected', function () {
    console.log('Reconnected to MongoDB');
});

mongodb.on('disconnected', function () {
  console.log('Disconnected from MongoDB');
});




export default {
    connecToMongo,closeConnection
};
