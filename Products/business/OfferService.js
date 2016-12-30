import Studio from 'studio';
import co from 'co';
import Offer from '../models/offer';
import ProductService from '../business/ProductService';
import MessageHandler from '../handler/MessageHandler';

const createNewOffer = (offerData) => {
    return co.wrap(function*() {
        let product = yield ProductService.productBelongsToUser(offerData);

        if (product) {
            yield Offer.create(offerData);
            return yield ProductService.assignOffer(offerData);
        }
        return MessageHandler.messageGenerator('Product not found', false);

    })();

};

const updateOffer = (offerData) => {
    return co.wrap(function*() {

        let product = yield ProductService.productBelongsToUser(offerData);

        if (product) {

            let offer = yield Offer.findById(offerData._id);

            if (offer) {
                offer.startDate = offerData.startDate;
                offer.endDate = offerData.price;
                offer.price = offerData.price;

                return offer.save()
                    .then((offer) => {
                        return MessageHandler.messageGenerator('Offer updated successfully', true);
                    }).catch((err) => {
                        throw MessageHandler.errorGenerator("Something wrong happened updating offer",
                            500);
                    });
            }

            return MessageHandler.messageGenerator('Offer not found', false);

        }
        return MessageHandler.messageGenerator('Product not found', false);

    })();
};

const removeOffer = (offerData) => {
    return co.wrap(function*() {

        let product = yield ProductService.productBelongsToUser(offerData);
        if (product && product.offer._id)
            return Offer
                .remove({
                    _id: product.offer._id
                })
                .then((response) => {
                    return MessageHandler.messageGenerator('Offer deleted successfully', true);
                }).catch((err) => {
                    throw MessageHandler.errorGenerator("Something wrong happened deleting offer", 500);
                });

        return MessageHandler.messageGenerator("Product not found in yours", false);
    })();
};


export default {
    createNewOffer, updateOffer, removeOffer
};
