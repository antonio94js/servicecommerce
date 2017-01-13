import PublicationService from '../business/PublicationService';
import MessageHandler from '../handler/MessageHandler';
import studio from 'studio';

const ProductComponent = studio.module('ProductComponent'); //Fetching the Product Microservice

const CheckPublicationOwnership = (Component, ...properties) => {

    for (let property in Component) {
        if (Component.hasOwnProperty(property) && typeof Component[property] === 'function') {
            // Component[property].timeout(1);
            if (property === 'createPublication')
                _checkProductOwnership(Component, property);
            else if (properties.includes(property))
                _checkUserOwnership(Component, property);
        }
    }

};

const _checkProductOwnership = (Component, property) => {

    Component[property].filter((data) => {

        let checkOwnership = ProductComponent('checkOwnership');

        return checkOwnership({ // return a promise
                productID: data.productID,
                userID: data.userID
            })
            .then((value) => {
                return true;
            }).catch((err) => {
                if (err.statusCode === 400)
                    throw err;
                else {
                    throw MessageHandler.errorGenerator("Actually this service is not enabled", 500);
                }
            });
    });
};


const _checkUserOwnership = (Component, property) => {

    Component[property].filter((data) => {

        return PublicationService
            .publicationBelongsToUser(data, property)
            .then((publication) => {
                if (publication) {
                    data.publication = publication;
                    return true;
                }
                throw MessageHandler.errorGenerator('This publication do not belong to you', 400);
            });
    });
};

export default {
    CheckPublicationOwnership
};
