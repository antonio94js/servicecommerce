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
import Common from '../utils/Common';

class OrderService {

    async changeOrderStatus(orderData) {

        const order = await Order.findById(orderData.id);

        switch (orderData.status) {
            case 'cancelled': {
                if (order.status === 'inprocess') {
                    order.status = 'cancelled';
                    order.save();

                    // orderData.subjectCredential = order.sellerID;
                    // _sendNotification(orderData, 'CancelledOrder');

                    return MessageHandler.MessageHandler('Order cancelled succesfully', true);
                }
            }

            case 'processed': {
                if (order.status === 'inprocess') {
                    order.status = 'processed';
                    order.save();

                    //TODO send notification to both seller and buyer

                    return MessageHandler.MessageHandler('Order processed succesfully', true);
                }
            }
            case 'finished': {
                if (order.status === 'processed') {
                    order.status = 'finished';
                    order.save();

                    //TODO send notification to both seller and buyer

                    return MessageHandler.MessageHandler('Order finished succesfully', true);
                }
            }
            default:
                throw MessageHandler.errorGenetor("Invalid order's status", 400);
        }

        throw MessageHandler.errorGenetor(`You can't change from status '${order.status}' to '${orderData.status}'`, 400);


        //TODO mandar notificacion al vendedor y comprador
    }

    async createOrder(orderData) {
        const SellerComponent = Studio.module('SellerComponent');
        const PublicationComponent = Studio.module('PublicationComponent');
        const ProductComponent = Studio.module('ProductComponent');
        const UserComponent = Studio.module('UserComponent');

        const CheckOwnership = PublicationComponent('CheckOwnership');
        const removeFromStock = ProductComponent('removeFromStock');
        const getSellerToken = SellerComponent('getSellerToken');
        const getBankAccounts = SellerComponent('getBankAccounts');
        const retrieveUserField = UserComponent('retrieveUserField');

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

                    const productData = {
                        id : publicationData.productID,
                        orderQuantity : orderData.productQuantity
                    };

                    //TODO si el microservicio de producto se cae, usar cola de mensaje
                    // removeFromStock(productData).then((value) => {
                    //
                    // }).catch(err => {
                    //     console.log(err);
                    //     RabbitQueueHandler.pushMessage(orderPreferenceID, 'product_queue');
                    // });

                    orderData.subjectCredential = orderData.sellerID;
                    orderData.receiverTarget = 'Seller';
                    _sendNotification(orderData,'newAutomaticOrder');

                    orderData.subjectCredential = orderData.buyerID;
                    orderData.receiverTarget = 'Buyer';
                    _sendNotification(orderData,'newAutomaticOrder');

                    return await Order.create(orderData);
                }
            case 'manual':
                {
                    orderData._id = Common.generateID();
                    await Order.create(orderData);

                    // const banckAccounts = await getBankAccounts(orderData.sellerID);
                    // const sellerUsername = await retrieveUserField(orderData.sellerID);

                    orderData.subjectCredential = orderData.buyerID;
                    orderData.receiverTarget = 'Buyer';
                    _sendNotification(orderData,'newManualOrder');

                    orderData.subjectCredential = orderData.sellerID;
                    orderData.receiverTarget = 'Seller';
                    _sendNotification(orderData,'newManualOrder');

                    //TODO enviar push al vendedor y email al comprador
                    break;
                }
            default:
                {
                    throw MessageHandler.errorGenetor('Invalid payment method', 400)
                }
        }
    }

    async checkOrderStatus(publicationID) {
        const order = await Order.find({publicationID}).where({status:{$in:['inprocess','processed']}})
        return !!order && order.length > 0;
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
