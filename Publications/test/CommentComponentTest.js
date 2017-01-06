import sinon from 'sinon';
import Studio from 'studio';
import chai, {
    expect
}
from 'chai';
import SinonChai from 'sinon-chai';

// import UserService from '../business/UserService';
import Comment from '../models/Comment';
import CommentService from '../business/CommentService';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {
    PublicationMock
}
from './mocks/Fixtures';
import MongoMocks from './mocks/MongoMocks';
import MethodsMocks from './mocks/MethodsMocks';

require("../components");

chai.use(SinonChai);

let sandboxComment;

beforeEach(() => {
    sandboxComment = sinon.sandbox.create();
});

afterEach(() => {
    sandboxComment.restore();

});


describe('#CommentComponent', () => {

    let CommentComponent

    beforeEach(() => {
        CommentComponent = Studio.module('CommentComponent');
    })

    describe('#createComment', () => {

        let commentRequestData;
        let createComment;

        before(() => {

            sinon.spy(MessageHandler, 'errorGenerator');
            // sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {

            MessageHandler.errorGenerator.restore();
        });

        beforeEach(() => {

            createComment = CommentComponent('createComment');

            sinon.spy(MessageHandler, 'messageGenerator');
            sandboxComment.stub(Comment, "create").returns(PromiseHandler.resolver(true));
            sandboxComment.stub(Comment, "remove").returns(PromiseHandler.resolver(true));

            sinon.stub(Studio, "module").returns(MethodsMocks.StudioModule); // Mocking Studio module system

            commentRequestData = {
                "_id": "8fdcddab-c427-4894-832c-ee1e8c714b92",
                "publicationID": "4d64e0e4-5471-47ea-aedc-59075a912eca",
                "body": "Here should be the comment's body, like a question"
            }

        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system
            MessageHandler.messageGenerator.restore();
            MethodsMocks.promise.status = 'resolveIt';
        })


        it('Should get success true when the comment is created successfully ', (done) => {

            createComment(commentRequestData)
                .then(function(response) {
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    // console.log(MessageHandler.messageGenerator);
                    expect(response.success).to.be.true;
                    done()
                });
        });


        it('Should get success false when the comment can not be created', (done) => {

            MethodsMocks.promise.status = 'rejectIt';

            createComment(commentRequestData)
                .then(function(response) {
                    console.log();
                    expect(MessageHandler.messageGenerator).to.have.been.calledTwice;
                    expect(response.success).to.be.false;
                    done()
                });
        });

    });

    describe('#deleteComment', () => {

        let commentRequestData;
        let deleteComment;

        before(() => {
            sinon.spy(MessageHandler, 'errorGenerator');
            sinon.spy(MessageHandler, 'messageGenerator');
        });

        after(() => {
            MessageHandler.errorGenerator.restore();
            MessageHandler.messageGenerator.restore();
        });

        beforeEach(() => {

            deleteComment = CommentComponent('deleteComment');

            // sinon.spy(MessageHandler, 'messageGenerator');
            sandboxComment.stub(Comment, "create").returns(PromiseHandler.resolver(true));


            sinon.stub(Studio, "module").returns(MethodsMocks.StudioModule); // Mocking Studio module system

            commentRequestData = {
                "_id": "8fdcddab-c427-4894-832c-ee1e8c714b71"
            }

        });

        afterEach(() => {
            Studio.module.restore(); // Restoring Studio module system
            // MessageHandler.messageGenerator.restore();
            // MethodsMocks.promise.status = 'resolveIt';
        })



        it('Should get succes true when the comment is deleted successfully', (done) => {

            sandboxComment.stub(Comment, "remove").returns(PromiseHandler.resolver(true));
            deleteComment(commentRequestData)
                .then(function(response) {
                    expect(response).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    expect(response.success).to.be.true;
                    done();
                });

        });

        it('Should get status 500 when the promise its rejected by unhandled error', (done) => {


            sandboxComment.stub(Comment, "remove").returns(PromiseHandler.rejecter(MethodsMocks.UnhandledError));
            deleteComment(commentRequestData)
                .then(function(response) {

                }).catch((err) => {
                    expect(err).to.not.be.undefined;
                    expect(MessageHandler.messageGenerator).to.have.been.called;
                    // expect(err.statusCode).to.be.equals(500);
                    done();
                })

        });

    });
});
