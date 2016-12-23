import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import PublicationService from '../business/PublicationService';

// import './WishlistComponent';


// const WishlistComponent = Studio.module('WishlistComponent');

// const ImageComponent = Studio.module('ImageComponent');


class PublicationComponent {

    *createPublication(publicationData) {

        return yield PublicationService.createNewPublication(publicationData);
    }

    *updatePublication(publicationData) {
        return yield PublicationService.updatePublication(PublicationData);
    }

    *deletePublication(publicationData) {
        return yield PublicationService.remove(PublicationData);
    }


}
//return a new instance from your Microservices component
Studio.serviceClass(PublicationComponent);
