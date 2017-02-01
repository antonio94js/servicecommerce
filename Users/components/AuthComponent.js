import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import UserService from '../business/UserService';


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

ErrorLoggerHanlder.setErrorLogger(authComponent)

// UserObject.getUserProfile.timeout(3000);
