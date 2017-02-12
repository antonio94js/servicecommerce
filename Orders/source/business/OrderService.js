import Order from '../models/Order';
import OrderReview from '../models/OrderReview';
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
import {
    generateID
}
from '../utils/Common';
import 'babel-polyfill';

class OrderService {

    async changeOrderStatus(orderData) {

        const order = await Order.findById(orderData.id);
        // console.log(orderData.status);
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
                            publicationName: order.publicationName,
                            productQuantity: order.productQuantity,
                            totalPrice: order.totalPrice,
                            buyerID: order.buyerID,
                            sellerID: order.sellerID
                        };

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification('cancelOrder', OrderInfo);

                        return MessageHandler.messageGenerator('Order cancelled succesfully', true);
                    }
                    break;
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
                            publicationName: order.publicationName,
                            productQuantity: order.productQuantity,
                            totalPrice: order.totalPrice,
                            buyerID: order.buyerID,
                            sellerID: order.sellerID
                        };

                        OrderInfo.subjectCredential = order.buyerID;
                        OrderInfo.receiverTarget = 'Buyer';
                        _sendNotification('proccessOrder', {...OrderInfo});

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification('proccessOrder', {...OrderInfo});

                        return MessageHandler.messageGenerator('Order processed succesfully', true);
                    }
                    break;
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
                            publicationName: order.publicationName,
                            productQuantity: order.productQuantity,
                            totalPrice: order.totalPrice,
                            buyerID: order.buyerID,
                            sellerID: order.sellerID
                        };

                        OrderInfo.subjectCredential = order.sellerID;
                        OrderInfo.receiverTarget = 'Seller';
                        _sendNotification('finished', {...OrderInfo
                        });

                        return MessageHandler.messageGenerator('Order finished succesfully', true);
                    }
                    break;
                }
            default:
                {
                    throw MessageHandler.errorGenerator("Invalid order's status", 400);
                }

        }

        throw MessageHandler.errorGenerator(
            `You can't change the actual order from status '${order.status}' to '${orderData.status}'`,
            400);



    }

    async createOrder(orderData) {
        const SellerComponent = Studio.module('SellerComponent');
        const PublicationComponent = Studio.module('PublicationComponent');
        const UserComponent = Studio.module('UserComponent');

        const CheckOwnership = PublicationComponent('CheckOwnership');

        const getSellerToken = SellerComponent('getSellerToken');
        const getBankAccounts = SellerComponent('getBankAccounts');
        const retrieveUserField = UserComponent('retrieveUserField');

        const publicationData = await CheckOwnership({
            _id: orderData.publicationID,
            userID: orderData.sellerID
        });

        const productData = {
            id: publicationData.productID,
            orderQuantity: orderData.productQuantity
        };

        if(publicationData.paymentMethod !== 'both' && orderData.paymentOrderType !==  publicationData.paymentMethod) {
            throw MessageHandler.errorGenerator("This publication doesn't allow this payment method", 400)
        }

        orderData.totalPrice = orderData.unitPrice * orderData.productQuantity;

        switch (orderData.paymentOrderType) {
            case 'automatic':
                {
                    const preferenModel = _.cloneDeep(preference);
                    _setPreferenceData(preferenModel,orderData)

                    const sellerToken = await getSellerToken(orderData.sellerID);
                    const mp = getMercadopagoInstance(sellerToken);
                    const {response} = await mp.createPreference(preferenModel);

                    orderData._id = response.id;
                    orderData.paymentLink = response.init_point;

                    _removeFromStock(productData);

                    orderData.subjectCredential = orderData.sellerID;
                    orderData.receiverTarget = 'Seller';
                    _sendNotification('newAutomaticOrder',orderData);

                    return await Order.create(orderData);
                }
            case 'manual':
                {
                    orderData._id = generateID();
                    const order = await Order.create(orderData);

                    orderData.subjectCredential = orderData.buyerID;
                    orderData.receiverTarget = 'Buyer';
                    _sendNotification('newManualOrder', {...orderData});

                    orderData.subjectCredential = orderData.sellerID;
                    orderData.receiverTarget = 'Seller';
                    _sendNotification('newManualOrder', {...orderData});

                    _removeFromStock(productData);

                    return order;
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
                        sellerID: orderData.userID
                    }).lean(true);
                }

            case 'buyer':
                {
                    return await Order.find({
                        buyerID: orderData.userID
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

        return !!order && order.length > 0;
    }

    async getOrderReviewsAsSeller(sellerID,orderLimit) {
        return await OrderReview.find({sellerID}).populate({'path':'order','select':'publicationName'}).select('-_id -__v -sellerID').limit(orderLimit);
    }

    async createReview(orderReviewData) {
        const order = await Order.findById(orderReviewData.orderID).where({
            buyerID: orderReviewData.userID
        })

        if (!order) throw MessageHandler.errorGenerator("You can't review this order", 403);

        if (order.status === 'finished') {

            // const review =  await OrderReview.findOne({order:order._id})
            // if (review) return MessageHandler.messageGenerator("This order already has been reviewed", true);

            orderReviewData._id = generateID();
            orderReviewData.order = order._id;
            orderReviewData.sellerID = order.sellerID;
            const orderReview = await OrderReview.create(orderReviewData);
            this.calculateTotalSellerScore(orderReview);
            return MessageHandler.messageGenerator("Your review was done successfully", true);
        }

        return MessageHandler.messageGenerator("This order isn't finished yet", false);
    }

    async calculateTotalSellerScore({sellerID}) {
        const SellerComponent = Studio.module('SellerComponent');
        const updateScore = SellerComponent('updateScore');

        const reviews = await OrderReview.find({
            sellerID
        });

        const totalScore = _.meanBy(reviews, 'orderScore');
        const data = {
            sellerID, totalScore
        };

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
const _setPreferenceData = (preferenModel,{publicationName,productQuantity,unitPrice})=> {
    preferenModel.items[0].title = publicationName;
    preferenModel.items[0].quantity = productQuantity;
    preferenModel.items[0].unit_price = unitPrice;
}
const _sendNotification = (context, orderData) => {

    const NotificationComponent = Studio.module('NotificationComponent');
    const sendPushNotification = NotificationComponent('sendPushNotification');
    const sendEmail = NotificationComponent('sendEmail');

    // console.log(NotificationComponent);

    const notificationData = {
        context: context,
        data: orderData
    };

    // console.log(notificationData);

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

const _removeFromStock = (data) => {
    const ProductComponent = Studio.module('ProductComponent');
    const removeFromStock = ProductComponent('removeFromStock');
    removeFromStock(data)
        .catch(err => {
            // console.log("publicando en la cola product");
            const productMessage = {
                data,
                component: 'ProductComponent',
                service: 'removeFromStock'
            }
            RabbitQueueHandler.pushMessage(productMessage, 'product_queue');
        });
}

const orderService = new OrderService();

export default orderService;
