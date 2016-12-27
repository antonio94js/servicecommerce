import Studio from 'studio';
import ProductService from '../business/ProductService';
import Check from '../utils/filter';

class ProductComponent {

    *createProduct(productData){
        return yield ProductService.store(productData);
    }

    *updateProduct(ProductData) {
        return yield ProductService.update(ProductData);
    }

    *deleteProduct(ProductData) {
        return yield ProductService.remove(ProductData);
    }

    *getproductDetail(ProductData) {
        return yield ProductService.getDetail(ProductData);
    }

    *getProductBatch(ProductData) {
        return yield ProductService.getBatch(ProductData);
    }

    *assignOffer(OfferData) {
        return yield ProductService.assignOffer(ProductData);
    }

    checkOwnership(productData) {
        return true;
    }
}

//return a new instance from your Microservices component
var serviceObj = Studio.serviceClass(ProductComponent);

Check.CheckProductOwnership(serviceObj, 'updateProduct', 'deleteProduct', 'getproductDetail', 'checkOwnership');
