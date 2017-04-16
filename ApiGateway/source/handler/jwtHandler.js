import jwt from 'jsonwebtoken';
import config from '../config/config';

const verifyAccessToken = (token,cb) => { jwt.verify(token,config.getPrivateTokenKey(),cb); };


export default {verifyAccessToken};
