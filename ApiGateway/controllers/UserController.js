import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';


const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
const PushNotificationComponent =  Studio.module('PushNotificationComponent');


const userLogin = (req, res, next) => {

    let loginUser = UserComponent('loginUser');

    loginUser(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
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
        })

};

const userUpdateProfile = (req, res, next) => {

    let updateUserProfile = UserComponent('updateUserProfile');
    let sendPushNotification = PushNotificationComponent('sendPushNotification');
    req.body.id = req.user.id;

    updateUserProfile(req.body)
        .then((response) => {
            if(req.body.field === 'fcmToken') {
                // console.log("llamar");
                sendPushNotification({TokenFCM:req.body.value})
            }

            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

const getUserProfile = (req, res, next) => {

    let getUserProfile = UserComponent('getUserProfile');

    getUserProfile(req.user)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

export default {userLogin,userCreate,userUpdateProfile,getUserProfile}
