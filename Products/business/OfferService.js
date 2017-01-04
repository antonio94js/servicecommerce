import Studio from 'studio';
import co from 'co';
import Offer from '../models/offer';
import ProductService from '../business/ProductService';
import MessageHandler from '../handler/MessageHandler';
import moment from 'moment';

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

                // console.log(\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\dZ.test(offerData.endDate));

                if(!moment(offerData.startDate, "YYYY-MM-DD HH:mm Z", true).isValid() || !moment(offerData.endDate, "YYYY-MM-DD HH:mm Z", true).isValid()){
                    throw MessageHandler.errorGenerator("Date not valid",400);

                }

                offer.startDate = offerData.startDate;
                offer.endDate = offerData.endDate;
                offer.price = offerData.price;

                return offer.save()
                    .then((offer) => {
                        return MessageHandler.messageGenerator('Offer updated successfully', true);
                    }).catch((err) => {
                        // if (err.code === 11000 || err.code === 11001)
                        //     throw MessageHandler.errorGenerator("The product already exist", 409);

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
