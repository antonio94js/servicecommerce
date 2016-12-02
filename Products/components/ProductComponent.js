import Studio from 'studio';
import MessageHandler from '../utils/MessageHandler';
import User from '../models/product';


class ProductComponent {

    createProduct(productData) {

        return Product
            .create(productData)
            .then((product) => {
                return MessageHandler.messageGenerator(
                    "Product created succefully", true);
            })
            .catch((err) => {

                throw new Error(err);
            });

    }

    updateProduct(ProductData) {


        return Product.findById(ProductData.id)
            .then((product) => {

                checkFalsy(ProductData, product);

                return product.save();
            }).then((product) => {
                return MessageHandler.messageGenerator(
                    "Product updated succefully", true);
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    deleteProduct(ProductData) {
        return Product.findByIdAndRemove(ProductData.id)
            .then(() => {
                return MessageHandler.messageGenerator(
                    "Product deleted succefully", true);
            })
            .catch((err) => {
                throw new Error('Error deleting product');
            });

    }

}
//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(ProductComponent);

serviceObj.createProduct.retry(3);
serviceObj.updateProduct.retry(3);
