import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

import OfferService from '../business/OfferService';
import ProductService from '../business/ProductService';
import Offer from '../models/offer';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {OfferMock} from './mocks/Fixtures';
import {ProductMock} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

chai.use(SinonChai);

let sandboxOffer;

beforeEach(() => {
    sandboxOffer = sinon.sandbox.create();


});

afterEach(() => {
    sandboxOffer.restore();

});


describe('#OfferService', () => {

    describe('#CreateOffer', () => {
        var offerData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        beforeEach(() => {

            offerData = {
                "start_date" : "2016-09-16",
                "end_date" : "2016-11-16",
                "price" : 30,
                "productID" : "5erfefa-c427-4894-832c-ee1e8c714b80",
                "_id" : "g5hf5th-c436-4894-832c-aaqd8c714b87",
                "userID" : "2697bd30-1fbd-4d79-8cc5-26e052141f35"
            };

        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve ', () => {
            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(ProductMock));
            sandboxOffer.stub(Offer, "create").returns(PromiseHandler.resolver('offerData'));
            sandboxOffer.stub(ProductService, "assignOffer").returns(PromiseHandler.resolver(MessageHandler.messageGenerator(
         "Offer created successfully",
         true)));
            OfferService.store(offerData)
            .then(function(response) {
                expect(response.success).to.be.true;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Offer created successfully", true);
            });

        });

        it('Should get success false when product id is not found', () => {
            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(null));

            OfferService.store(offerData)
            .then(function(response) {
                expect(response.success).to.be.false;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Product not found", false);
            }).catch((err) => {

            });
        });


    });

    describe('#UpdateOffer', () => {
        var offerData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        beforeEach(() => {

            offerData = {
                "start_date" : "2016-09-16",
                "end_date" : "2016-11-16",
                "price" : 30,
                "productID" : "5erfefa-c427-4894-832c-ee1e8c714b80",
                "_id" : "g5hf5th-c436-4894-832c-aaqd8c714b87",
                "userID" : "2697bd30-1fbd-4d79-8cc5-26e052141f35"
            };

        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve ', () => {

            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(ProductMock));
            sandboxOffer.stub(Offer, "findOne", MongoMocks.findOne);
            sandboxOffer.stub(Offer.prototype, "save").returns(PromiseHandler.resolver(ProductMock));
            OfferService.store(offerData)
            .then(function(response) {
                expect(response.success).to.be.true;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Offer updated successfully", false);
            }).catch((err) => {

            });

        });

        it('Should get success false when offer id is not found', () => {

            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(ProductMock));
            sandboxOffer.stub(Offer, "findOne", null);
            OfferService.store(offerData)
            .then(function(response) {
                expect(response.success).to.be.false;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Offer not found", false);
            }).catch((err) => {

            });
        });

        it('Should get success false when product id is not found', () => {
            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(null));

            OfferService.store(offerData)
            .then(function(response) {
                expect(response.success).to.be.false;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Product not found", false);
            }).catch((err) => {

            });
        });
    });
    describe('#DeleteOffer', () => {
        var offerData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        beforeEach(() => {

            offerData = {
                "userID": "2697bd30-1fbd-4d79-8cc5-26e052141f35",
                "productID": "5erfefa-c427-4894-832c-ee1e8c714b80"
            }


        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve ', () => {

            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(ProductMock));
            sandboxOffer.stub(Offer.prototype, "remove").returns(PromiseHandler.resolver(ProductMock));
            OfferService.remove(offerData)
            .then(function(response) {
                expect(response.success).to.be.true;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Offer deleted successfully", false);
            }).catch((err) => {

            });

        });

        it('Should get success false when product id is not found', () => {

            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(null));
            OfferService.remove(offerData)
            .then(function(response) {
                expect(response.success).to.be.true;
                expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("Product not found in yours", false);
            }).catch((err) => {

            });
        });

        it('Should get status 500 when the promise its rejected by unhandled error', () => {

            sandboxOffer.stub(ProductService, "productBelongsToUser").returns(PromiseHandler.resolver(ProductMock));
            OfferService.remove(offerData)
            .then(function(response) {

            }).catch((err) => {
                console.log(err);
                expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened deleting offer", 500);
                expect(err.statusCode).to.be.equals(500);
            });
        });
    });

});
