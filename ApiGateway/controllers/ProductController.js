import Studio from 'studio';

const ProductComponent = Studio.module('ProductComponent'); //Fetching the Product Microservice

const createProduct = (req, res) => {
    let createProduct = ProductComponent('createProduct');

    req.body.iduser = req.user.id;
    createProduct(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        });


};

const productUpdate = (req, res) => {
    let updateProduct = ProductComponent('updateProduct');

    updateProduct(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        });

};

const productDelete = (req, res) => {
    let deleteProduct = ProductComponent('deleteProduct');

    deleteProduct(req.body)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        });

};

export default {createProduct,productUpdate,productDelete};
