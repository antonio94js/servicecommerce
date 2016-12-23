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



}
//return a new instance from your Microservices component
Studio.serviceClass(PublicationComponent);
