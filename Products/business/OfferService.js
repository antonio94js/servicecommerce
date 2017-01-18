import Studio from 'studio';
import co from 'co';
import Offer from '../models/offer';
import ProductService from '../business/ProductService';
import MessageHandler from '../handler/MessageHandler';
import moment from 'moment';
import common from '../utils/Common';

const createNewOffer = (offerData) => {
    return co.wrap(function*() {

        let product = yield ProductService.productBelongsToUser(offerData);

        if (!product) return MessageHandler.messageGenerator('Product not found', false);

        if(!common.dateValidate(offerData.startDate, offerData.endDate)){
            throw MessageHandler.errorGenerator("Please check the Date fields format"  ,400);
        }

        yield Offer.create(offerData);

        return yield ProductService.assignOffer(offerData);

    })();

};

const updateOffer = (offerData) => {
    return co.wrap(function*() {

        let product = yield ProductService.productBelongsToUser(offerData);

        if (!product) return MessageHandler.messageGenerator('Product not found', false);

        let offer = yield Offer.findById(offerData._id);

        if (!offer) return MessageHandler.messageGenerator('Offer not found', false);

        if(!common.dateValidate(offerData.startDate, offerData.endDate)){
            throw MessageHandler.errorGenerator("Please check the Date fields format",400);
        }

        offer.startDate = offerData.startDate;
        offer.endDate = offerData.endDate;
        offer.price = offerData.price;

        return offer.save()
            .then((offer) => {
                return MessageHandler.messageGenerator('Offer updated successfully', true);
            }).catch((err) => {

                throw MessageHandler.errorGenerator("Something wrong happened updating offer",
                    500);
            });
    })();
};

const removeOffer = (offerData) => {
    return co.wrap(function*() {

        let product = yield ProductService.productBelongsToUser(offerData);

        if (!(product && product.offer)) return MessageHandler.messageGenerator("Offer not found in yours", false);

        return Offer
            .remove({
                _id: product.offer._id
            })
            .then((response) => {
                return MessageHandler.messageGenerator('Offer deleted successfully', true);
            }).catch((err) => {
                throw MessageHandler.errorGenerator("Something wrong happened deleting offer", 500);
            });
    })();
};


export default {
    createNewOffer, updateOffer, removeOffer
};
