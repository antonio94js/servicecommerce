import jwt from 'jsonwebtoken';
import config from '../config/config';


const generateAccessToken = (payload) => jwt.sign(payload,config.getPrivateTokenKey(),{expiresIn: '1d'});


export default {generateAccessToken}
