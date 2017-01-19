import Studio from 'studio';
import _ from 'lodash';
import ErrorHandler from '../handler/ErrorHandler';
import PublicationService from '../services/PublicationService';
import ProductService from '../services/ProductService';

const PublicationComponent = Studio.module('PublicationComponent'); //Fetching the Publication Microservice
const ProductComponent = Studio.module('ProductComponent'); //Fetching the Product Microservice
const UserComponent = Studio.module('UserComponent'); //Fetching the User Microservice
const CommentComponent = Studio.module('CommentComponent'); //Fetching the Comment Microservice


class PublicationController {

    publicationCreate(req, res, next) {
        const createPublication = PublicationComponent('createPublication');
        req.body.userID = req.user.id;

        createPublication(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    publicationUpdate(req, res, next) {
        const updatePublication = PublicationComponent('updatePublication');
        req.body.userID = req.user.id;

        updatePublication(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    publicationDelete(req, res, next) {
        const deletePublication = PublicationComponent('deletePublication');
        req.body.userID = req.user.id;

        deletePublication(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    publicationDetail(req, res, next) {
        const getDetail = PublicationComponent('getDetail');
        const getProductDetail = ProductComponent('getProductDetail');
        const getUserInfo = UserComponent('getUserInfo');

        const publicationData = {
            _id: req.params.publicationID
        }
        let publicationDetail = {};

        getDetail(publicationData)
            .then((publication) => {

                publicationDetail.publication = publication;
                let product = {
                    productID: publication.productID,
                    userID: publication.userID
                }

                return getProductDetail(product)
            })
            .then((product) => {

                delete product.userID
                publicationDetail.publication.product = product;
                let user = {
                    id: publicationDetail.publication.userID
                };

                delete publicationDetail.publication.userID

                ProductService.setOffer(publicationDetail.publication.product)

                return getUserInfo(user)
                    .then(user => user)
                    .catch(userError => null)
            })
            .then((user) => {
                publicationDetail.publication.user = user;
                res.status(200).json(publicationDetail);
            })
            .catch(err => ErrorHandler(err, res, req, next));

    }

    publicationBatch(req, res, next) {
        const getBatch = PublicationComponent('getBatch');
        const getProductBatch = ProductComponent('getProductBatch');
        const getUserBatch = UserComponent('getUserBatch');

        let publicationData = {
            queryText: req.query.queryText
        }
        let publicationsInfo = [];

        getBatch(publicationData)
            .then((publications) => {

                let productData = {
                    isPublicationBatch: true,
                    productGuids: _.map(publications, publication => publication.productID)
                }

                publicationsInfo.push(publications);

                return getProductBatch(productData)
            })
            .then((products) => {

                let userData = {
                    userGuids: _.map(products, product => product.userID)
                };

                publicationsInfo.push(products);

                return getUserBatch(userData)
                    .then(users => publicationsInfo.push(users))
                    .catch(userError => publicationsInfo.push(null))
            })
            .then(() => {
                const publicationsBatch = PublicationService.joinPublicationData(...publicationsInfo);
                res.status(200).json(publicationsBatch);
            })
            .catch(err => ErrorHandler(err, res, req, next));
    }

}

const publicationController =  new PublicationController();

export default publicationController;
