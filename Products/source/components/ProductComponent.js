import Studio from 'studio';
import ProductService from '../business/ProductService';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
import ProductMiddleware from '../middleware/ProductMiddleware';
import {registerMicroservice} from '../handler/StopComponentHandler';

class ProductComponent {

    *createProduct(productData){
        return yield ProductService.createNewProduct(productData);
    }

    *updateProduct(ProductData) {
        return yield ProductService.updateProduct(ProductData);
    }

    *deleteProduct(ProductData) {
        return yield ProductService.removeProduct(ProductData);
    }

    *getProductDetail(ProductData) {
        return yield ProductService.getDetail(ProductData);
    }

    *getProductBatch(ProductData) {
        return yield ProductService.getBatch(ProductData);
    }

    *assignOffer(OfferData) {
        return yield ProductService.assignOffer(ProductData);
    }

    *removeFromStock(ProductData) {
        return yield ProductService.removeFromStock(ProductData);
    }

    checkOwnership(productData) {
        return true;
    }
}

//return a new instance from your Microservices component
const productComponent = Studio.serviceClass(ProductComponent);
ErrorLoggerHanlder.setErrorLogger(productComponent)
ProductMiddleware.CheckProductOwnership(productComponent, 'updateProduct', 'deleteProduct', 'getProductDetail', 'checkOwnership');
registerMicroservice(productComponent);
