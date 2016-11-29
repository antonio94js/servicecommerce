import env from 'dotenv';
import mongodb from './config/db';
import Studio from 'studio';
import studioCluster from 'studio-cluster';



Studio.use(studioCluster());

import "./components/";


mongodb.connecToMongo();

// let UserComponent = Studio.module('UserComponent');
// // console.log(UserComponent);
//
// let loginUser  = UserComponent('loginUser')
//
// loginUser().then(function (message) {
//     console.log(message);
// }).catch(function (err) {
//     console.log(err);
// })
