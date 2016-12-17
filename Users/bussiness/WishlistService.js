
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Wishlist from '../models/Whislist';

const updateUserWishlist = (action, payload) => {

    return co.wrap(function*() {
        let wishlist = yield Wishlist.findOne({iduser: payload.iduser});

        if (wishlist) {

            let result = _proccessPublicationsArray(action, wishlist.products, payload.data)

            if (_.isArray(result)) {
                wishlist.products = result;

                yield Wishlist.findByIdAndUpdate(wishlist._id, {$set: {'products': wishlist.products}});

                let message = action === 'add' ? "Publications added successfully" : "Publications deleted successfully"
                return MessageHandler.messageGenerator(message, true);

            } else {

                return result;
            }

        } else {
            return result;
        }
    })();

}

const _proccessPublicationsArray = (action, publicationsList, item) => {
    switch (action) {
        case 'add':

            for (const publicationItem of publicationsList) {
                if (publicationItem.publicationID === item.publicationID) {
                    return MessageHandler.messageGenerator("The publication already exist in your wishlist", false);
                }
            }
            return publicationsList.concat(item);
            // return publicationsList

        case 'delete':
            return _.filter(publicationsList, (publicationItem) => publicationItem.publicationID !== item.publicationID);

        default:
            return MessageHandler.errorGenerator("This operation is invalid", 400);

    }
};

export default {updateUserWishlist}
