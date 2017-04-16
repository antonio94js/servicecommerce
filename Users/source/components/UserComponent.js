import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import User from '../models/User';
import UserService from '../business/UserService';
import SellerService from '../business/SellerService';
import {registerMicroservice} from '../handler/StopComponentHandler';


// const WishlistComponent = Studio.module('WishlistComponent');

class UserComponent {

    * createUser(userData) {
        return yield UserService.createNewUser(userData);
    }

    // * loginUser(userData) {
    //     return yield UserService.userSignOn(userData);
    // }

    //You just can update only one value (email, password or address), otherwise this service(method) will return 400

    * updateUserProfile(userData, isClosedField) {
        return yield UserService.updateUser(userData, isClosedField);
    }

    * setSellerProfile(userData) {
        return yield SellerService.setSellerProfile(userData);
    }

    * updateSellerProfile(userData) {
        return yield SellerService.updateSellerProfile(userData);
    }

    * getUserProfile(userData) {
        return yield UserService.getUserAccount(userData);
    }

    * getUserInfo(userData) {
        return yield UserService.getUserDetail(userData);
    }

    * getUserBatch(userData) {
        return yield UserService.getUserBatch(userData);
    }

    * getSellerToken(collectorData) {
        return yield SellerService.getSellerToken(collectorData);
    }

    * retrieveUserField(userData) {
        return yield UserService.retrieveUserField(userData);
    }

    // * refreshUserToken(userData) {
    //     return yield UserService.refreshUserToken(userData);
    // }

    * fcmTokenManagement (userData, setWish) {
        return yield UserService.fcmTokenManagement(userData);
    }

    * checkSellerPaymentMethods (paymentMethod,userID) {
        return yield SellerService.checkSellerPaymentMethods(paymentMethod,userID);
    }

}
//return a new instance from your Microservices component
const UserObject = Studio.serviceClass(UserComponent);

ErrorLoggerHanlder.setErrorLogger(UserObject)
registerMicroservice(UserObject);

// UserObject.getUserProfile.timeout(3000);
