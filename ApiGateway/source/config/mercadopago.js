import MP from 'mercadopago';

const {MP_ACCESS_TOKEN} = process.env;



const mercadopagoInstance = (AT = null) =>  !!AT ? new MP (AT) : new MP (MP_ACCESS_TOKEN);

export default {mercadopagoInstance};
