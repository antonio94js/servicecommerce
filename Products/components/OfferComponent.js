import Studio from 'studio';
import OfferService from '../business/OfferService';

class OfferComponent {

    *createOffer(offerData) {
        return yield OfferService.createNewOffer(offerData);
    }

    *updateOffer(offerData) {
        return yield OfferService.updateOffer(offerData);
    }

    *deleteOffer(offerData) {
        return yield OfferService.removeOffer(offerData);
    }

}

//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(OfferComponent);
