
import crypto from 'crypto';
import dotenv from 'dotenv';


dotenv.config();

/*CONST AND VAR*/

const {ALGORITM, PASSWORD} = process.env

/*PUBLIC METHODS*/

const getRandomPort = () => Math.floor(Math.random() * (10200 - 8081 + 1) + 8081);

const cryptoID = (ID,action) => {

    switch (action) {
        case 'encrypt':
            return _encryptID(ID);

        case 'decrypt':
            return _decryptID(ID);

        default:
            return _encryptID(ID);
    }

}

/*PRIVATES METHODS*/

const _encryptID = (ID) => {
    let cipher = crypto.createCipher(ALGORITM,PASSWORD)
    let crypted = cipher.update(ID,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

const _decryptID = (ID) => {
    let decipher = crypto.createDecipher(ALGORITM,PASSWORD)
    let dec = decipher.update(ID,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}


export default {getRandomPort,cryptoID};
