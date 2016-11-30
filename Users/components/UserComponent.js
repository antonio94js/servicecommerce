import Studio from 'studio';
import MessageHandler from '../utils/MessageHandler';
import User from '../models/User';


class UserComponent {

    createUser(userData) {

        return User
            .create(userData)
            .then((user) => {
                return MessageHandler.MessageGenerator("User created succefully", true);
            })
            .catch((err) => {
                if(err.code === 11000)
                    return MessageHandler.MessageGenerator("The user already exist", false);

                throw new Error(err);
            });

    }

    loginUser() {

        return 'Not yet';
    }

}
//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(UserComponent);



serviceObj.createUser.retry(3);
