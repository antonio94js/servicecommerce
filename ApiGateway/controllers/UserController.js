import Studio from 'studio';
import jwtHandler from '../services/TokenService';
import ErrorHandler from '../handler/ErrorHandler';


const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
// console.log(UserComponent);

const userLogin = (req, res, next) => {
    let loginUser = UserComponent('loginUser');


    loginUser(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })


};

const userCreate = (req, res, next) => {
    let createUser = UserComponent('createUser');

    createUser(req.body)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const userUpdateProfile = (req, res, next) => {
    let updateUserProfile = UserComponent('updateUserProfile');
    req.body.id = req.user.id;

    // console.log(req.query);
    updateUserProfile(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const getUserProfile = (req, res, next) => {
    let getUserProfile = UserComponent('getUserProfile');
    // req.body.id = req.user.id;

    // console.log(req.query);
    getUserProfile(req.user)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

export default {userLogin,userCreate,userUpdateProfile,getUserProfile}
