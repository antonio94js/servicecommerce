import bcrypt from 'bcrypt'
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import User from '../models/User';
import jwtHandler from '../handler/jwtHandler';
import Promise from 'bluebird';


const WishlistComponent = Studio.module('WishlistComponent');



const createNewUser = (userData) => {

    return User //return a promise
        .create(userData)
        .then((user) => {

            WishlistComponent('createWishlist')(user.id);
            return MessageHandler.messageGenerator("User created succefully", true); //resolve the promise
        })
        .catch((err) => {
            if (err.code === 11000 || err.code === 11001)
                return MessageHandler.errorGenerator("The user already exist", 409); //reject the promise

            return MessageHandler.errorGenerator("Something wrong happened creating user", 500); //reject the promise
        });

}

const userSignOn = (userData) => {

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
        });
}

const updateUser = (userData, setWish) => {

    return new Promise(function(resolve, reject) {

        if (_isValidateField(userData, setWish)) {

            User
                .findByIdAndUpdate(userData.id, {
                    $set: {
                        [userData.fieldData()]: userData.value
                    }
                }).then((value) => {
                    resolve(MessageHandler.messageGenerator("User Updated successfully", true));
                })
                .catch((err) => {
                    reject(new Error("Error updating the user profile"));
                })

        } else {
            reject(MessageHandler.errorGenerator("The field or the value for this action is invalid", 400));
        }

    })

}

const _isValidateField = (data, setWish) => {

    let {
        field, value
    } = data;

    if (setWish) {

        data.fieldData = () => field;
        return true;
    }

    if (['email', 'password', 'address'].includes(field)) {
        if (!value || value === '') {
            return false;
        }

        if (field === 'password') {
            data.value = bcrypt.hashSync(value, 10);
        }

        data.fieldData = () => field;
        // data.fieldData = function() {
        //     return field;
        // };
        return true;

    }

    return false;

    // return true;
};

export default {createNewUser, userSignOn,updateUser}
