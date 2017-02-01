import Order from '../models/Order';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';
import RabbitQueueHandler from '../handler/RabbitQueueHandler';
import {
    preference, getMercadopagoInstance
}
from '../config/mercadopago';

class OrderService {

    endPaymentProcess(PreferenceID) {
        return "finalzo el pago";
    }

    async createOrder(orderData) {
        const SellerComponent = Studio.module('SellerComponent');
        const PublicationComponent = Studio.module('PublicationComponent');
        const ProductComponent = Studio.module('ProductComponent');

        const CheckOwnership = PublicationComponent('CheckOwnership');
        const removeFromStock = ProductComponent('removeFromStock');
        const getSellerToken = SellerComponent('getSellerToken');

        const publicationData = await CheckOwnership({_id:orderData.publicationID,userID: orderData.sellerID});

        switch (orderData.paymentOrderType) {
            case 'automatic':
                {
                    const preferenModel = _.cloneDeep(preference);
                    preferenModel.items[0].title = orderData.publicationName;
                    preferenModel.items[0].quantity = orderData.productQuantity;
                    preferenModel.items[0].unit_price = orderData.unitPrice;

                    const sellerToken = await getSellerToken(orderData.sellerID);
                    const mp = getMercadopagoInstance(sellerToken);
                    const {response} = await mp.createPreference(preferenModel);

                    orderData._id = response.id;
                    orderData.paymentLink = response.init_point;

                    orderData.subjectCredential = orderData.sellerID;

                    _sendNotification(orderData,'newOrder');

                    return await Order.create(orderData);
                }
            case 'manual':
                {
                    break;
                }
            default:
                {
                    throw MessageHandler.errorGenetor('Invalid payment method', 400)
                }
        }
    }

}



/*HELPERS*/

const _sendNotification = (orderData, context) => {

    const NotificationComponent = Studio.module('NotificationComponent');
    const sendPushNotification = NotificationComponent('sendPushNotification');
    const sendEmail = NotificationComponent('sendEmail');

    // console.log(NotificationComponent);

    const notificationData = {
        context: context,
        data: orderData
    };

    Promise.all([sendPushNotification(notificationData), sendEmail(notificationData)])
        .then((value) => {
            console.log(value);
        })
        .catch((err) => {
            // console.log(err);
            console.log("HAY UN ERROR - PUBLICANDO EN LA COLA");
            RabbitQueueHandler.pushMessage(notificationData, 'notification_queue');
        })
}

const orderService = new OrderService();

export default orderService;
