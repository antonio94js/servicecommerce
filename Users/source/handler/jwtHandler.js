import jwt from 'jsonwebtoken';
import randtoken from 'rand-token'
import config from '../config/config';


const generateAccessToken = (payload) => jwt.sign(payload,config.getPrivateTokenKey(),{expiresIn: '1d'});
const generateRefreshToken = () => randtoken.uid(256);


export default {generateAccessToken,generateRefreshToken}
