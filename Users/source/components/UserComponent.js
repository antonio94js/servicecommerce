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

    //You just can update only one value (email, password or address), otherwise this service(method) will return 400

    * updateUserProfile(userData, isClosedField) {
        return yield UserService.updateUser(userData, isClosedField);
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

    * retrieveUserField(userData) {
        return yield UserService.retrieveUserField(userData);
    }

    * fcmTokenManagement (userData, setWish) {
        return yield UserService.fcmTokenManagement(userData);
    }

}
//return a new instance from your Microservices component
const UserObject = Studio.serviceClass(UserComponent);
if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(UserObject)
    registerMicroservice(UserObject);
}

// UserObject.getUserProfile.timeout(3000);
