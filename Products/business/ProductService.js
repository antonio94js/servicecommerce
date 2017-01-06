import Product from '../models/product';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';

const ImageComponent = Studio.module('ImageComponent');

const createNewProduct = (productData) => {

    return Product
        .create(productData)
        .then((product) => {
            // console.log(product);
            return MessageHandler.messageGenerator(
                "The product was created successfully", true);
        })
        .catch((err) => {
            if (err.code === 11000 || err.code === 11001)
                throw MessageHandler.errorGenerator("The product already exist", 409);

            if (err.name === 'ValidationError')
                throw MessageHandler.errorGenerator("Some fields on the request are invalid", 400);

            throw MessageHandler.errorGenerator("Something wrong happened creating product", 500);
        });
};

const updateProduct = (ProductData) => {

    setData(ProductData, ProductData.product);

    return ProductData.product.save()
        .then((product) => {
            return MessageHandler.messageGenerator(
                "The product was updated successfully", true);
        }).catch((err) => {
            throw MessageHandler.errorGenerator("Something wrong happened updating product", 500);
        });
};

const removeProduct = (ProductData) => {

    const PublicationComponent = Studio.module('PublicationComponent');

    let checkPublicationStatus = PublicationComponent('checkPublicationStatus');

    return new Promise((resolve, reject) => {
        checkPublicationStatus({
                userID: ProductData.product.userID,
                productID: ProductData.product._id
            }).then((value) => {

                if (value) {
                    Product
                        .remove({_id: ProductData._id})
                        .then((response) => {
                                resolve(MessageHandler.messageGenerator("Product deleted succefully",
                                    true));
                            })
                        .catch((err) => {
                            reject(MessageHandler.errorGenerator(
                                "Something wrong happened deleting product", 500));
                        });
                } else
                    resolve(MessageHandler.messageGenerator("Product can not be deleted", false));
            })
            .catch((err) => {
                resolve(MessageHandler.messageGenerator(
                    "Product can not be deleted at the momment, Try again later", false));
            });
    });
};

const getDetail = (ProductData) => {

    let getObjectImage = ImageComponent('getObjectImage');

    return getObjectImage({
            ObjectType: 'product',
            ID: ProductData.product._id,
            userID: ProductData.product.userID
        })
        .then((value) => {
            ProductData.product.SignedURL = value.SignedURL;
            return MessageHandler.messageGenerator(ProductData.product, true, 'data');

        })
        .catch((err) => {
            return MessageHandler.messageGenerator(ProductData.product, true, 'data');
        });
};

const getBatch = (ProductData) => {

    return co.wrap(function*() {

        let ImageBatch = ImageComponent('getBatchImage');
        let products = [];

        /*Check if the operation is for publications batch or just simple listing*/
        if(ProductData.isPublicationBatch) {
            products = yield Product.find({_id:{$in:ProductData.productGuids}}).lean(true).select('-date -__v').populate('offer');
        } else {
            products = yield Product.find({userID: ProductData.userID}).lean(true).select('-__v').populate('offer');
        }
        // console.log(products);

        let data = {
            'guids': _.map(products, product => product._id),
            'ObjectType': 'product'
        };

        return ImageBatch(data)
            .then((images) => {

                for (const product of products) {
                    let img = _.find(images, productImage => productImage.id === product._id);
                    if (img) {
                        product.SignedUrl = img.SignedUrl;
                    }
                }

                return products;

            }).catch((err) => { //If exist an error with the Image Microservice, return the products list without images
                return products;
            });
    })();
};

const assignOffer = (OfferData) => {

    return Product.findByIdAndUpdate(OfferData.productID, {
            $set: {
                offer: OfferData._id
            }
        }).then(
            (product) => {
                return MessageHandler.messageGenerator(
                    "Offer created successfully",
                    true);
            })
        .catch((err) => {
            throw new Error(err);
        });
};


/*HELPERS*/


const productBelongsToUser = (ProductData, property) => {

    let lean = property === 'getProductDetail';

    return Product.findById(ProductData.productID ? ProductData.productID : ProductData._id)
        .lean(lean)
        .populate('offer')
        .where({
            userID: ProductData.userID
        })
        .select('-__v')
        .then((product) => {
            return product;
        })
        .catch((err) => {
            return MessageHandler.messageGenerator('Product not found', false);
        });
};

const setData = (productData, product) => {

    let {productDetail, status, price, quantity, name} = productData;

    product.productDetail = !productDetail ? product.productDetail : productDetail;
    product.status = !status ? product.status : status;
    product.price = !price ? product.price : price;
    product.quantity = !quantity ? product.quantity : quantity;
    product.name = !name ? product.name : name;
};

export default {
    productBelongsToUser,
    setData,
    createNewProduct,
    updateProduct,
    removeProduct,
    getDetail,
    getBatch,
    assignOffer
};
