import PublicationService from '../business/PublicationService';
import MessageHandler from '../handler/MessageHandler';

const CheckPublicationOwnership = (Component, ...properties) => {
    for (let property in Component) {
        if (Component.hasOwnProperty(property) && typeof Component[property] === 'function') {
            if (properties.includes(property)) {
                _setMiddelware(Component, property);
            }
        }
    }
};

const _setMiddelware = (Component, property) => {
    // console.log(property);
    Component[property].filter((data) => {
        return PublicationService.publicationBelongsToUser(data, property)
            .then((publication) => {
                if (publication) {
                    return true;
                }
                throw MessageHandler.errorGenerator('This publication do not belong to you', 400);
            });
        // return true;
    });
};

export default {
    CheckPublicationOwnership
};
