import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import Wishlist from '../models/Whislist';
import Common from '../utils/Common';
import WishlistService from '../business/WishlistService';
import {registerMicroservice} from '../handler/StopComponentHandler';
const UserComponent = Studio.module('UserComponent');

class WishlistComponent {

    *createWishlist(userID) {

        let wishlist = {'_id':Common.generateID(),userID};

        let savedWishlist = yield Wishlist.create(wishlist);

        let wishlistData = {
            'id':savedWishlist.userID,
            'field':'wishlist',
            'value':savedWishlist._id
        };

        UserComponent('updateUserProfile')(wishlistData,true);
    }

    *addPublication(publicationData) {
        return yield WishlistService.updateUserWishlist('add',publicationData);

    }

    *deletePublication(publicationData) {

        return yield WishlistService.updateUserWishlist('delete',publicationData);

    }
}

const wishlistComponent = Studio.serviceClass(WishlistComponent);

if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(wishlistComponent);
    registerMicroservice(wishlistComponent);
}
