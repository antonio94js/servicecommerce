import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const ProductComponent = Studio.module('ProductComponent'); //Fetching the Product Microservice

class ProductController {

    createProduct(req, res, next) {
        const createProduct = ProductComponent('createProduct');
        req.body.userID = req.user.id;

        createProduct(req.body)
            .then(response => res.status(201).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    productUpdate(req, res, next) {
        const updateProduct = ProductComponent('updateProduct');
        req.body.userID = req.user.id;

        updateProduct(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    productDelete(req, res, next) {
        const deleteProduct = ProductComponent('deleteProduct');
        req.body.userID = req.user.id;

        deleteProduct(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    productDetail(req, res, next) {
        const getProductDetail = ProductComponent('getProductDetail');
        req.body.userID = req.user.id;
        req.body._id = req.query.id;

        getProductDetail(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

    productBatch(req, res, next) {
        const getProductBatch = ProductComponent('getProductBatch');
        req.body.userID = req.user.id;

        getProductBatch(req.body)
            .then(response => res.status(200).json(response))
            .catch(err => ErrorHandler(err, res, req, next));
    }

}

const productController = new ProductController();

export default productController;
