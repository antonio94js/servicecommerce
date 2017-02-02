import Order from '../models/Order';
import OrdeReview from '../models/OrderReview';
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
            case 'cancelled':
                {
                    if (order.status === 'inprocess') {

                        if (orderData.userID !== order.buyerID) {
                            throw MessageHandler.errorGenerator("You can't change this order to cancelled status",
                                403)
                        }

                        order.status = 'cancelled';
                        order.save();

                        const OrderInfo = {
                            publicationName : order.publicationName,
                            productQuantity : order.productQuantity,
                            totalPrice : order.totalPrice,
                            buyerID : order.buyerID,
                            sellerID : order.sellerID
                        };

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification(OrderInfo,'cancelOrder');

                        return MessageHandler.messageGenerator('Order cancelled succesfully', true);
                    }
                }

            case 'processed':
                {
                    if (order.status === 'inprocess') {

                        if ((order.paymentOrderType === 'automatic' && orderData.userID) || (order.paymentOrderType ===
                                'manual' && orderData.userID !== order.sellerID)) {
                            throw MessageHandler.errorGenerator("You can't change this order to processed status",
                                403)
                        }

                        order.status = 'processed';
                        order.save();

                        const OrderInfo = {
                            publicationName : order.publicationName,
                            productQuantity : order.productQuantity,
                            totalPrice : order.totalPrice,
                            buyerID : order.buyerID,
                            sellerID : order.sellerID
                        };

                        OrderInfo.subjectCredential = order.buyerID;
                        OrderInfo.receiverTarget = 'Buyer';
                        _sendNotification(OrderInfo,'proccessOrder');

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification(OrderInfo,'proccessOrder');

                        return MessageHandler.messageGenerator('Order processed succesfully', true);
                    }
                }
            case 'finished':
                {
                    if (order.status === 'processed') {

                        if (orderData.userID !== order.buyerID) {
                            throw MessageHandler.errorGenerator("You can't change this order to finished status",
                                403)
                        }

                        order.status = 'finished';
                        order.save();

                        const OrderInfo = {
                            publicationName : order.publicationName,
                            productQuantity : order.productQuantity,
                            totalPrice : order.totalPrice,
                            buyerID : order.buyerID,
                            sellerID : order.sellerID
                        };

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification(OrderInfo,'finished');

                        return MessageHandler.messageGenerator('Order finished succesfully', true);
                    }
                }
            default:
                throw MessageHandler.errorGenetor("Invalid order's status", 400);
        }

        throw MessageHandler.errorGenetor(`You can't change from status '${order.status}' to '${orderData.status}'`,
            400);


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

        const publicationData = await CheckOwnership({
            _id: orderData.publicationID,
            userID: orderData.sellerID
        });

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
                        id: publicationData.productID,
                        orderQuantity: orderData.productQuantity
                    };

                    //TODO si el microservicio de producto se cae, usar cola de mensaje
                    removeFromStock(productData)
                        .catch(err => {
                            const productMessage = {
                                data,
                                component: 'ProductComponent',
                                service: 'removeFromStock'
                            }
                            RabbitQueueHandler.pushMessage(productMessage, 'product_queue');
                        });

                    orderData.subjectCredential = orderData.sellerID;
                    orderData.receiverTarget = 'Seller';
                    _sendNotification(orderData,'newAutomaticOrder');

                    // orderData.subjectCredential = orderData.buyerID;
                    // orderData.receiverTarget = 'Buyer';
                    // _sendNotification(orderData,'newAutomaticOrder');

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
                    throw MessageHandler.errorGenerator('Invalid payment method', 400)
                }
        }
    }

    async getOrdersBatch(orderData) {

        switch (orderData.userType) {
            case 'seller':
                {
                    return await Order.find({
                        buyerID: orderData.userID
                    }).lean(true);
                }

            case 'buyer':
                {
                    return await Order.find({
                        sellerID: orderData.userID
                    }).lean(true);
                }
            default:
                {
                    throw MessageHandler.errorGenerator('Invalid user type', 400)
                }
        }

    }


    async checkOrderStatus(publicationID) {
        const order = await Order.find({
            publicationID
        }).where({
            status: {
                $in: ['inprocess', 'processed']
            }
        })

        console.log(!!order && order.length > 0);
        return !!order && order.length > 0;
    }

    async createReview(orderReviewData) {
        const order = await Order.findById(orderReviewData.orderID).where({
            buyerID: orderReviewData.userID
        })

        if (!order) return MessageHandler.errorGenerator("You can't review this order", 403);

        if (order.status === 'finished') {
            orderReviewData.order = order._id;
            orderReviewData.sellerID = order.sellerID;
            const orderReview = await OrdeReview.create(orderReviewData);
            this.calculateTotalSellerScore(orderReview);
            return MessageHandler.messageGenerator("Your review was done successfully", true);
        }

        return MessageHandler.messageGenerator("This order isn't finished yet", false);
    }

    async calculateTotalSellerScore({sellerID}) {
        const SellerComponent = Studio.module('SellerComponent');
        const updateScore = Studio.module('updateScore');

        const reviews = OrdeReview.find({sellerID});
        const totalScore = _.meanBy(reviews, 'orderScore');
        const data = {
            sellerID, totalScore
        };

        console.log("El total es: " + totalScore);

        updateScore(data)
            .catch((err) => {
                console.log(err);
                const userMessage = {
                    data,
                    component: 'SellerComponent',
                    service: 'updateScore'
                }
                RabbitQueueHandler.pushMessage(userMessage, 'user_queue');
            })
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
