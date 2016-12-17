import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import User from '../models/User';
import jwtHandler from '../handler/jwtHandler';
import bcrypt from 'bcrypt';
import UserService from '../bussiness/UserService';
// import './WishlistComponent';


const WishlistComponent = Studio.module('WishlistComponent');

const ImageComponent = Studio.module('ImageComponent');


class UserComponent {

    *createUser(userData) {

        return yield UserService.createNewUser(userData);
    }

    *loginUser(userData) {

        return yield UserService.userSignOn(userData);
    }

    //You just can update only one value (email, password or address), otherwise this service(method) will return 400

    *updateUserProfile(userData, setWish) {

        return yield UserService.updateUser(userData, setWish);
    }

    * getUserProfile(userData) {

        let user = yield User.findById(userData.id).lean().populate('wishlist').select('-password -_id -__v');

        if(!user) {
            return MessageHandler.messageGenerator('The user does not exist', false);
        }

        let getObjectImage = ImageComponent('getObjectImage'); // Fetching a service from ImageMicroservice

        return getObjectImage({
                ObjectType: 'user',
                ID: userData.id, // from the incoming request param
                userid:userData.id // from the JWT token
            })
            .then((value) => {
                // console.log("aqui");
                user.SignedURL = value.SignedURL;
                return MessageHandler.messageGenerator(user, true, 'data');

            })
            .catch((err) => {
                // console.log(err);
                // console.log("reject");
                return MessageHandler.messageGenerator(user, true, 'data');
            })

    }

}
//return a new instance from your Microservices component
Studio.serviceClass(UserComponent);
