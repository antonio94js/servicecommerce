import Studio from 'studio';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import PublicationService from '../business/PublicationService';
import PublicationMiddleware from '../middleware/PublicationMiddleware';
import {registerMicroservice} from '../handler/StopComponentHandler';

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

    // * getPublicationDetail(publicationData) {
    //
    //     return yield PublicationService.getPublicationDetail(publicationData);
    // }
    //
    // * getPublicationBatch(publicationData) {
    //
    //     return yield PublicationService.getPublicationBatch(publicationData);
    // }


    * getExpandDetail(publicationData) {

        return yield PublicationService.getExpandPublicationDetail(publicationData);
    }

    * getBatch(publicationData) {

        return yield PublicationService.getPublicationBatch(publicationData);
    }

    * getPublicationDetailByOwner(publicationData) {

        return yield PublicationService.getPublicationDetailByOwner(publicationData);
    }

    * getPublicationBatchByOwner(publicationData) {

        return yield PublicationService.getPublicationBatchByOwner(publicationData);
    }


    * checkPublicationStatus(productData) {

        return yield PublicationService.checkPublicationStatus(productData);
    }

    * CheckPublicationOwnership(productData) {

        return yield PublicationService.checkPublicationStatus(productData);
    }

    * changePublicationStatus(publicationData) {
        return yield PublicationService.changePublicationStatus(publicationData);
    }

    CheckOwnership(publicationData) {

        return publicationData.publication;
    }

}

const publicationComponent = Studio.serviceClass(PublicationComponent);

if (process.env.NODE_ENV !== 'test') {
    PublicationMiddleware.CheckPublicationOwnership(publicationComponent, 'deletePublication', 'changePublicationStatus','updatePublication','createPublication','getPublicationDetailByOwner', 'CheckOwnership');
    ErrorLoggerHanlder.setErrorLogger(publicationComponent);
    registerMicroservice(publicationComponent);
}
