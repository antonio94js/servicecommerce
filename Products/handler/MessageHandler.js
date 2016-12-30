import ErrorHandler from '../utils/Error';

const messageGenerator = (message, success, name) => {

    if (name) {
        let obj = {};
        obj[name] = message;
        obj.success = success;
        return obj;
    }

    return {message, success};

};

const errorGenerator = (message,status) => {
    return new ErrorHandler('CustomError',message,status);
};


export default {messageGenerator,errorGenerator};
