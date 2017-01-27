import Order from '../models/Order';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';
import {
    preference, getMercadopagoInstance
}
from '../config/mercadopago';

class OrderService {

    endPaymentProcess(PreferenceID) {
        return PreferenceID
    }

    async createOrder(orderData) {
        const UserComponent = Studio.module('UserComponent');
        const getSellerToken = UserComponent('getSellerToken');
        switch (orderData.paymentOrderType) {
            case 'automatic':
                {

                    const preferenModel = {...preference};
                    preferenModel.items[0].title = orderData.publicationName;
                    preferenModel.items[0].quantity = orderData.productQuantity;
                    preferenModel.items[0].unit_price = orderData.unitPrice;
                    // console.log(preferenModel);
                    // console.log(preference);
                    const sellerToken = await getSellerToken(orderData.sellerID);
                    // console.log(sellerToken);
                    const mp = getMercadopagoInstance(sellerToken);
                    const {response} = await mp.createPreference(preferenModel);
                    orderData._id = response.id;
                    orderData.paymentLink = response.init_point;

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

const orderService = new OrderService();

export default orderService;
