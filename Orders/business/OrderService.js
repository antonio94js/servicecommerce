import Order from '../models/Order';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';

class OrderService {

    endPaymentProcess(PreferenceID) {
        //recibir preferencia id que esta guardada en la orden para mandar notificacion de pago realizado al comprador y vendedor

    }


}

/*HELPERS*/

const orderService = new OrderService();

export default orderService;
