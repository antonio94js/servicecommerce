const removeNativeID = (...objects) => {
    for (const object of objects) {
        if(object) delete object._id;
    }
};

const getRandomPort = () => Math.floor(Math.random()*(10200-8081+1)+8081);

export default {
    removeNativeID,
    getRandomPort
}
