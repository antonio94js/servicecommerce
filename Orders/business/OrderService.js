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
        //recibir preferencia id que esta guardada en la orden para mandar notificacion de pago realizado al comprador y vendedor

    }

    async createOrder(orderData) {
        const UserComponent = Studio.module('UserComponent');
        const getSellerToken = UserComponent('getSellerToken');
        switch (orderData.paymentOrderType) {
            case 'automatic':
                {

                    const preferenModel = {...preference};
                    preferenModel.title = orderData.publicationName;
                    preferenModel.quantity = orderData.productQuantity;
                    preferenModel.unit_price = orderData.unitPrice;

                    const sellerToken = await getSellerToken(orderData.sellerID);
                    const mp = getMercadopagoInstance(sellerToken);
                    const {reponse} = await mp.createPreference(preferenModel);
                    orderData._id = reponse.id;
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
