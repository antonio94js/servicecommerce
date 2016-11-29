import Studio from 'studio';
import MessageHandler from '../utils/MessageHandler';
import {User} from '../models/User';

class UserComponent {

    createUser(userData) {

        return User
            .create(userData)
            .exec(function(err, user) {
                if (err) {
                    throw new Error(err);
                } else {
                    return MessageHandler.MessageGenerator("User created succefully", true);
                }

            });

    }

    loginUser() {

        return 'Not yet';
    }

}
//return a new instance from your Microservices component
Studio.serviceClass(UserComponent);
