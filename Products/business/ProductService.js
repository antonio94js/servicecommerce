import Product from '../models/product';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';

const ImageComponent = Studio.module('ImageComponent');
const PublicationComponent = Studio.module('PublicationComponent');

const store = (productData) => {

    return Product
        .create(productData)
        .then((product) => {
            return MessageHandler.messageGenerator(
                "The product was created successfully", true);
        })
        .catch((err) => {
            console.log(err);
            if (err.code === 11000 || err.code === 11001)
                return MessageHandler.errorGenerator("The product already exist", 409);
            if(err.name === 'ValidationError')
                return MessageHandler.errorGenerator("Some fields on the request are invalid", 400);
            return MessageHandler.errorGenerator("Something wrong happened creating product", 500);
        });
};

const update = (ProductData) => {
    setData(ProductData, ProductData.product);

    return ProductData.product.save()
        .then((product) => {
            return MessageHandler.messageGenerator(
                "The product was updated successfully", true);
        }).catch((err) => {
            return MessageHandler.errorGenerator("Something wrong happened updating product", 500);
        });
};

const remove = (ProductData) => {

    let checkPublicationStatus = PublicationComponent('checkPublicationStatus');

    return new Promise((resolve, reject) => {
        checkPublicationStatus({
                    userID: ProductData.product.userID,
                    productID : ProductData.product._id
                }).then((value) => {
                    if(value){
                        Product.remove({
                                _id: ProductData._id
                            }).then(
                                () => {
                                    resolve(MessageHandler.messageGenerator("Product deleted succefully", true));
                                })
                            .catch((err) => {
                                reject(MessageHandler.errorGenerator("Something wrong happened deleting product", 500));
                            });
                    }else
                        resolve(MessageHandler.messageGenerator("Product can not be deleted", false));
                })
                .catch((err) => {
                    resolve(MessageHandler.messageGenerator("Product can not be deleted at the momment, Try again later", false));
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

        let products = yield Product.find({
            userID: ProductData.userID
        }).lean(true).populate('offer');

        let data = {
            'guids': _.map(products, product => product._id),
            'ObjectType': 'product'
        };
        return ImageBatch(data).then((images) => {
            console.log(images);
            console.log('hola');
            for (const product of products) {
                let img = _.find(images, image => image.id === product._id);
                // console.log(img);
                if (img) {
                    product.SignedUrl = img.SignedUrl;
                }
            }

            return products;

        }).catch((err) => {
            console.log(err);
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
            console.log(product);
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
    store,
    update,
    remove,
    getDetail,
    getBatch,
    assignOffer
};
