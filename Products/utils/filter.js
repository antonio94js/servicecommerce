import ProductService from '../business/ProductService';
import MessageHandler from '../handler/MessageHandler';

const CheckProductOwnership = (Component,...properties) => {
    for (let property in Component) {
        if (Component.hasOwnProperty(property) && typeof Component[property] === 'function') {
            if(properties.includes(property)){
                _setfilter(Component, property);
            }
        }
    }
};

const _setfilter = (Component, property) => {
    // console.log(property);
    Component[property].filter((data) => {
        return ProductService.productBelongsToUser(data, property).then((obj) => {
            if (obj){
                data.product = obj;
                return true;
            }
            return MessageHandler.errorGenerator('This product do not belong to you',400);
        });
        // return true;
    });
};

export default { CheckProductOwnership };
