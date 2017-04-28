import dotenv from 'dotenv';

dotenv.config({
    silent: true
});

const {MP_ACCESS_TOKEN} = process.env;

export const getMercadoPagoToken = () => MP_ACCESS_TOKEN;
