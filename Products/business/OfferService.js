import Offer from '../models/offer';
import ProductService from '../business/ProductService';
import Studio from 'studio';
import MessageHandler from '../handler/MessageHandler';
import co from 'co';

const store = (offerData) => {
   return co.wrap(function*() {
      let product = yield ProductService.productBelongsToUser(offerData);

      if(product){
         let x = yield Offer.create(offerData);
         return yield ProductService.assignOffer(offerData);
      }
      return MessageHandler.messageGenerator('Product not found',false);

   })();

};

const update = (offerData) => {
   return co.wrap(function*() {

      let product = yield ProductService.productBelongsToUser(offerData);

      if(product){

         let offer = yield Offer.findById(offerData._id);

         if (offer){
            offer.start_date = offerData.start_date;
            offer.end_date = offerData.price;
            offer.price = offerData.price;

            return offer.save()
            .then((offer) =>{
               return MessageHandler.messageGenerator('Offer updated successfully',true);
            }).catch((err) => {
               return MessageHandler.errorGenerator("Something wrong happened updating offer", 500);
            });
         }

         return MessageHandler.messageGenerator('Offer not found',false);

      }
      return MessageHandler.messageGenerator('Product not found',false);

   })();
};

const remove = (offerData) => {
   return co.wrap(function*() {

      let product = yield ProductService.productBelongsToUser(offerData);
      if (product && product.offer._id)
         return Offer.remove({ _id : product.offer._id })
         .then(() =>{
            return MessageHandler.messageGenerator('Offer deleted successfully',true);
         }).catch((err) => {
            return MessageHandler.errorGenerator("Something wrong happened deleting offer", 500);
         });

      return MessageHandler.messageGenerator("Product not found in yours", false);
   })();
};


export default {
   store, update, remove
};
