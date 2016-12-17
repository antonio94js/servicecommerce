import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import Wishlist from '../models/Whislist';
import Common from '../utils/Common';
import WishlistService from '../bussiness/WishlistService';


const UserComponent = Studio.module('UserComponent');

class WishlistComponent {

    *createWishlist(iduser) {

        let wishlist = {_id:Common.generateID(),iduser};

        let savedWishlist = yield Wishlist.create(wishlist);

        let payload = {
            id:savedWishlist.iduser,
            field:'wishlist',
            value:savedWishlist._id
        };

        UserComponent('updateUserProfile')(payload,true);
    }

    *addPublication(payload) {
        return yield WishlistService.updateUserWishlist('add',payload);

    }

    *deletePublication(payload) {

        return yield WishlistService.updateUserWishlist('delete',payload);

    }
}

Studio.serviceClass(WishlistComponent);
