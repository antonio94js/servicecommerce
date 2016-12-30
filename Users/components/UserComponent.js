import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import User from '../models/User';
// import jwtHandler from '../handler/jwtHandler';
// import bcrypt from 'bcryptjs';
import UserService from '../business/UserService';


// const WishlistComponent = Studio.module('WishlistComponent');




class UserComponent {

    * createUser(userData) {

        return yield UserService.createNewUser(userData);
    }

    * loginUser(userData) {

        return yield UserService.userSignOn(userData);
    }

    //You just can update only one value (email, password or address), otherwise this service(method) will return 400

    * updateUserProfile(userData, setWish) {

        return yield UserService.updateUser(userData, setWish);
    }

    * getUserProfile(userData) {

        return yield UserService.getUserAccount(userData);

    }

    * getUserInfo(userData) {

        return yield UserService.getUserDetail(userData);

    }

}
//return a new instance from your Microservices component
let UserObject = Studio.serviceClass(UserComponent);

// UserObject.getUserProfile.timeout(3000);
