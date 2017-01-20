import Product from '../models/product';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';
import _ from 'lodash';
import Promise from 'bluebird';

const ImageComponent = Studio.module('ImageComponent');

class ProductService {

    createNewProduct(productData) {

        return Product
            .create(productData)
            .then((product) => {

                return MessageHandler.messageGenerator("The product was created successfully", true);

            })
            .catch((err) => {
                if (err.code === 11000 || err.code === 11001)
                    throw MessageHandler.errorGenerator("The product already exist", 409);

                if (err.name === 'ValidationError')
                    throw MessageHandler.errorGenerator("Some fields on the request are invalid", 400);

                throw MessageHandler.errorGenerator("Something wrong happened creating product", 500);
            });
    }

    updateProduct(productData) {
        setData(productData, productData.product);

        return productData.product.save()
            .then((product) => {
                return MessageHandler.messageGenerator(
                    "The product was updated successfully", true);
            }).catch((err) => {
                throw MessageHandler.errorGenerator("Something wrong happened updating product", 500);
            });
    }

    removeProduct(productData) {
        const PublicationComponent = Studio.module('PublicationComponent');

        let checkPublicationStatus = PublicationComponent('checkPublicationStatus');

        return new Promise((resolve, reject) => {
            checkPublicationStatus({
                    userID: productData.product.userID,
                    productID: productData.product._id
                }).then((value) => {

                    if (value) {
                        Product
                            .remove({
                                _id: productData._id
                            })
                            .then((response) => {
                                resolve(MessageHandler.messageGenerator("Product deleted succefully",
                                    true));
                            })
                            .catch((err) => {
                                reject(MessageHandler.errorGenerator(
                                    "Something wrong happened deleting product", 500));
                            });
                    } else
                        resolve(MessageHandler.messageGenerator("Product can not be deleted, because is currently in an active publication", false));
                })
                .catch((err) => {
                    resolve(MessageHandler.messageGenerator(
                        "Product can not be deleted at the momment, Try again later", false));
                });
        });
    }

    getDetail(productData) {
        let getObjectImage = ImageComponent('getObjectImage');

        return getObjectImage({
                ObjectType: 'product',
                ID: productData.product._id,
                userID: productData.product.userID
            })
            .then((value) => {
                productData.product.SignedURL = value.SignedURL;
                return productData.product;

            })
            .catch((err) => {
                return productData.product;
            });
    }

    async getBatch(productData) {
        let ImageBatch = ImageComponent('getBatchImage');
        let products = [];

        /*Check if the operation is for publications batch or just simple listing*/
        if(productData.isPublicationBatch) {
            products = await Product.find({_id:{$in:productData.productGuids}}).lean(true).select('-date -__v -productDetail -quantity -name').populate('offer');
        } else {
            products = await Product.find({userID: productData.userID}).lean(true).select('-__v').populate('offer');
        }

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
    }

    async assignOffer(OfferData) {
        return await Product.findByIdAndUpdate(OfferData.productID, {$set: {offer: OfferData._id}});
    }

    productBelongsToUser (productData, property) {
        let lean = property === 'getProductDetail';

        return Product.findById(productData.productID ? productData.productID : productData._id)
            .lean(lean)
            .populate('offer')
            .where({
                userID: productData.userID
            })
            .select('-__v')
            .then((product) => {
                return product;
            })
            .catch((err) => {
                return MessageHandler.messageGenerator('Product not found', false);
            });
    }

}

/*HELPERS*/

const setData = (productData, product) => {

    let {productDetail, status, price, quantity, name} = productData;

    product.productDetail = !productDetail ? product.productDetail : productDetail;
    product.status = !status ? product.status : status;
    product.price = !price ? product.price : price;
    product.quantity = !quantity ? product.quantity : quantity;
    product.name = !name ? product.name : name;
};

const productService = new ProductService();

export default productService;
