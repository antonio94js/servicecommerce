const getRandomPort = () => Math.floor(Math.random() * (10200 - 8081 + 1) +  8081);

const dateValidate = (...dates) => {
    for( const date of dates){
        if(!isNaN(Date.parse(date))) return false;
    }
    return true;
};

export default { getRandomPort, dateValidate };
