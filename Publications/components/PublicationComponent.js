import Studio from 'studio';
import PublicationService from '../business/PublicationService';
import PublicationMiddelware from '../middelware/PublicationMiddelware';

class PublicationComponent {

    * createPublication(publicationData) {

        return yield PublicationService.createNewPublication(publicationData);
    }

    * updatePublication(publicationData) {
        return yield PublicationService.updatePublication(publicationData);
    }

    * deletePublication(publicationData) {
        return yield PublicationService.removePublication(publicationData);
    }

    * makeComment(commentData) {

        return yield PublicationService.makeNewComment(commentData);
    }


    * getDetail(publicationData) {

        return yield PublicationService.getPublicationDetail(publicationData);
    }

    * checkPublicationStatus(producData) {

        return yield PublicationService.checkPublicationStatus(producData);
    }

    CheckOwnership(publicationData) {

        return true;
    }

}
//return a new instance from your Microservices component
let publication = Studio.serviceClass(PublicationComponent);

PublicationMiddelware.CheckPublicationOwnership(publication, 'deletePublication', 'updatePublication',
    'createPublication', 'CheckOwnership');
