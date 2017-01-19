import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const CommentComponent = Studio.module('CommentComponent'); //Fetching the Comment Microservice

class CommentController {

    publicationCreateResponse(req, res, next) {
        const createCommentResponse = CommentComponent('createCommentResponse');
        req.body.userID = req.user.id;

        createCommentResponse(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    publicationCreateComment(req, res, next) {
        const createComment = CommentComponent('createComment');
        req.body.userID = req.user.id;

        createComment(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    publicationDeleteComment(req, res, next) {
        const deleteComment = CommentComponent('deleteComment');
        req.body.userID = req.user.id;

        deleteComment(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }
}


const commentController = new CommentController();

export default commentController
