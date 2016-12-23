import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

import UserService from '../business/UserService';
import User from '../models/User';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {UserMock} from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';



chai.use(SinonChai);

let sandboxUser;

beforeEach(() => {
    sandboxUser = sinon.sandbox.create();


});

afterEach(() => {
    sandboxUser.restore();

});


describe('#UserService', () => {

    describe('#CreateUser', () => {

        var userData;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        beforeEach(() => {

            sinon.stub(Studio, "module").returns(MethodsMocks.StudioModule); // Mocking Studio module system

            userData = {
                "_id": "2697bd30-1fbd-4d79-8cc5-26e052141235",
                "firstname": "Service",
                "lastname": "Commerce",
                "password": "123",
                "email": "servi@gmail.com"
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

            sandboxUser.stub(User, "create").returns(PromiseHandler.resolver(UserMock));
            UserService.createNewUser(userData)
                .then(function(response) {
                    expect(response.success).to.be.true;
                });

        });

        it('Should get status 409 when the promise its rejected by duplicated user', () => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(MongoMocks.DuplicatedError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("The user already exist", 409);
                    // expect(MessageHandler.errorGenerator.calledWithExactly("The user already exist", 409)).to.be.true;
                    expect(err.statusCode).to.be.equals(409);
                    expect(err.name).to.be.equals('CustomError');
                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', () => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating user", 500);
                    expect(err.statusCode).to.be.equals(500);
                });

        });
    });

    describe('#LoginUser', () => {
        var useCredentials;
        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxUser.stub(User, "findOne", MongoMocks.findOne);

            useCredentials = {"password": "123","email": "servi@gmail.com"};

        });

        it('Should get success false when the password is invalid ', () => {

            useCredentials.password = "12345"; // invalid password
            UserService.userSignOn(useCredentials)
                .then(function(response) {
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    expect(response.success).to.be.false;
                });

        });

        it('Should get success false when the email is invalid ', () => {

            useCredentials.email = "s@gmail.com"; // invalid email
            UserService.userSignOn(useCredentials)
                .then(function(response) {
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
                    expect(response.success).to.be.false;
                });

        });

        it('Should get success equals true when credentials are valids ', () => {

            UserService.userSignOn(useCredentials)
                .then(function(response) {
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                })
                .catch((err) => {
                    console.log(err);
                })

        });
    });

    describe('#updateUser', () => {
        var userField;

        before(() => {
            sinon.spy(MessageHandler,'errorGenerator');
            sinon.spy(MessageHandler,'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            sandboxUser.stub(User, "findByIdAndUpdate").returns(PromiseHandler.resolver(true));

            userField = {"value": "123","field": "password"};

        });

        it('Should be rejected when the field is invalid', () => {

            userField.field = 'sadfsdfad'; //Invalid field
            UserService.updateUser(userField)
                .then(function(response) {

                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.statusCode).to.be.equals(400);
                });

        });

        it('Should be resolve when the field is valid', (done) => {

            UserService.updateUser(userField)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("User Updated successfully", true);
                    expect(response.success).to.be.true;
                    done();
                });

        });

    });

});
