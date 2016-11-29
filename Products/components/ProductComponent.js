import studio from 'studio';
import Product from '../models/product';
import MessageHandler from '../utils/MessageHandle';


class ProductComponent {

    CreateProduct(ProductData) {
        return Product
            .create(ProductData)
            .exec(function(err, product) {
                if (err) {
                    throw new Error(err);
                } else {
                    return MessageHandler.MessageGenerator(
                        'The product was created successfully',
                        true);
                }
            });
    }

    UpdateProduct(ProductData) {

        var product = Product
            .findById(ProductData.id)
            .exec(function(err, product) {
                if (err) {
                    throw new Error(err);
                } else {
                    return product;
                }
            });


    }



}
