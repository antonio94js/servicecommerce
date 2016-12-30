import Studio from 'studio';
import CommentService from '../business/CommentService';


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

Studio.serviceClass(CommentComponent);
