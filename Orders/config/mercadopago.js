var MP = require ("mercadopago");

const {MP_CLIENT_ID, CLIENT_SECRET} = process.env;

const mp = new MP (MP_CLIENT_ID, CLIENT_SECRET);
