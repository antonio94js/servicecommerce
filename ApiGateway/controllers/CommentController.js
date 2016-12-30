import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const CommentComponent = Studio.module('CommentComponent'); //Fetching the Comment Microservice

const publicationCreateResponse = (req, res, next) => {

    let createCommentResponse = CommentComponent('createCommentResponse');
    req.body.userID = req.user.id;

    createCommentResponse(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

const publicationCreateComment = (req, res, next) => {

    let createComment = CommentComponent('createComment');
    req.body.userID = req.user.id;

    createComment(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

const publicationDeleteComment = (req, res, next) => {

    let deleteComment = CommentComponent('deleteComment');
    req.body.userID = req.user.id;

    deleteComment(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

export default {publicationCreateResponse, publicationCreateComment,publicationDeleteComment}
