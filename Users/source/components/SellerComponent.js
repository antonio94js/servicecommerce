import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import SellerService from '../business/SellerService';
import { registerMicroservice } from '../handler/StopComponentHandler';

// const WishlistComponent = Studio.module('WishlistComponent');

class SellerComponent {

    * setSellerProfile(sellerData) {
        return yield SellerService.setSellerProfile(sellerData);
    }

    * getBankAccounts(sellerID) {
        return yield SellerService.getBankAccounts(sellerID);
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

    * getSellerReviews (sellerData) {
        return yield SellerService.getSellerReviews(sellerData);
    }

}
//return a new instance from your Microservices component
const sellerComponent = Studio.serviceClass(SellerComponent);

if (process.env.NODE_ENV !== 'test') {

    ErrorLoggerHanlder.setErrorLogger(sellerComponent)
    registerMicroservice(sellerComponent);
}

// UserObject.getUserProfile.timeout(3000);
