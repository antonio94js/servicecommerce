import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import UserService from '../business/UserService';
import {registerMicroservice} from '../handler/StopComponentHandler';

// const WishlistComponent = Studio.module('WishlistComponent');

class AuthComponent {

    * loginUser(userData) {
        return yield UserService.userSignOn(userData);
    }

    * refreshUserToken(userData) {
        return yield UserService.refreshUserToken(userData);
    }

}
//return a new instance from your Microservices component
const authComponent = Studio.serviceClass(AuthComponent);


if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(authComponent)
    registerMicroservice(authComponent);
}
// UserObject.getUserProfile.timeout(3000);
