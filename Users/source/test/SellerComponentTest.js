import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

// import SellerComponent from '../components/SellerComponent';
import User from '../models/User';
import SellerProfile from '../models/SellerProfile';
import MessageHandler from '../handler/MessageHandler';
import UserService from '../business/UserService';

import PromiseHandler from './Promise';
import {UserMock, SellerMock, reviews} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

require('../components');

chai.use(SinonChai);

let sandboxSeller;

beforeEach(() => {
    sandboxSeller = sinon.sandbox.create();
});

afterEach(() => {
    sandboxSeller.restore();

});

describe('#SellerComponent', () => {
    const SellerComponent = Studio.module('SellerComponent');

    describe('#getSellerToken', () => {

        const getSellerToken = SellerComponent('getSellerToken');

        let sellerData = {};

        it('Should return SellerToken when its resolve', (done) => {
            sellerData = {"userID": '2697bd30-1fbd-4d79-8cc5-26e052141235'};
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMock));

            getSellerToken(sellerData)
                .then((response) => {
                    expect(response).not.to.be.undefined;
                    expect(response).to.be.a('string');
                    done();
                });

        });

        it('Should get error 404 when seller not found', (done) => {

            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(null));

            getSellerToken(sellerData)
                .catch((error) => {
                    expect(error.statusCode).to.be.equals(404);
                    done();
                });

        });
    })

    describe('#getBankAccounts', () => {

        const getBankAccounts = SellerComponent('getBankAccounts');

        let sellerData = {};

        it('Should return BankAccounts Array when its resolve', (done) => {
            sellerData = {"sellerID": '2697bd30-1fbd-4d79-8cc5-26e052141235'};
            sandboxSeller.stub(SellerProfile, "findOne").returns({populate: () => PromiseHandler.resolver(SellerMock)});

            getBankAccounts(sellerData)
                .then((bankAccounts) => {
                    expect(bankAccounts).not.to.be.undefined;
                    expect(bankAccounts).to.be.instanceof(Array);
                    expect(bankAccounts).to.have.lengthOf(2);
                    done();
                });

        });

        it('Should return a empty array when seller not found', (done) => {

            sandboxSeller.stub(SellerProfile, "findOne").returns({populate: () => PromiseHandler.resolver(null)});

            getBankAccounts(sellerData)
                .then((bankAccounts) => {
                    expect(bankAccounts).not.to.be.undefined;
                    expect(bankAccounts).to.be.instanceof(Array);
                    expect(bankAccounts).to.have.lengthOf(0);
                    done();
                });

        });
    })

    describe('#setSellerProfile', () => {

        const setSellerProfile = SellerComponent('setSellerProfile');

        let sellerData = {};

        it('Should get success true when its resolve', async () => {
            sellerData = {"sellerID": '2697bd30-1fbd-4d79-8cc5-26e052141235'};
            sandboxSeller.stub(User, "findById").returns(PromiseHandler.resolver(UserMock));
            sandboxSeller.stub(SellerProfile, "create").returns(PromiseHandler.resolver(null));
            sandboxSeller.stub(UserService, "updateUser").returns(null);

            const response = await setSellerProfile(sellerData);
            expect(response).not.to.be.undefined;
            expect(response.success).to.be.true;

        });

        it('Should get success false when user doesnt exist', async () => {
            sellerData = {"sellerID": '2697bd30-1fbd-4d79-8cc5-26e052141236'};
            sandboxSeller.stub(User, "findById").returns(PromiseHandler.resolver(null));
            sandboxSeller.stub(SellerProfile, "create").returns(PromiseHandler.resolver(null));
            sandboxSeller.stub(UserService, "updateUser").returns(null);

            const response = await setSellerProfile(sellerData)
            expect(response).not.to.be.undefined;
            expect(response.success).to.be.false;

        });

        it('Should get error 400 when seller profile already exist ', (done) => {
            sellerData = {"sellerID": '2697bd30-1fbd-4d79-8cc5-26e052141236'};
            UserMock.sellerProfile = {};
            sandboxSeller.stub(User, "findById").returns(PromiseHandler.resolver(UserMock));
            sandboxSeller.stub(SellerProfile, "create").returns(PromiseHandler.resolver(null));
            sandboxSeller.stub(UserService, "updateUser").returns(null);

            setSellerProfile(sellerData)
                .catch((err) => {
                    expect(err.statusCode).to.be.equals(400);
                    done();
                });

        });

    })

    describe('#updateScore', () => {

        const updateScore = SellerComponent('updateScore');

        let sellerData = {};

        it('Should return true when its resolve', async () => {
            sellerData = {"sellerID": '2697bd30-1fbd-4d79-8cc5-26e052141235',totalScore:3.6};
            sandboxSeller.stub(SellerProfile, "findOneAndUpdate").returns(PromiseHandler.resolver(null));

            const response = await updateScore(sellerData);
            expect(response).not.to.be.undefined;
            expect(response).to.be.true;

        });
    })

    describe('#getSellerReviews', () => {

        const getSellerReviews = SellerComponent('getSellerReviews');

        beforeEach(() => {
            sinon.stub(Studio, "module").returns(MethodsMocks.StudioModule.bind(this,reviews)); // Mocking Studio module system
        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system
        });

        let sellerData = {};

        it('Should return an Object with an Array Reviews when its resolve', async () => {
            sellerData = {username:'servicommerce'};
            sandboxSeller.stub(User, "findOne").returns(PromiseHandler.resolver(UserMock));
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMock));

            const response = await getSellerReviews(sellerData);
            expect(response).not.to.be.undefined;
            expect(response.sellerReviews).to.be.instanceof(Array);
            expect(response.totalSellerScore).not.to.be.undefined;


        });

        it('Should get success false when user doesnt exist', async () => {
            sellerData = {username:'servicommerce'};
            sandboxSeller.stub(User, "findOne").returns(PromiseHandler.resolver(null));

            const response = await getSellerReviews(sellerData);
            expect(response).not.to.be.undefined;
            expect(response.success).to.be.false;


        });

        it('Should get success false when seller doesnt exist', async () => {
            sellerData = {username:'servicommerce'};
            sandboxSeller.stub(User, "findOne").returns(PromiseHandler.resolver(UserMock));
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(null));

            const response = await getSellerReviews(sellerData);
            expect(response).not.to.be.undefined;
            expect(response.success).to.be.false;


        });
    })


    describe('#checkSellerPaymentMethods', () => {

        const checkSellerPaymentMethods = SellerComponent('checkSellerPaymentMethods');

        let SellerMockCopy = {...SellerMock};

        afterEach(() => {
            SellerMockCopy = {...SellerMock};
        });

        it('Return true when paymentMethod is automatic and collectorID exist', async () => {
            // sellerData = {username:'servicommerce'};
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('automatic');
            expect(response).not.to.be.undefined;
            expect(response).to.be.true;


        });

        it('Return false when paymentMethod is automatic and collectorID doesnt exist', async () => {
            delete SellerMockCopy.collectorID;
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('automatic');
            expect(response).not.to.be.undefined;
            expect(response).to.be.false;


        });

        it('Return true when paymentMethod is manual and seller has banks accounts', async () => {
            // sellerData = {username:'servicommerce'};
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('manual');
            expect(response).not.to.be.undefined;
            expect(response).to.be.true;


        });

        it('Return false when paymentMethod is manual and seller has not banks accounts', async () => {
            SellerMockCopy.bankAccounts = [];
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('manual');
            expect(response).not.to.be.undefined;
            expect(response).to.be.false;


        });

        it('Return true when paymentMethod is both and seller has banks accounts and collectorID', async () => {
            // sellerData = {username:'servicommerce'};
            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('both');
            expect(response).not.to.be.undefined;
            expect(response).to.be.true;


        });

        it('Return true when paymentMethod is both and seller has not banks accounts and collectorID', async () => {
            SellerMockCopy.bankAccounts = [];
            delete SellerMockCopy.collectorID;

            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            const response = await checkSellerPaymentMethods('both');
            expect(response).not.to.be.undefined;
            expect(response).to.be.false;


        });

        it('Should be rejected when the seller profile doesnt exist', (done) => {

            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(null));

            checkSellerPaymentMethods('automatic')
                .catch((err) => {
                    expect(err).not.to.be.undefined;
                    expect(err.statusCode).to.be.equals(200);
                    done();
                })

        });

        it('Should be rejected when invalid payment Method is set', (done) => {

            sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(SellerMockCopy));

            checkSellerPaymentMethods('anyInvalidParam')
                .catch((err) => {
                    expect(err).not.to.be.undefined;
                    expect(err.statusCode).to.be.equals(400);
                    done();
                })

        });

        // it('Should get success false when user doesnt exist', async () => {
        //     sellerData = {username:'servicommerce'};
        //     sandboxSeller.stub(User, "findOne").returns(PromiseHandler.resolver(null));
        //
        //     const response = await getSellerReviews(sellerData);
        //     expect(response).not.to.be.undefined;
        //     expect(response.success).to.be.false;
        //
        //
        // });
        //
        // it('Should get success false when seller doesnt exist', async () => {
        //     sellerData = {username:'servicommerce'};
        //     sandboxSeller.stub(User, "findOne").returns(PromiseHandler.resolver(UserMock));
        //     sandboxSeller.stub(SellerProfile, "findOne").returns(PromiseHandler.resolver(null));
        //
        //     const response = await getSellerReviews(sellerData);
        //     expect(response).not.to.be.undefined;
        //     expect(response.success).to.be.false;
        //
        //
        // });
    })





})
