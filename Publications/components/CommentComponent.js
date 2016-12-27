import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import CommentService from '../business/CommentService';
import PublicationMiddelware from '../middelware/PublicationMiddelware';

// import './WishlistComponent';


// const WishlistComponent = Studio.module('WishlistComponent');

// const ImageComponent = Studio.module('ImageComponent');


class CommentComponent {

    *createComment(commentData) {

        return yield CommentService.createNewComment(commentData);
    }

    *createCommentResponse(commentData) {

        return yield CommentService.createNewResponse(commentData);
    }

    *deleteComment(commentData) {

        return yield CommentService.removeComment(commentData);
    }



}
//return a new instance from your Microservices component
Studio.serviceClass(CommentComponent);

// PublicationMiddelware.CheckPublicationOwnership(publication,'deletePublication')
