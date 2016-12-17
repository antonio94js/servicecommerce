import Studio from 'studio';
import OfferService from '../business/OfferService';

class OfferComponent {

    *createOffer(offerData) {
        return yield OfferService.store(offerData);
    }

    *updateOffer(offerData) {
        return yield OfferService.update(offerData);
    }

    *deleteOffer(offerData) {
        return yield OfferService.remove(offerData);
    }

}
//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(OfferComponent);
