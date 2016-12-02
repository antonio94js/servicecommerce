import Studio from 'studio';
import MessageHandler from '../utils/MessageHandler';
import User from '../models/User';
import jwtHandler from '../utils/jwtHandler';
import bcrypt from 'bcrypt';
import UserService from '../bussiness/UserService';


class UserComponent {

    createUser(userData) {

        return User
            .create(userData)
            .then((user) => {
                return MessageHandler.messageGenerator("User created succefully", true);
            })
            .catch((err) => {
                if (err.code === 11000 || err.code === 11001)
                    return MessageHandler.messageGenerator("The user already exist", false);

                throw new Error(err);
            });

    }

    loginUser(userData) {

        return User
            .findOne({
                email: userData.email
            })
            .then((user) => {
                if (!user || !bcrypt.compareSync(userData.password, user.password))
                    return MessageHandler.messageGenerator("The credentials are invalid, please check it out",
                        false);

                let payload = {
                    "id": user._id
                };

                return MessageHandler.messageGenerator(jwtHandler.generateAccessToken(payload),
                    true, 'token');

            })
            .catch((err) => {
                throw new Error(err);
            })
    }

    //You just can update only one value (email, password or address), otherwise this service(method) will return success:false

    updateUserProfile(userData) {
        
        if(UserService.validateUpdateField(userData)){

            return User
                .findByIdAndUpdate(userData.id, {
                    $set: {
                        [userData.fieldData()]: userData.value
                    }
                }).then((value) => {
                    return MessageHandler.messageGenerator("User Updated successfully",true);
                })
                .catch((err) => {
                    throw new Error("Error updating the user profile");
                })

        } else {
            return MessageHandler.messageGenerator("The field or the value for this action is invalid",false);
        }

    }

}
//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(UserComponent);

serviceObj.createUser.retry(3);
serviceObj.loginUser.retry(3);
serviceObj.updateUserProfile.retry(3);
