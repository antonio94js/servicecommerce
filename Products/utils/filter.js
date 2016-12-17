import ProductService from '../business/ProductService';

const CheckProductOwnership = (Component,...properties) => {
    for (let property in Component) {
        if (Component.hasOwnProperty(property) && typeof Component[property] === 'function') {
            if(properties.includes(property)){
                _setfilter(Component, property);
            }
        }
    }
};

const CheckProductOwnershipall = (Component) => {
    for (let property in Component) {
        if (Component.hasOwnProperty(property) && typeof Component[property] === 'function') {
            _setfilter(Component, property);
        }
    }
};

const _setfilter = (Component, property) => {
    // console.log(property);
    Component[property].filter((data) => {
        return ProductService.productBelongsToUser(data).then((obj) => {
            if (obj){
                data.product = obj;
                return true;
            }
            throw new Error('Ownership, not verefied');
        });
        // return true;
    });
};

export default { CheckProductOwnership, CheckProductOwnershipall };
