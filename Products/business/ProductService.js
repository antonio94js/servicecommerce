import Product from '../models/product';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
const ImageComponent = Studio.module('ImageComponent');

const productBelongsToUser = (ProductData) => {
    return Product.findById(ProductData.idproduct ? ProductData.idproduct : ProductData._id)
        // .lean()
        .populate('offer')
        .where({ iduser: ProductData.iduser })
        .then((product) => {
            return product;
        })
        .catch((err) => {
            return MessageHandler.messageGenerator('Product not found',false);
        });
};

const setData = (productData, product) => {
    let { productdetail, status, price, quantity, name } = productData;
    product.productdetail = !productdetail ? product.productdetail : productdetail;
    product.status = !status ? product.status : status;
    product.price = !price ? product.price : price;
    product.quantity = !quantity ? product.quantity : quantity;
    product.name = !name ? product.name : name;
};

const store = (productData) => {

        return Product
            .create(productData)
            .then((product) => {
                return MessageHandler.messageGenerator(
                    "The product was created successfully", true);
            })
            .catch((err) => {
                if (err.code === 11000 || err.code === 11001)
                    return MessageHandler.errorGenerator("The product already exist", 409);

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
        return Product.remove({_id : ProductData._id}).then(
            () => {
                return MessageHandler.messageGenerator("Product deleted succefully", true);
            })
            .catch((err) => {
                return MessageHandler.errorGenerator("Something wrong happened deleting product", 500);
            });
    };

const getDetail = (ProductData) => {

    let getObjectImage = ImageComponent('getObjectImage');

   return getObjectImage({
           ObjectType: 'product',
           ID: ProductData.product._id,
           userid:ProductData.product.iduser
       })
       .then((value) => {
           ProductData.product.SignedURL = value.SignedURL;
           return MessageHandler.messageGenerator(ProductData.product, true, 'data');

       })
       .catch((err) => {
           console.log(err);
           console.log("reject");
           return MessageHandler.messageGenerator(ProductData.product, true, 'data');
       });
};

const getBatch = (ProductData) => {

   return Product.find({ iduser : ProductData.iduser })
      .then((products) => {
         return MessageHandler.messageGenerator(products, true, 'data');
      }).catch((err) => {
         return MessageHandler.errorGenerator("Something wrong happened getting product batch", 500);
      });
};

const assignOffer = (OfferData) => {

   return Product.findByIdAndUpdate(OfferData.idproduct, { $set: { offer: OfferData._id }}).then(
       (product) => {
           return MessageHandler.messageGenerator(
               "Offer created successfully",
               true);
       })
       .catch((err) => {
           throw new Error(err);
       });
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
