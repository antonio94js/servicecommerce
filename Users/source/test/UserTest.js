import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';

import UserService from '../business/UserService';
import User from '../models/User';
import MessageHandler from '../handler/MessageHandler';
import jwtHandler from '../handler/jwtHandler';

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

        let userData;

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
                "email": "servi@gmail.com",
                "username":"servicommerce"
            };

        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system

        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        it('Should get success true when its resolve', (done) => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.resolver(UserMock));
            UserService.createNewUser(userData)
                .then(function(response) {
                    expect(response).not.to.be.undefined;
                    expect(response.success).to.be.true;
                    done();
                });

        });

        it('Should get status 409 when the promise its rejected by duplicated user', (done) => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(MongoMocks.DuplicatedError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("The user already exist", 409);
                    // expect(MessageHandler.errorGenerator.calledWithExactly("The user already exist", 409)).to.be.true;
                    expect(err.statusCode).to.be.equals(409);
                    expect(err.name).to.be.equals('CustomError');
                    done();
                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', (done) => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating user", 500);
                    expect(err.statusCode).to.be.equals(500);
                    done();
                });

        });
    });

    // describe('#LoginUser', () => {
    //
    //     let userCredentials;
    //
    //     before(() => {
    //         sinon.spy(MessageHandler,'errorGenerator');
    //         sinon.spy(MessageHandler,'messageGenerator');
    //     });
    //
    //     after(() => {
    //         MessageHandler.errorGenerator.restore();
    //         MessageHandler.messageGenerator.restore();
    //     });
    //
    //     beforeEach(() => {
    //
    //         sandboxUser.stub(User, "findOne", MongoMocks.findOne);
    //         sandboxUser.stub(jwtHandler, "generateAccessToken").returns('aUHuaqw2990ajaKHafkKAKDgqueOAQUEaiudfq');
    //
    //
    //         userCredentials = {"password": "123","account": "servi@gmail.com"};
    //
    //     });
    //
    //     it('Should get success false when the password is invalid ', (done) => {
    //
    //         userCredentials.password = "12345"; // invalid password
    //         UserService.userSignOn(userCredentials)
    //             .then(function(response) {
    //                 expect(response).to.not.be.undefined;
    //                 expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
    //                 expect(response.success).to.be.false;
    //                 done();
    //             });
    //
    //     });
    //
    //     it('Should get success false when the email is invalid ', (done) => {
    //
    //         userCredentials.account = "s@gmail.com"; // invalid email
    //         UserService.userSignOn(userCredentials)
    //             .then(function(response) {
    //                 expect(response).to.not.be.undefined;
    //                 expect(MessageHandler.messageGenerator).to.have.been.calledWithExactly("The credentials are invalid, please check it out", false);
    //                 expect(response.success).to.be.false;
    //                 done();
    //             });
    //
    //     });
    //
    //     it('Should get success equals true when credentials are valids ', (done) => {
    //
    //         UserService.userSignOn(userCredentials)
    //             .then(function(response) {
    //                 expect(response).to.not.be.undefined;
    //                 expect(MessageHandler.messageGenerator).to.have.been.called;
    //                 expect(response.success).to.be.true;
    //                 done();
    //             })
    //             .catch((err) => {
    //                 // console.log(err);
    //             })
    //
    //     });
    // });

    describe('#updateUser', () => {
        let userField;

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

        it('Should be rejected when the field is invalid', (done) => {

            userField.field = 'sadfsdfad'; //Invalid field
            UserService.updateUser(userField)
                .then(function(response) {

                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    expect(err.statusCode).to.be.equals(400);
                    done();
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
