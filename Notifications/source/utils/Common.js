const getRandomPort = () => Math.floor(Math.random() * (10200 - 8081 + 1) + 8081);

const sanitizeQuery = query => query.replace(/[^\w\sÁÉÍÓÚáéíúóñÑ]/g,'').replace(/\s\s+/g, ' ').trim();

const generateID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export default {getRandomPort,generateID,sanitizeQuery};
