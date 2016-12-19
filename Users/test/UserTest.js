import UserService from '../bussiness/UserService';
import User from '../models/User';
import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import PromiseHandler from './Promise';
import Mocks from './mocks';
import MessageHandler from '../handler/MessageHandler';
import SinonChai from 'sinon-chai';

chai.use(SinonChai);

let sandboxUser;

beforeEach(() => {
    sandboxUser = sinon.sandbox.create();
    sinon.spy(MessageHandler,'errorGenerator');

});

afterEach(() => {
    sandboxUser.restore();
    MessageHandler.errorGenerator.restore();

});


describe('#UserService', () => {

    describe('#CreateUser', () => {

        var userData;

        beforeEach(() => {

            sinon.stub(Studio, "module").returns(Mocks.StudioModule); // Mocking Studio module system

            userData = {
                "_id": "2697bd30-1fbd-4d79-8cc5-26e052141235",
                "firstname": "Service",
                "lastname": "Commerce",
                "password": "123",
                "email": "s@gmail.com"
            }

        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system

        });

        it('Should get success equals true when its resolve ', () => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.resolver(Mocks.UserCreated));
            UserService.createNewUser(userData)
                .then(function(response) {
                    expect(response.success).to.be.true;
                })

        });

        it('Should get status 409 with the promise its reject by duplicated user', () => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(Mocks.DuplicatedError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("The user already exist", 409);
                    // expect(MessageHandler.errorGenerator.calledWithExactly("The user already exist", 409)).to.be.true;
                    expect(err.statusCode).to.be.equals(409);
                    expect(err.name).to.be.equals('CustomError');
                })

        });

        it('Should get status 500 with the promise its reject by unhandled error', () => {

            sandboxUser.stub(User, "create").returns(PromiseHandler.rejecter(Mocks.UnhandledError));
            UserService.createNewUser(userData)
                .then((response) => {

                }).catch((err) => {
                    expect(MessageHandler.errorGenerator).to.have.been.calledWithExactly("Something wrong happened creating user", 500);
                    expect(err.statusCode).to.be.equals(500);
                })

        });
    });

    describe('#LoginUser', () => {
        // it('When ', (done) => {
        //
        // });
    });

});
