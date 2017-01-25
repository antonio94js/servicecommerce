import Studio from 'studio';
import studioCluster from 'studio-cluster';
import StatsD from 'hot-shots';
import mongodb from './config/db';
import config from './config/config';
import centralLogger from './config/central-logger';

const clientStatsD = new StatsD(); //Start a connection to DogStatsD Server

Studio.use(Studio.plugin.retry({max:3}));
Studio.use(Studio.plugin.timeout);
Studio.use(Studio.plugin.timer(function(res){

    clientStatsD.timing(res.receiver, res.time); //Send metric to StastD Server
    clientStatsD.histogram(res.receiver, res.time); //Send metric to StastD Server
    centralLogger.info('The receiver %s took %d ms to execute',res.receiver, res.time);
    console.info('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

clientStatsD.socket.on('error', (error) => {
   console.error("Error in socket: ", error);
});

config.loadClusterConfig();

mongodb.connecToMongo();


var MP = require ("mercadopago");

// var mp = new MP ("8431829414853032", "eEqj4BMuXNm4fkPqh2JKd7uLJJ4Eoxnb");

var mp = new MP ("APP_USR-8431829414853032-012406-7e5e889c5397627229df16248a2834e9__LA_LC__-52374915");

// mp.getAccessToken(function (err, accessToken){
// 	console.log (err);
// });

// console.log(mp);
// mp.sandboxMode(true);

var preference = {
   "items": [
       {
           "title": "Carro Hotweels",
           "quantity": 1,
           "currency_id": "VEF",
           "unit_price": 3
       },
   ],
   "back_urls" : {
      "success": "http://localhost/success",
      "pending" : "http://localhost/pending",
      "failure" : "http://localhost/failure"
   },
   "sandbox_init_point" : "http://localhost/payment",
   "auto_return" : 'all',
   "notification_url" : 'http://186.90.94.116:3000/mercadopago/test'

};

// var getPayment = mp.get ("/merchant_orders/450685239");
// //
// getPayment.then (
//     function (paymentData) {
//         console.log (paymentData.payments);
//     },
//     function (error) {
//         console.log (error);
//     });

mp.createPreference (preference).then((response) => {
   console.log(response);
}).catch((err) =>{
   console.log(err);
});

// mp.getPreference ('230101543-dc0d9a07-0b43-4160-8718-d2b70e13d5de').then((success) =>{
//    console.log(success.response.items);
// }).catch((err) =>{
//    console.log(err);
// });




const gracefulShutdown = () => {mongodb.closeConnection()};

process
    .on('SIGINT', gracefulShutdown)
    .on('SIGTERM', gracefulShutdown);


//Load the Microservices
require("./components");
