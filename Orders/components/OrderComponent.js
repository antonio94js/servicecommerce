import Studio from 'studio';
import OrderService from '../business/OrderService';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';


class OrderComponent {

}

const orderService = Studio.serviceClass(OrderComponent);


if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(orderService)
}
