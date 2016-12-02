import Studio from 'studio';
import jwtHandler from '../services/TokenService'


const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice

const userLogin = (req, res) => {
    let loginUser = UserComponent('loginUser');


    loginUser(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        })


};

const userCreate = (req, res) => {
    let createUser = UserComponent('createUser');

    createUser(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        })

};

const userUpdateProfile = (req, res) => {
    let updateUserProfile = UserComponent('updateUserProfile');
    req.body.id = req.user.id;
    console.log(req.body);
    // console.log(req.query);
    updateUserProfile(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        })

};

export default {userLogin,userCreate,userUpdateProfile}
