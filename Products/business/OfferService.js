import Studio from 'studio';
import co from 'co';
import Offer from '../models/offer';
import ProductService from '../business/ProductService';
import MessageHandler from '../handler/MessageHandler';
import moment from 'moment';

class OfferService {

    async createNewOffer(offerData) {

        let product = await ProductService.productBelongsToUser(offerData);

        if (!product) return MessageHandler.messageGenerator('Product not found', false);

        if(isNaN(Date.parse(offerData.startDate)) || isNaN(Date.parse(offerData.endDate))){
            throw MessageHandler.errorGenerator("Date not valid",400);
        }

        await Offer.create(offerData);

        return await ProductService.assignOffer(offerData);
    }

    async updateOffer(offerData) {

        let product = await ProductService.productBelongsToUser(offerData);

        if (!product) return MessageHandler.messageGenerator('Product not found', false);

        let offer = await Offer.findById(offerData._id);

        if (!offer) return MessageHandler.messageGenerator('Offer not found', false);

        if(isNaN(Date.parse(offerData.startDate)) || isNaN(Date.parse(offerData.endDate))){
            throw MessageHandler.errorGenerator("Date not valid",400);
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
    }

    async removeOffer(offerData) {

        let product = await ProductService.productBelongsToUser(offerData);

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
    }
}

const offerService = new OfferService();

export default offerService;
