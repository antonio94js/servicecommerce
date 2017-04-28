import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

// import SellerComponent from '../components/SellerComponent';
import User from '../models/User';
import SellerProfile from '../models/SellerProfile';
import MessageHandler from '../handler/MessageHandler';
import UserService from '../business/UserService';
import jwtHandler from '../handler/jwtHandler';

import PromiseHandler from './Promise';
import {UserMock, SellerMock, reviews} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

require('../components');

chai.use(SinonChai);

let sandboxAuth;

beforeEach(() => {
    sandboxAuth = sinon.sandbox.create();
});

afterEach(() => {
    sandboxAuth.restore();

});

describe('#AuthComponent', () => {
    const AuthComponent = Studio.module('AuthComponent');


    describe('#LoginUser', () => {
        const loginUser = AuthComponent('loginUser');
        let userCredentials;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxAuth.stub(User, "findOne", MongoMocks.findOne);
            sandboxAuth.stub(UserService, "updateUser", () => null);

            sandboxAuth.stub(jwtHandler, "generateAccessToken").returns('aUHuaqw2990ajaKHafkKAKDgqueOAQUEaiudfq');


            userCredentials = {"password": "123","account": "servi@gmail.com"};

        });

        it('Should get success false when the password is invalid ', (done) => {

            userCredentials.password = "12345"; // invalid password
            loginUser(userCredentials)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    expect(response.success).to.be.false;
                    done();
                });

        });

        it('Should get success false when the email is invalid ', (done) => {

            userCredentials.account = "s@gmail.com"; // invalid email
            loginUser(userCredentials)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    expect(response.success).to.be.false;
                    done();
                });

        });

        it('Should get success equals true when credentials are valids ', (done) => {

            loginUser(userCredentials)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                })

        });
    });


    describe('#refreshUserToken', () => {
        const refreshUserToken = AuthComponent('refreshUserToken');
        let userData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxAuth.stub(User, "findOne").returns(PromiseHandler.resolver(UserMock));
            // sandboxAuth.stub(UserService, "updateUser", () => null);

            sandboxAuth.stub(jwtHandler, "generateAccessToken").returns('aUHuaqw2990ajaKHafkKAKDgqueOAQUEaiudfq');


            userData = {"username": 'servicommerce',refreshToken:'asasfqfqefqefefqf'};

        });

        it('Should get new token when refreshToken is valid', (done) => {

            refreshUserToken(userData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(response.success).to.be.true;
                    expect(response.token).to.be.string;
                    // console.log(response);
                    // expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    // expect(response.success).to.be.false;
                    done();
                }).catch(function (err) {
                    console.log(err);
                })

        });

        it('Should get error token when refreshToken is invalid', (done) => {
            userData.refreshToken = 'asdfadfasdf';
            refreshUserToken(userData)
                .then(function(response) {

                }).catch(function (err) {
                    expect(err).to.not.be.undefined;
                    // expect(response.success).to.be.true;
                    // expect(response.token).to.be.string;
                    // console.log(response);
                    // expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    // expect(response.success).to.be.false;
                    done();
                })

        });

        // it('Should get success false when the email is invalid ', (done) => {
        //
        //     userCredentials.account = "s@gmail.com"; // invalid email
        //     loginUser(userCredentials)
        //         .then(function(response) {
        //             expect(response).to.not.be.undefined;
        //             expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
        //             expect(response.success).to.be.false;
        //             done();
        //         });
        //
        // });
        //
        // it('Should get success equals true when credentials are valids ', (done) => {
        //
        //     loginUser(userCredentials)
        //         .then(function(response) {
        //             expect(response).to.not.be.undefined;
        //             expect(MessageHandler.messageGenerator).to.have.been.called;
        //             expect(response.success).to.be.true;
        //             done();
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         })
        //
        // });
    });
})
