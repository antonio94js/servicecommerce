import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Wishlist from '../models/Whislist';

class WishlistService {

    async updateUserWishlist(action, publicationData) {

        let wishlist = await Wishlist.findOne({userID: publicationData.userID});

        if (wishlist) {

            const result = _proccessPublicationsArray(action, wishlist.publications, publicationData.data)

            if (_.isArray(result)) {
                wishlist.publications = result;

                await Wishlist.findByIdAndUpdate(wishlist._id, {$set: {'publications': wishlist.publications}});

                let message = action === 'add' ? "Publication added successfully" :
                    "Publication deleted successfully"

                return MessageHandler.messageGenerator(message, true);

            } else {

                return result;
            }

        } else {
            return MessageHandler.messageGenerator("The Wishlist does not exist", false);
        }
    }
}

const _proccessPublicationsArray = (action, publicationsList, item) => {

    switch (action) {

        case 'add':
            for (const publicationItem of publicationsList) {
                if (publicationItem.publicationID === item.publicationID) {

                    return MessageHandler.messageGenerator("The publication already exist in your wishlist", false);
                }
            }
            publicationsList.push(item);
            return publicationsList; // Return the PublicationsList with the new added element;
            // return publicationsList.concat(item);


        case 'delete':
            // Return the PublicationsList filtering the publication to delete;
            return _.filter(publicationsList, publicationItem => publicationItem.publicationID !== item.publicationID);

        default:
            throw MessageHandler.errorGenerator("This operation is invalid", 400);

    }
};

const wishlistService = new WishlistService();

export default wishlistService
