import Studio from 'studio';
import CommentService from '../business/CommentService';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';


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

const commentService = Studio.serviceClass(CommentComponent);


if (process.env.NODE_ENV !== 'test') {
    ErrorLoggerHanlder.setErrorLogger(commentService);
    //code
}
