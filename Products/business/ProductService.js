import Product from '../models/product';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
const ImageComponent = Studio.module('ImageComponent');

const productBelongsToUser = (ProductData, property) => {
   let lean = property === 'getProductDetail';
   return Product.findById(ProductData.idproduct ? ProductData.idproduct : ProductData._id)
   .lean(lean)
   .populate('offer')
   .where({ iduser: ProductData.iduser })
   .select('-__v')
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
         // console.log(err);
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
               return MessageHandler.messageGenerator(ProductData.product, true, 'data');
            });
         };

         const getBatch = (ProductData) => {
            return co.wrap(function*() {
               let products = yield Product.find({ iduser : ProductData.iduser });

               console.log(products);

            });

            //todo, send array of ids to imagecomponent getbatchimages, to retrieve images and set them to the batch
            // ImageComponent.getbatchimages()
            //
            // {
            // "guids":["5d6ff76c-a1d9-47ea-a89d-1959b702859c",
            //          "d72a2f54-b7b4-4e61-beb1-8cb7c74aceee",
            //          "5ba01a4a-d140-4853-b927-254e9df5813e",
            //          "asdfsdfasdfasdfasdfasdfasdfasd"
            //          ]
            // }
            //
            // And it will return
            //
            //[
            //  {
            //    "id": "5d6ff76c-a1d9-47ea-a89d-1959b702859c",
            //    "SignedUrl": "https://servicecommerce.s3.amazonaws.com/product/75d9edb2e5fd30508d4de879d7af46f805e7dc60ee9abf785bf4f1a5ae4cf19573e45d00?AWSAccessKeyId=AKIAJSLKMUJD7YD3FMDA&Expires=1481988468&Signature=5hhRVGj0MV%2BCWtk5vtvVuG4d8E8%3D  (50KB) "
            //  },
            //  {
            //    "id": "d72a2f54-b7b4-4e61-beb1-8cb7c74aceee",
            //    "SignedUrl": "https://servicecommerce.s3.amazonaws.com/product/248ae9b5b1ac33078d4eee7fdaaf46aa56b7dc63b3c1ea7852aea6abaf4cf5c628b40106?AWSAccessKeyId=AKIAJSLKMUJD7YD3FMDA&Expires=1481988469&Signature=aOEwHwq8%2BOEhW2cWA4QUIuqR0pU%3D  (49KB) "
            //  },
            //  {
            //    "id": "5ba01a4a-d140-4853-b927-254e9df5813e",
            //    "SignedUrl": "https://servicecommerce.s3.amazonaws.com/product/75dfbae4b2ab32528d48e829deaf46f755b5dc63ef91ec7858f8f0f9f51fa79273e05706?AWSAccessKeyId=AKIAJSLKMUJD7YD3FMDA&Expires=1481988469&Signature=odDn7PWFy2C4kJx0eMl1Sjwj%2FqI%3D (8KB) "
            //  }
            // ]

            return Product.find({ iduser : ProductData.iduser }).populate('offer').select('-__v')
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
