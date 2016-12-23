import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import PublicationService from '../business/PublicationService';
import PublicationMiddelware from '../middelware/PublicationMiddelware';

// import './WishlistComponent';


// const WishlistComponent = Studio.module('WishlistComponent');

// const ImageComponent = Studio.module('ImageComponent');


class PublicationComponent {

    *createPublication(publicationData) {

        return yield PublicationService.createNewPublication(publicationData);
    }

    *deletePublication(publicationData) {

        return yield PublicationService.removePublication(publicationData);
    }



}
//return a new instance from your Microservices component
let publication = Studio.serviceClass(PublicationComponent);

PublicationMiddelware.CheckPublicationOwnership(publication,'deletePublication')
