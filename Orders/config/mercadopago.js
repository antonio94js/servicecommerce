import MP from 'mercadopago';

const {MP_ACCESS_TOKEN} = process.env;

export const preference = {
   "items": [
       {
           "title": null,
           "quantity": null,
           "currency_id": "VEF",
           "unit_price": null
       },
   ],
   "back_urls" : {
      "success": "http://localhost/success",
      "pending" : "http://localhost/pending",
      "failure" : "http://localhost/failure"
   },
   "auto_return" : 'all',
   "notification_url" : 'http://186.90.75.229:3000/api/order/notification'

};

export const getMercadopagoInstance = (AT = null) =>  !!AT ? new MP (AT) : new MP (MP_ACCESS_TOKEN);

export default {getMercadopagoInstance};
