import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

import ProductService from '../bussiness/ProductService';
import Product from '../models/Product';
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

            sinon.stub(Studio, "module").returns(MethodsMocks.StudioModule); // Mocking Studio module system

            productData = {
              "_id": "5erfefa-c427-4894-832c-ee1e8c714b80",
              "productdetail": "Here should be a detail",
              "status":"New",
              "price": 40,
              "quantity": 5,
              "name": "MackBook Pro"
            };

        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve ', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.resolver(ProductMock));
            ProductService.store(productData)
                .then(function(response) {
                    expect(response.success).to.be.true;
                });

        });

        it('Should get status 409 when the promise its rejected by duplicated product', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.rejecter(MongoMocks.DuplicatedError));
            ProductService.store(ProductData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("The product already exist", 409);
                    // expect(MessageHandler.errorGenerator.calledWithExactly("The Product already exist", 409)).to.be.true;
                    expect(err.statusCode).to.be.equals(409);
                    expect(err.name).to.be.equals('CustomError');
                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', () => {

            sandboxProduct.stub(Product, "create").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
            ProductService.store(ProductData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating Product", 500);
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

            sandboxProduct.stub(Product, "findByIdAndUpdate").returns(PromiseHandler.resolver(true));

            ProductData = {
                "_id": "5erfefa-c427-4894-832c-ee1e8c714b80",
                "productdetail": "Here should be a detail",
                "status":"New",
                "price": 40,
                "quantity": 6,
                "name": "MackBook Pro"
            };

        });


    });

    describe('#deleteProduct', () => {

    });

});
