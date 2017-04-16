const removeNativeID = (...objects) => {
    for (const object of objects) {
        if(object) delete object._id;
    }
};

const getRandomPort = () => Math.floor(Math.random()*(10200-8081+1)+8081);

const generateID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export default {
    removeNativeID,
    getRandomPort,
    generateID
}
