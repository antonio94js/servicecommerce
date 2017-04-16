import {
    Router
}
from 'express';
import Studio from 'studio';
import UserController from '../controllers/UserController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

const UserComponent = Studio.module('UserComponent');

/* The Base Path for this router is /user you can see it on index.js */

router
    .post('/account', UserController.userCreate)
    .post('/account/seller', isAuthenticated, UserController.userCreateSeller)
    .put('/account/seller',isAuthenticated, UserController.userUpdateSeller)
    .put('/account', isAuthenticated, UserController.userUpdateProfile)
    .post('/account/fcm/management', isAuthenticated, UserController.userFcmTokenManagement)
    .get('/account', isAuthenticated, UserController.getUserProfile)
    .get('/profile/:username/seller', UserController.getSellerReviews);

export default router;
