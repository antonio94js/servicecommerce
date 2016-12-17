const messageGenerator = (message, success, name) => {

    if (name) {
        let obj = {};
        obj[name] = message;
        obj.success = success;
        return obj;
    }


    return {
        message, success
    };

};

export default {
    messageGenerator
};
