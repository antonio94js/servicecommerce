import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';
const ProductComponent = Studio.module('ProductComponent'); //Fetching the Product Microservice

const createProduct = (req, res, next) => {
    let createProduct = ProductComponent('createProduct');
    req.body.userID = req.user.id;

    createProduct(req.body)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });
};

const productUpdate = (req, res, next) => {
    let updateProduct = ProductComponent('updateProduct');
    req.body.userID = req.user.id;
    updateProduct(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const productDelete = (req, res, next) => {
    let deleteProduct = ProductComponent('deleteProduct');
    req.body.userID = req.user.id;
    deleteProduct(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const productDetail = (req, res, next) => {
    let getProductDetail = ProductComponent('getProductDetail');
    req.body.userID = req.user.id;
    req.body._id = req.query.id;
    getProductDetail(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const productBatch  = (req, res, next) => {
    let getProductBatch = ProductComponent('getProductBatch');
    req.body.userID = req.user.id;

    getProductBatch(req.body)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });
};

export default {
    createProduct, productUpdate, productDelete, productDetail, productBatch
};
