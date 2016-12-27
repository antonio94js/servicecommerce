import Studio from 'studio';
// import jwtHandler from '../services/TokenService';
import ErrorHandler from '../handler/ErrorHandler';


const PublicationComponent = Studio.module('PublicationComponent'); //Fetching the Publication Microservice
const CommentComponent = Studio.module('CommentComponent');

const publicationCreate = (req, res, next) => {

    let createPublication = PublicationComponent('createPublication');
    req.body.userID = req.user.id;

    createPublication(req.body)
    .then((response) => {
        res.status(201).json(response);
    })
    .catch((err) => {
        ErrorHandler(err, res, next);
        // res.status(500).json(err);
    });

};

const publicationUpdate = (req, res, next) => {

    let updatePublication = PublicationComponent('updatePublication');
    req.body.userID = req.user.id;
    updatePublication(req.body)
    .then((response) => {
        res.status(200).json(response);
    })
    .catch((err) => {
        ErrorHandler(err, res, next);
        // res.status(500).json(err);
    });
};

const publicationDelete = (req, res, next) => {

    let deletePublication = PublicationComponent('deletePublication');
    req.body.userID = req.user.id;

    deletePublication(req.body)

    .then((response) => {
        res.status(200).json(response);
    })
    .catch((err) => {
        ErrorHandler(err, res, next);
        // res.status(500).json(err);
    });
};

const publicationDetail = (req, res, next) => {

    let getDetail = PublicationComponent('getDetail');
    let publicationData = {
        '_id': req.params.publicationID
    }
    console.log(publicationData);
    getDetail(publicationData)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const publicationCreateResponse = (req, res, next) => {

    let createCommentResponse = CommentComponent('createCommentResponse');
    req.body.userID = req.user.id;

    createCommentResponse(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const publicationCreateComment = (req, res, next) => {

    let createComment = CommentComponent('createComment');
    req.body.userID = req.user.id;
    // console.log(req.body);
    createComment(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
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
            // res.status(500).json(err);
        })

};


export default {
    publicationCreate, publicationDelete, publicationCreateResponse,publicationUpdate, publicationCreateComment, publicationDeleteComment,publicationDetail
}
