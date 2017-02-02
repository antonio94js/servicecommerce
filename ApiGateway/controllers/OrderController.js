import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';
import Promise from 'bluebird';
import mercadopago from '../config/mercadopago';
import MercadoPagoService from '../services/MercadoPagoService';
import RabbitQueueHandler from '../handler/RabbitQueueHandler';

const OrderComponent = Studio.module('OrderComponent'); //Fetching the Order Microservice

const mp = mercadopago.mercadopagoInstance(); // Creating mercadopago instance with sc credentials

class OrderController {

    async getMPNotification(req, res, next) {

        if (req.query.topic && req.query.topic === 'payment') {

            const paymentID = req.query.id;
            // console.log('PaymentID: ' + paymentID);

            const payment = await getPayment(paymentID);

            if (payment && checkPayment(payment)) {

                const orderPreferenceID = await MercadoPagoService.getOrderPreference(payment);

                const changeOrderStatus = OrderComponent('changeOrderStatus');

                const orderData = {
                    id: orderPreferenceID,
                    status: 'processed'
                };

                changeOrderStatus(orderData)
                    .then((value) => {
                        console.log(value);
                    })
                    .catch((err) => {
                        const orderMessage = {
                            data: orderData,
                            component: 'OrderComponent',
                            service: 'changeOrderStatus'
                        }
                        RabbitQueueHandler.pushMessage(orderPreferenceID, 'order_queue');
                    });
            }
        }
        res.sendStatus(200);
    }

    pay(req, res, next) {
        const createOrder = OrderComponent('createOrder');
        // req.body.userID = req.user.id;

        createOrder(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    getOrdersBatch(req, res, next) {
        const getOrdersBatch = OrderComponent('getOrdersBatch');
        req.body.userID = req.user.id;

        getOrdersBatch(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    creteaOrderReview(req, res, next) {
        const createReview = OrderComponent('createReview');
        req.body.userID = req.user.id;
        req.body.orderID = req.params.orderID;

        createReview(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    changeOrderStatus(req, res, next) {

        const changeOrderStatus = OrderComponent('changeOrderStatus');
        req.body.userID = req.user.id;

        changeOrderStatus(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }
}

//HELPERS

const checkPayment = payment => payment.response.status === 'approved';

const getPayment = (paymentID) => {

    return mp.get(`/v1/payments/${paymentID}`)
        .then(paymentData => paymentData)
        .catch(error => false);
};

const orderController = new OrderController();

export default orderController;
