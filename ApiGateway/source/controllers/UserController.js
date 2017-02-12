import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
const SellerComponent = Studio.module('SellerComponent'); //Fetching the User Microservice
const AuthComponent = Studio.module('AuthComponent');

class UserController {

    userLogin(req, res, next) {
        const loginUser = AuthComponent('loginUser');

        loginUser(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    userRefresh(req, res, next) {
        const refreshUserToken = AuthComponent('refreshUserToken');

        refreshUserToken(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    userCreate(req, res, next) {
        const createUser = UserComponent('createUser');

        createUser(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => {
                console.log(err);
                ErrorHandler(err, res, req, next)
            }
            );

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

    userCreateSeller(req, res, next) {
        const setSellerProfile = SellerComponent('setSellerProfile');
        req.body.userID = req.user.id;

        setSellerProfile(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));

    }

    userUpdateSeller(req, res, next) {
        try {
            const updateSellerProfile = SellerComponent('updateSellerProfile');
            req.body.userID = req.user.id;

            updateSellerProfile(req.body)
                .then(response => res.status(200).json(response))
                .catch(err => ErrorHandler(err, res, req, next));
        } catch (e) {
            console.log(e);
        }

    }

    getUserProfile(req, res, next) {
        const getUserProfile = UserComponent('getUserProfile');

        getUserProfile(req.user)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));

    }

    getSellerReviews(req, res, next){
        const getSellerReviews = SellerComponent('getSellerReviews');

        const sellerData = { username: req.params.username };

        getSellerReviews(sellerData)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));

    }
}

const userController = new UserController();

export default userController;
