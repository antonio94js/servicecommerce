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

    * getBatch(publicationData) {

        return yield PublicationService.getPublicationBatch(publicationData);
    }

    * checkPublicationStatus(productData) {

        return yield PublicationService.checkPublicationStatus(productData);
    }

    CheckOwnership(publicationData) {

        return true;
    }

}

let publication = Studio.serviceClass(PublicationComponent);

if (process.env.NODE_ENV !== 'test') {
    PublicationMiddelware.CheckPublicationOwnership(publication, 'deletePublication', 'updatePublication',
        'createPublication', 'CheckOwnership');
}
