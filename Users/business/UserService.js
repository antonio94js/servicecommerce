import Studio from 'studio';
import bcrypt from 'bcryptjs'
import Promise from 'bluebird';
import MessageHandler from '../handler/MessageHandler';
import User from '../models/User';
import jwtHandler from '../handler/jwtHandler';




const createNewUser = (userData) => {

    const WishlistComponent = Studio.module('WishlistComponent'); // Fetching the Whislist Microservice

    return User //return a promise
        .create(userData)
        .then((user) => {
            // console.log(user);
            //
            WishlistComponent('createWishlist')(user.id); // Create a new Wishlist Ascinchronously
            return MessageHandler.messageGenerator("User created succefully", true); //resolve the promise
        })
        .catch((err) => {
            if (err.code === 11000 || err.code === 11001)
                throw MessageHandler.errorGenerator("The user already exist", 409); //reject the promise
            // console.log("aqui" + err);
            throw MessageHandler.errorGenerator("Something wrong happened creating user", 500); //reject the promise
        });

}

const userSignOn = (userData) => {
    // console.log(User.findOne);

    return User
        .findOne({
            email: userData.email
        })
        .then((user) => {
            if (!user || !bcrypt.compareSync(userData.password, user.password))
                return MessageHandler.messageGenerator("The credentials are invalid, please check it out",
                    false);

            let userID = {
                "id": user._id
            };

            return MessageHandler.messageGenerator(jwtHandler.generateAccessToken(userID),
                true, 'token');

        })
        .catch((err) => {
            throw new Error(err);
        });
}

const updateUser = (userData, setWish) => {

    return new Promise((resolve, reject) => {

        if (_isValidateField(userData, setWish)) {

            User
                .findByIdAndUpdate(userData.id, {
                    $set: {
                        [userData.fieldName()]: userData.value
                    }
                }).then((value) => {
                    resolve(MessageHandler.messageGenerator("User Updated successfully", true));
                })
                .catch((err) => {
                    if (err.code === 11000 || err.code === 11001) {
                        resolve(MessageHandler.messageGenerator("This email is already in use",false));
                        // return;
                    } else {
                        reject(new Error("Error updating the user profile"));
                    }
                    //reject the promise
                })

        } else {
            reject(MessageHandler.errorGenerator("The field or the value for this action is invalid", 400));
        }

    })

}

const _isValidateField = (data, setWish) => {

    let {field, value} = data;

    if (setWish) { // to set new Wishlist into a user model
        data.fieldName = () => field;
        return true;
    }

    if (['email', 'password', 'address'].includes(field)) {
        if (!value || value === '') {
            return false;
        }

        if (field === 'password') {
            data.value = bcrypt.hashSync(value, 10);
        }

        data.fieldName = () => field;

        return true;

    }

    return false;

    // return true;
};

export default {
    createNewUser, userSignOn, updateUser
}
