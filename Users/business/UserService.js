import Studio from 'studio';
import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import User from '../models/User';
import jwtHandler from '../handler/jwtHandler';

class UserService {

    createNewUser(userData) {

        const WishlistComponent = Studio.module('WishlistComponent'); // Fetching the Whislist Microservice

        return User //return a promise
            .create(userData)
            .then((user) => {
                WishlistComponent('createWishlist')(user.id); // Create a new Wishlist Ascinchronously
                return MessageHandler.messageGenerator("User created succefully", true); //resolve the promise
            })
            .catch((err) => {
                // console.log(err);
                if (err.code === 11000 || err.code === 11001)
                    throw MessageHandler.errorGenerator("The user already exist", 409); //reject the promise

                if (err.name === 'ValidationError')
                    throw MessageHandler.errorGenerator("Some fields on the request are invalid or missing",
                        400);

                throw MessageHandler.errorGenerator("Something wrong happened creating user", 500); //reject the promise
            });
    }

     userSignOn(userData) {

        return User
            .findOne({
                $or: [{
                    email: userData.account
                }, {
                    username: userData.account
                }]
            })
            .then((user) => {
                if (!user || !bcrypt.compareSync(userData.password, user.password))
                    return MessageHandler.messageGenerator("The credentials are invalid, please check it out",
                        false);

                let userID = {
                    id: user._id,
                    username: user.username
                };

                return {
                    success: true,
                    token: jwtHandler.generateAccessToken(userID),
                    refreshToken: jwtHandler.generateRefreshToken()
                }

                // return MessageHandler.messageGenerator(jwtHandler.generateAccessToken(userID), true, 'token');

            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    updateUser(userData, setWish)  {

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
                            resolve(MessageHandler.messageGenerator("This email is already in use",
                                false));
                            // return;
                        } else {
                            reject(new Error("Error updating the user profile"));
                        }
                        //reject the promise
                    })

            } else {
                reject(MessageHandler.errorGenerator("The field or the value for this action is invalid",
                    400));
            }

        })

    }


    async fcmTokenManagement(userData) {

        // return co.wrap(function*() {
        let user = await User.findById(userData.id);

        let result = _proccessTokenArray(userData.action, user.fcmTokens, userData);

        if (_.isArray(result)) {
            user.fcmTokens = result;

            await User.findByIdAndUpdate(userData.id, {
                $set: {
                    'fcmTokens': user.fcmTokens
                }
            });


            return MessageHandler.messageGenerator('success operation', true);

        } else {

            throw MessageHandler.errorGenerator("Invalid action for the FCM Token", 400);
        }

        // })();

    }

    async getUserAccount(userData) {

        const ImageComponent = Studio.module('ImageComponent');
        let user = await User.findById(userData.id).lean(true).populate('wishlist').select('-password -_id -__v');

        if (!user) {
            return MessageHandler.messageGenerator('The user does not exist', false);
        }

        let getObjectImage = ImageComponent('getObjectImage'); // Fetching a service from ImageMicroservice

        return getObjectImage({
                ObjectType: 'user',
                ID: userData.id, // from the incoming request param
                userID: userData.id // from the JWT token
            })
            .then((value) => {
                user.SignedURL = value.SignedURL;
                return MessageHandler.messageGenerator(user, true, 'data');

            })
            .catch((err) => {
                console.log(err);
                return MessageHandler.messageGenerator(user, true, 'data');
            })

    }

    getUserDetail(userData) {

        return User
            .findById(userData.id)
            .lean(true)
            .select('address username -_id'); //By the moment We will only select the user's address and username

    }

    retrieveUserField(userData) {

        return User
            .findOne({
                $or: [{
                    _id: userData.credential
                }, {
                    username: userData.credential
                }]
            })
            .lean(true)
            .select(`-_id ${userData.field}`); //By the moment We will only select the user's address and username

    }

    getUserBatch(userData) {
        // console.log(userData);
        return User
            .find({
                _id: {
                    $in: userData.userGuids
                }
            })
            .lean(true)
            .select('address username'); //By the moment We will only select the user's address and username

    }
}

/*Helpers*/

const _isValidateField = (data, setWish) => {

    let {field, value} = data;

    if (setWish) { // to set new Wishlist into a user model
        data.fieldName = () => field;
        return true;
    }

    if (['email', 'password', 'address', 'fcmToken'].includes(field)) {
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

const _proccessTokenArray = (action, fcmList, userData) => {

    switch (action) {

        case 'add': {
            if (fcmList.includes(userData.fcmToken)) {
                return fcmList;
            }

            fcmList.push(userData.fcmToken);
            return fcmList;
        }



        case 'update': {
            for (let fcmToken of fcmList) {
                if (userData.previousToken === fcmToken) {
                    fcmToken = userData.fcmToken;
                }
            }
            return fcmList
        }



        case 'delete': {
            return _.filter(fcmList, fcmToken => fcmToken !== userData.fcmToken);
        }

        default:
            return false;

    }
};

const userService = new UserService();

export default userService;
