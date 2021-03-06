import Studio from 'studio';
import mercadopago from '../config/mercadopago';
import ErrorHandler from '../handler/ErrorHandler';
import 'babel-polyfill';

const SellerComponent = Studio.module('SellerComponent'); //Fetching the User Microservice
const mp = mercadopago.mercadopagoInstance();  // Creating mercadopago instance with sc credentials

class MercadoPagoService {

    async getOrderPreference({response}) {

        const sellerToken = await getSellerMPToken(response);

        if(sellerToken){
            const mp = mercadopago.mercadopagoInstance(sellerToken);
            const orderID = response.order.id;
            const getOrder = mp.get (`/merchant_orders/${orderID}`);

            return getOrder
                .then(OrderData => OrderData.response.preference_id)
                .catch(error => console.log(error));
        }
            return null;
    }
}

//HELPERS
const getSellerMPToken = ({collector}) => {

    const getSellerToken = SellerComponent('getSellerToken');

    return getSellerToken(collector.id)
    .then(token => token)
    .catch(err => false);
};

const mercadoPagoService = new MercadoPagoService();

export default mercadoPagoService;
