import Studio from 'studio';
import OrderService from '../business/OrderService';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import {registerMicroservice} from '../handler/StopComponentHandler';


class OrderComponent {

    *changeOrderStatus(orderData) {
        return yield OrderService.changeOrderStatus(orderData);
    }

    *createOrder(orderData) {
        return yield OrderService.createOrder(orderData);
    }

    *checkOrderStatus(publicationID) {
        return yield OrderService.checkOrderStatus(publicationID);
    }

    *getOrdersBatch(orderData) {
        return yield OrderService.getOrdersBatch(orderData);
    }

    *createReview(orderData) {
        return yield OrderService.createReview(orderData);
    }

    *getOrderReviewsAsSeller(sellerID,limit = null) {
        return yield OrderService.getOrderReviewsAsSeller(sellerID,limit);
    }

}

const orderComponent = Studio.serviceClass(OrderComponent);


if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(orderComponent)
    registerMicroservice(orderComponent);
}
