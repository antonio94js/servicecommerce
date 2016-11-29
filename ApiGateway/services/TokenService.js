import jwt from 'jsonwebtoken';
import config from '../config/config';


const generateAccessToken = (payload) => jwt.sign(payload,config.getPrivateTokenKey(),{expiresIn: '1d'});

const verifyAccessToken = (token,cb) => { jwt.verify(token,config.getPrivateTokenKey(),cb) };


export default {generateAccessToken,verifyAccessToken}
