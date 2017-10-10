import sinon from 'sinon';
import Studio from 'studio';
import chai, {
    expect
}
from 'chai';
import SinonChai from 'sinon-chai';

// import UserService from '../business/UserService';
import Publication from '../models/Publication';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {
    PublicationMock
}
from './mocks/Fixtures';

import PublicationService from '../business/PublicationService';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

require("../components");

chai.use(SinonChai);

let sandboxPublication;

beforeEach(() => {
    sandboxPublication = sinon.sandbox.create();
});

afterEach(() => {
    sandboxPublication.restore();

});


describe('#PublicationComponent', () => {

    let PublicationComponent

    beforeEach(() => {
        PublicationComponent = Studio.module('PublicationComponent');
    })

    describe('#createPublication', () => {

        let publicationRequestData;
        let createPublication;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            createPublication = PublicationComponent('createPublication');


            publicationRequestData = {
                "_id": "4d64e0e4-5471-47ea-aedc-59075a912ecb",
                "productID": "5ba01a4a-d140-4853-b927-254e9df58140",
                "publicationDetail": "Here should be a detail",
                "name": "Sell MacBook 2 Original "
            }

        });

        it('Should get success true when its created successfully ', (done) => {
            sandboxPublication.stub(PublicationService, "checkPaymentMethod").returns(PromiseHandler.resolver(true));
            sandboxPublication.stub(Publication, "create").returns(PromiseHandler.resolver(true));

            createPublication(publicationRequestData)
                .then(function(response) {
                    expect(response.success).to.be.true;
                    done()
                })
                .catch((err) => {
                    console.log(err);
                })

        });


        it('Should get status 409 when the promise its rejected by duplicated publication', (done) => {
            sandboxPublication.stub(PublicationService, "checkPaymentMethod").returns(PromiseHandler.resolver(true));
            sandboxPublication.stub(Publication, "create", () => PromiseHandler.rejecter(MongoMocks.DuplicatedError));
            createPublication(publicationRequestData)
                .catch((err) => {
                    // console.log(err);
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly(
                        "The publication already exist", 409);
                    expect(err.statusCode).to.be.equals(409);
                    expect(err.name).to.be.equals('CustomError');
                    done()
                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', (done) => {
                sandboxPublication.stub(PublicationService, "checkPaymentMethod").returns(PromiseHandler.resolver(true));
                sandboxPublication.stub(Publication, "create", () => PromiseHandler.rejecter(MethodsMocks.UnhandledError));
                // done();
                createPublication(publicationRequestData)
                    .then(function(response) {

                    })
                    .catch((err) => {
                        // console.log(err);
                        expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly(
                            "Something wrong happened creating publication", 500);
                        expect(err.statusCode).to.be.equals(500);
                        done()
                    });

        });


        it('Should get success false when checkPaymentMethod return false', (done) => {
            sandboxPublication.stub(PublicationService, "checkPaymentMethod").returns(PromiseHandler.resolver(false));
            sandboxPublication.stub(Publication, "create").returns(PromiseHandler.resolver(true));
            createPublication(publicationRequestData)
                .then((response) => {
                    // console.log(err);
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.false;
                    done()
                });

        });
    });

    describe('#updatePublication', () => {

        let publicationData;
        let updatePublication;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            // sandboxPublication.stub(User, "findByIdAndUpdate").returns(PromiseHandler.resolver(true));
            updatePublication = PublicationComponent('updatePublication');
            publicationData = {
                _id: "4d64e0e4-5471-47ea-aedc-59075a912eca",
                publicationDetail: "I sold this Mac because I move to canada",
                name: "Sell MacBook 3 Original ",
                publication: {
                    _id: "4d64e0e4-5471-47ea-aedc-59075a912eca",
                    productID: "5ba01a4a-d140-4853-b927-254e9df58140",
                    publicationDetail: "Here should be a detail",
                    name: "Sell MacBook 2 Original ",
                    save: () => PromiseHandler.resolver(true)
                }
            }

        });

        it('Should get succes true when its updated successfully', (done) => {

            updatePublication(publicationData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                    done();
                }).catch((err) => {

                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', (done) => {

            publicationData.publication.save = () => PromiseHandler.rejecter(MethodsMocks.UnhandledError);
            updatePublication(publicationData)
                .then(function(response) {
                    // console.log(response);
                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(err.statusCode).to.be.equals(500);
                    done();
                })

        });

    });

    describe('#deletePublication', () => {

        let publicationData;
        let deletePublication;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            // sandboxPublication.stub(User, "findByIdAndUpdate").returns(PromiseHandler.resolver(true));
            sandboxPublication.stub(Publication, "findById").returns(PromiseHandler.resolver(PublicationMock));
            deletePublication = PublicationComponent('deletePublication');
            publicationData = {
                _id: "4d64e0e4-5471-47ea-aedc-59075a912eca",
            }

        });

        it('Should get succes true when its deleted successfully', (done) => {

            sandboxPublication.stub(Publication, "remove").returns(PromiseHandler.resolver(true));
            deletePublication(publicationData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                    done();
                }).catch((err) => {

                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', (done) => {

            sandboxPublication.stub(Publication, "remove",() => PromiseHandler.rejecter(MethodsMocks.UnhandledError));

            deletePublication(publicationData)
                .then(function(response) {

                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(err.statusCode).to.be.equals(500);
                    done();
                })

        });

        it('Should get succes true when publication status is 1 and doesnt has an active order', (done) => {
            PublicationMock.status = 1;
            sandboxPublication.stub(Publication, "remove").returns(PromiseHandler.resolver(true));
            sandboxPublication.stub(PublicationService, "_checkOrderStatus").returns(PromiseHandler.resolver(false));

            deletePublication(publicationData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                    done();
                })
        });

        it('Should get succes false when publication status is 1 and it has an active order', (done) => {
            // PublicationMock.status = 1;
            sandboxPublication.stub(Publication, "remove",() => PromiseHandler.rejecter(MethodsMocks.UnhandledError));
            sandboxPublication.stub(PublicationService, "_checkOrderStatus").returns(PromiseHandler.resolver(true));

            deletePublication(publicationData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.false;
                    done();
                })
        });


    });

    describe('#makeNewComment', () => {

        let commentData;
        let makeNewComment;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxPublication.stub(Publication, "findOne", MongoMocks.findOne);

            makeNewComment = PublicationComponent('makeComment');
            commentData = {
                _id: "8fdcddab-c427-4894-832c-ee1e8c714b72",
                publicationID: "4d64e0e4-5471-47ea-aedc-59075a912ecb"
                    /*Here should be another fields, but they aren't required for this test*/
            }

        });

        it('Should be resolved with true when the publication exist', (done) => {

            makeNewComment(commentData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(response).to.be.true;
                    done();
                }).catch((err) => {
                    // console.log(err);
                });

        });

        it('Should be rejected when the publication does not exist', (done) => {

            commentData.publicationID = "12312";
            makeNewComment(commentData)
                .then(function(response) {

                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    done();
                })

        });

    });

    describe('#checkPublicationStatus', () => {

        let productData;
        let checkPublicationStatus;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            // sandboxPublication.stub(Publication, "findOne", MongoMocks.findOne);
            sandboxPublication.stub(Publication, "findOne", MongoMocks.findOneNested);

            checkPublicationStatus = PublicationComponent('checkPublicationStatus');
            productData = {
                productID: "5ba01a4a-d140-4853-b927-254e9df58140"
                    /*Here should be another fields, but they aren't required for this test*/
            }

        });

        afterEach(() => {
            PublicationMock.status = 1;
        });

        it('Should be resolved with false when the publication status is 1 and product belong to her', (
            done) => {

            checkPublicationStatus(productData)
                .then(function(response) {
                    expect(response).to.be.false;
                    done();
                }).catch((err) => {
                    console.log(err);
                });

        });

        it('Should be resolved with true when the publication status is 0', (done) => {
            sandboxPublication.stub(Publication, "remove").returns(PromiseHandler.resolver(true));
            PublicationMock.status = 0;
            checkPublicationStatus(productData)
                .then(function(response) {
                    expect(response).to.be.true;
                    done();
                }).catch((err) => {
                    // console.log(err);
                });

        });

        it('Should be resolved with true when the product does not belong to any publication', (done) => {

            productData.productID = "xxxxx-xxx-xx-xxxxx-xxxxxx"
            checkPublicationStatus(productData)
                .then(function(response) {
                    expect(response).to.be.true;
                    done();
                }).catch((err) => {
                    console.log(err);
                });

        });


    });

    describe('#getPublicationDetail', () => {

        let publicationData;
        let getPublicationDetail;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxPublication.stub(Publication, "findById", MongoMocks.findById);

            getPublicationDetail = PublicationComponent('getExpandDetail');
            publicationData = {
                _id: "4d64e0e4-5471-47ea-aedc-59075a912ecb"

            }

        });

        afterEach(() => {
            PublicationMock.status = 1;
        });

        it('Should get a publication object when its status is 1 and the publication exist', (
            done) => {

            getPublicationDetail(publicationData)
                .then(function(publication) {
                    expect(publication).not.to.be.undefined;
                    expect(publication._id).to.be.equals(PublicationMock._id);
                    done();
                }).catch((err) => {
                    // console.log(err);
                });

        });

        it('Should be rejected when the publication status is 0', (
            done) => {

            PublicationMock.status = 0;
            getPublicationDetail(publicationData)
                .catch((err) => {
                    expect(err).not.to.be.undefined;
                    expect(MessageHandler.errorGenerator).to.have.been.called;
                    done();
                });

        });

        it('Should be rejected when the publication does not exist', (
            done) => {

            publicationData._id = "xxxxx-xxx-xx-xxxxx-xxxxxx";
            getPublicationDetail(publicationData)
                .catch((err) => {
                    expect(err).not.to.be.undefined;
                    expect(MessageHandler.errorGenerator).to.have.been.called;
                    done();
                });

        });



        // it('Should get a publication object when its status is 1 and the publication exist', (
        //     done) => {
        //
        //     getPublicationDetail(publicationData)
        //         .then(function(publication) {
        //             expect(publication).not.to.be.undefined;
        //             expect(publication._id).to.be.equals(PublicationMock._id);
        //             done();
        //         }).catch((err) => {
        //             // console.log(err);
        //         });
        //
        // });
        //
        // it('Should be resolved with true when the product does not belong to any publication', (done) => {
        //
        //     productData._id = "xxxxx-xxx-xx-xxxxx-xxxxxx"
        //     checkPublicationStatus(productData)
        //         .then(function(response) {
        //             expect(response).to.be.true;
        //             done();
        //         }).catch((err) => {
        //             // console.log(err);
        //         });
        //
        // });


    });

});
