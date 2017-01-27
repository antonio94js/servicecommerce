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

                const endPaymentProcess = OrderComponent('endPaymentProcess');

                endPaymentProcess(orderPreferenceID)
                    .then((value) => {
                        console.log(value);
                    })
                    .catch((err) => {
                        console.log("HAY UN ERROR CON ENDPROCESS DE ORDENES- PUBLICANDO EN LA COLA");
                        RabbitQueueHandler.pushMessage(orderPreferenceID, 'order_queue');
                    });
            }
        }
        res.sendStatus(200);
    }
}

//HELPERS

const checkPayment = payment => payment.response.status === 'approved';

const getPayment = (paymentID) => {

    return  mp.get(`/v1/payments/${paymentID}`)
        .then(paymentData => paymentData)
        .catch(error => false );
};

const orderController = new OrderController();

export default orderController;
