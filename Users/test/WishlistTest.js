import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';
import _ from 'lodash';
import WishlistService from '../bussiness/WishlistService';
import Wishlist from '../models/Whislist';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {WishlistMock} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

chai.use(SinonChai);

let sandboxWishlist;

beforeEach(() => {
    sandboxWishlist = sinon.sandbox.create();

});

afterEach(() => {
    sandboxWishlist.restore();
});

describe('#WishlistService', () => {


    var WishlistPayload;

    beforeEach(() => {
        sandboxWishlist.stub(Wishlist, "findOne").returns(PromiseHandler.resolver(WishlistMock));
        sandboxWishlist.stub(Wishlist, "findByIdAndUpdate").returns(PromiseHandler.resolver(true));

        WishlistPayload = {
            "iduser": '2697bd30-1fbd-4d79-8cc5-26e052141235',
            "data": {
                "publicationID": '3e4e029f-db54-459b-bf0b-624796bb0c9e',
                "publicationName": 'Newest Dell Inspiron i3558-5500BLK 15.6"'
            }
        };

    });

    describe('#When the action is add', () => {
        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        afterEach(() => {
            //restoring the original array
            WishlistPayload.data.publicationID = '3e4e029f-db54-459b-bf0b-624796bb0c9e';
            WishlistMock.products = _.filter(WishlistMock.products, product => product.publicationID !==
                WishlistPayload.data.publicationID)

        })

        it('Should add new element to Publications List', (done) => {
            expect(WishlistMock.products).to.have.lengthOf(3); // Original length
            WishlistService.updateUserWishlist('add', WishlistPayload)
                .then((response) => {
                    expect(WishlistMock.products).to.have.lengthOf(4); // Adding new element
                    done();

                })
                .catch((err) => {
                    console.log(err);
                })

        });

        it('Should be resolved with success equal true and a success message', (done) => {

            WishlistService.updateUserWishlist('add', WishlistPayload)
                .then((response) => {
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly(
                        "Publication added successfully", true);
                    expect(response.success).to.be.true;
                    done();
                })

        });

        it('Should be resolved with success false when the publication is duplicated and keep the original length', (done) => {

                WishlistPayload.data.publicationID = '8a8f8b19-c8d7-4e78-b4b6-3b4cf2972e9b'; // duplicated ID

                WishlistService.updateUserWishlist('add', WishlistPayload)
                    .then((response) => {
                        expect(WishlistMock.products).to.have.lengthOf(3); // Keep the original length
                        expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The publication already exist in your wishlist", false);
                        expect(response.success).to.be.false;
                        done();
                    })
                    .catch((err) => {

                    })
            });

    });

    describe('#When the action is delete', () => {
        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });
        beforeEach(() => {
            // console.log(WishlistMock.products);
            WishlistPayload = {
                "iduser": '2697bd30-1fbd-4d79-8cc5-26e052141235',
                "data": {
        			"publicationName" : "A New MackBook Air 13 inch 8 gb Ram Intel i3",
        			"publicationID" : "01e4b81a-f7a4-46e5-b21f-0ba1a4120610"
        		}
            };
        });

        afterEach(() => {
            //restoring the original array
            WishlistMock.products.push(WishlistPayload.data);

        })

        it('Should delete a element from the Publications List', (done) => {

            expect(WishlistMock.products).to.have.lengthOf(3); // Original length
            WishlistService.updateUserWishlist('delete', WishlistPayload)
                .then((response) => {
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(WishlistMock.products).to.have.lengthOf(2); // Adding new element
                    done();

                })
                .catch((err) => {
                    // console.log(err);
                })

        });

    });

    describe('#When the action is invalid', () => {
        // before(() => {
        //     sinon.spy(MessageHandler,'errorGenerator');
        //     sinon.spy(MessageHandler,'messageGenerator');
        // });
        //
        // after(() => {
        //     MessageHandler.errorGenerator.restore();
        //     MessageHandler.messageGenerator.restore();
        // });

        it('Should be rejected with status 400', (done) => {

            WishlistService.updateUserWishlist('SOMETHING', WishlistPayload)
                .catch((err) => {
                    expect(err.statusCode).to.be.equals(400);
                    done();
                })

        });

    });

});
