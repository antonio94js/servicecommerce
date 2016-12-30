import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const PublicationComponent = Studio.module('PublicationComponent'); //Fetching the Publication Microservice
const ProductComponent = Studio.module('ProductComponent'); //Fetching the Product Microservice
const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
const CommentComponent = Studio.module('CommentComponent'); //Fetching the Comment Microservice


const publicationCreate = (req, res, next) => {

    let createPublication = PublicationComponent('createPublication');
    req.body.userID = req.user.id;

    createPublication(req.body)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
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
        });
};

const publicationDetail = (req, res, next) => {

    let getDetail = PublicationComponent('getDetail');
    let getProductDetail = ProductComponent('getProductDetail');
    let getUserProfile = UserComponent('getUserProfile');
    let publicationData = {
        '_id': req.params.publicationID
    }
    let publicationDetail = {};

    getDetail(publicationData)
        .then((publication) => {

            publicationDetail.publication = publication;
            let product = {
                'productID': publication.productID,
                'userID': publication.userID

            }

            return getProductDetail(product)
        })
        .then((product) => {
            publicationDetail.publication.product = product.data;
            let user = {
                'id': publicationDetail.publication.userID
            };

            return getUserProfile(user)
        })
        .then((user) => {
            publicationDetail.publication.user = user;
            res.status(200).json(publicationDetail);
        })
        .catch((err) => {
            console.log(err);
            ErrorHandler(err, res, next);
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


export default {
    publicationCreate, publicationDelete, publicationCreateResponse, publicationUpdate, publicationCreateComment,
    publicationDeleteComment, publicationDetail
}
