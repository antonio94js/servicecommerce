import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import SellerService from '../business/SellerService';


// const WishlistComponent = Studio.module('WishlistComponent');

class SellerComponent {

    * setSellerProfile(sellerData) {
        return yield SellerService.setSellerProfile(sellerData);
    }

    * updateSellerProfile(sellerData) {
        return yield SellerService.updateSellerProfile(sellerData);
    }

    * updateScore(sellerData) {
        return yield SellerService.updateScore(sellerData);
    }

    * getSellerToken(collectorData) {
        return yield SellerService.getSellerToken(collectorData);
    }

    * checkSellerPaymentMethods (paymentMethod,userID) {
        return yield SellerService.checkSellerPaymentMethods(paymentMethod,userID);
    }

}
//return a new instance from your Microservices component
const sellerComponent = Studio.serviceClass(SellerComponent);

ErrorLoggerHanlder.setErrorLogger(sellerComponent)

// UserObject.getUserProfile.timeout(3000);
