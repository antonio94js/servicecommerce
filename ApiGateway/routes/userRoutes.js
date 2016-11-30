import {
    Router
}
from 'express';
import Studio from 'studio';

// var Studio = require('studio');
// var studioCluster = require('studio-cluster');
// Studio.use(studioCluster({}));

const router = Router();

const UserComponent = Studio.module('UserComponent');
/* The Base Path for this router is /user you can see it on index.js */

router.post('/account', (req, res) => {


    let createUser = UserComponent('createUser');


    // createUser().then((value) => {
    //     res.send(value);
    // });
    // setTimeout(function () {
    //     createUser().then((value) => {
    //         res.send(value);
    //     });
    // }, 1000);
    // var User = Studio.module('UserComponent');
    //
    //

    console.log(req.body);
    createUser(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
});

export default router;
