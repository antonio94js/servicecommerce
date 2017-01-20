import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
const PushNotificationComponent = Studio.module('PushNotificationComponent');

class UserController {

    userLogin(req, res, next) {
        const loginUser = UserComponent('loginUser');

        loginUser(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    userCreate(req, res, next) {
        const createUser = UserComponent('createUser');

        createUser(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    };

    userUpdateProfile(req, res, next) {
        const updateUserProfile = UserComponent('updateUserProfile');
        req.body.id = req.user.id;

        updateUserProfile(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    userFcmTokenManagement(req, res, next) {
        const fcmTokenManagement = UserComponent('fcmTokenManagement');
        req.body.id = req.user.id;

        fcmTokenManagement(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    getUserProfile(req, res, next) {
        const getUserProfile = UserComponent('getUserProfile');

        getUserProfile(req.user)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));

    }
}

const userController = new UserController();

export default userController
