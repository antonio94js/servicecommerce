import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

import ProductService from '../business/ProductService';
import Product from '../models/product';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {ProductMock} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';



chai.use(SinonChai);

let sandboxProduct;

beforeEach(() => {
    sandboxProduct = sinon.sandbox.create();


});

afterEach(() => {
    sandboxProduct.restore();

});


describe('#ProductService', () => {

    describe('#CreateProduct', () => {
        var productData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        beforeEach(() => {

            productData = {
                "_id": "5erfefa-c427-4894-832c-ee1e8c714b80",
                "productDetail": "Here should be a detail",
                "status":"New",
                "price": 40,
                "quantity": 5,
                "name": "MackBook Pro"
            };

        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve ', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.resolver(ProductMock));

            ProductService.createNewProduct(productData)
            .then(function(response) {
                expect(response.success).to.be.true;
            });

        });

        it('Should get status 409 when the promise its rejected by duplicated product', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.rejecter(MongoMocks.DuplicatedError));

            ProductService.createNewProduct(productData)
            .then((response) => {

            }).catch((err) => {
                // console.log(err);
                expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("The product already exist", 409);
                // expect(MessageHandler.errorGenerator.calledWithExactly("The Product already exist", 409)).to.be.true;
                expect(err.statusCode).to.be.equals(409);
                expect(err.name).to.be.equals('CustomError');
            });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));

            ProductService.createNewProduct(productData)
            .then((response) => {

            }).catch((err) => {
                // console.log(err);
                expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating product", 500);
                expect(err.statusCode).to.be.equals(500);
            });

        });

    });

    describe('#updateProduct', () => {
        var ProductData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            ProductData = {
                "_id": "5erfefa-c427-4894-832c-ee1e8c714b80",
                "productDetail": "Here should be a detail",
                "status": "New",
                "price": 40,
                "quantity": 6,
                "name": "MackBook Pro XXX",
                "userID": "2697bd30-1fbd-4d79-8cc5-26e052141f35",
                "product":
                        { "_id": "5erfefa-c427-4894-832c-ee1e8c714b80",
                        "productDetail": "Here should be a detail",
                        "status": "New",
                        "price": 40,
                        "quantity": 6,
                        "name": "MackBook Pro X",
                        "userID": "2697bd30-1fbd-4d79-8cc5-26e052141f35",
                        "date": "2016-12-22T01:52:24.483Z",
                        "save" :  function(){return PromiseHandler.resolver(MethodsMocks.UnhandledError)}
                    }
        };

    });

    it('Should get success true when its resolve ', () => {

        sandboxProduct.stub(Product.prototype, "save").returns(PromiseHandler.resolver(ProductMock));

        ProductService.updateProduct(ProductData)
        .then(function(response) {
            expect(response.success).to.be.true;
            expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The product was updated successfully", true);
            // done();
        });

    });

    it('Should get status 500 when the promise its rejected by unhandled error', () => {

        // sandboxProduct.stub(Product.prototype, "save").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
        ProductService.updateProduct(ProductData)
        .then((response) => {

        }).catch((err) => {
            expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating Product", 500);
            expect(err.statusCode).to.be.equals(500);
        });

    });


});

describe('#deleteProduct', () => {
    var productData;

    before(() => {
        sinon.spy(MessageHandler,'errorGenerator');
        sinon.spy(MessageHandler,'messageGenerator');
    });

    after(() => {
        MessageHandler.errorGenerator.restore();
        MessageHandler.messageGenerator.restore();
    });

    beforeEach(() => {

        productData = {
            "_id": "5erfefa-c427-4894-832c-ee1e8c714b80"
        };

    });

    it('Should get success true when its resolve ', () => {

        sandboxProduct.stub(Product, "remove").returns(PromiseHandler.resolver(ProductMock));
        ProductService.removeProduct(productData)
        .then(function(response) {
            expect(response.success).to.be.true;
            expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Product deleted succefully", true);
        });

    });

    it('Should get status 500 when the promise its rejected by unhandled error', () => {

        sandboxProduct.stub(Product, "remove").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
        ProductService.removeProduct(productData)
        .then((response) => {

        }).catch((err) => {
            expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened deleting product", 500);
            expect(err.statusCode).to.be.equals(500);
        });

    });

});

});
