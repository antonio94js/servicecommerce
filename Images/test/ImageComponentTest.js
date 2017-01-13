import sinon from 'sinon';
import Studio from 'studio';
import chai, {expect} from 'chai';
import SinonChai from 'sinon-chai';
import AwsMockSinon from 'mock-aws-sinon';
// import UserService from '../business/UserService';
// import User from '../models/User';
import MessageHandler from '../handler/MessageHandler';

import PromiseHandler from './Promise';
import {UserMock} from './mocks/Fixtures';
import AwsMocks from './mocks/AwsMocks';
import MethodsMocks from './mocks/MethodsMocks';


import aws from 'aws-sdk';


require('../components');


chai.use(SinonChai);

let sandboxImage;

beforeEach(() => {
    sandboxImage = sinon.sandbox.create();
    sandboxImage.stub(aws.S3.prototype, "getSignedUrl", AwsMocks.getSignedUrl);


});

afterEach(() => {
    sandboxImage.restore();

});


describe('#ImageService', () => {

    describe('#When create a new Image', () => {

        let ImageComponent, putObjectImage, RequestPayload;

        beforeEach(() => {
            RequestPayload = {
                "file": 'data:image/png;base64,...'
            }
            ImageComponent = Studio.module('ImageComponent');
            putObjectImage = ImageComponent('putObjectImage');
        });

        afterEach(() => {
            AwsMockSinon('S3', 'putObject').restore();
        })

        it('Should get success true when the request data is valid', (done) => {

            AwsMockSinon('S3', 'putObject', AwsMocks.putObject)

            putObjectImage(RequestPayload)
                .then((response) => {
                    expect(response.success).to.be.ok;
                    expect(response.message).to.be.equals("Image uploaded successfully");
                    expect(AwsMockSinon('S3', 'putObject')).to.have.been.called;

                    done();
                })

        });

        it('Should be rejected with status 400 when the ContentType is invalid', (done) => {
            RequestPayload = {
                "file": 'data:image/pndeg;base64,...'
            }

            putObjectImage(RequestPayload)
                .catch((err) => {
                    // console.log(err);
                    expect(err.statusCode).to.be.equals(400);
                    expect(err.message).to.be.equals("The image's type is not valid");
                    done();
                })

        });

        it('Should be rejected when S3 respond with error', (done) => {
            AwsMockSinon('S3', 'putObject', AwsMocks.putObjectError)

            putObjectImage(RequestPayload)
                .catch((err) => {
                    expect(err).not.to.be.undefined;
                    done();
                })

        });

    });

    describe('#When get an Image', () => {

        let ImageComponent, getObjectImage, RequestPayload;

        beforeEach(() => {
            RequestPayload = {
                ObjectType: 'product',
                ID: 'f880919f-7e50-474a-b90a-0b1fec4819e0',
                userid: '2697bd30-1fbd-4d79-8cc5-26e052141235',
            };
            ImageComponent = Studio.module('ImageComponent');
            getObjectImage = ImageComponent('getObjectImage');
        });

        afterEach(() => {
            AwsMockSinon('S3', 'headObject').restore();
        })

        it('Should be resolved with the SignedURL', (done) => {
            AwsMockSinon('S3', 'headObject', AwsMocks.headObject)

            getObjectImage(RequestPayload)
                .then((response) => {
                    expect(response.success).to.be.ok;
                    expect(response).to.have.ownProperty('SignedURL');

                    done();
                })

        });

        it('Should get success false when the image does not exist ', (done) => {
            AwsMockSinon('S3', 'headObject', AwsMocks.headObjectNotFound);

            getObjectImage(RequestPayload)
                .then((response) => {
                    expect(response.success).to.be.false;
                    expect(response).not.to.have.ownProperty('SignedURL');
                    expect(response.message).to.be.equals('The image does not exist');

                    done();
                })

        });
    });

    describe('#When get Batch Image', () => {

        let ImageComponent, getBatchImage, RequestPayload;

        beforeEach(() => {
            RequestPayload = {
                guids: [{
                    'ObjectType': 'product',
                    'ID': '5d6ff76c-a1d9-47ea-a89d-1959b702859c',
                    'original': '5d6ff76c-a1d9-47ea-a89d-1959b702859c'
                }, {
                    'ObjectType': 'product',
                    'ID': 'd72a2f54-b7b4-4e61-beb1-8cb7c74aceee',
                    'original': 'd72a2f54-b7b4-4e61-beb1-8cb7c74aceee'
                }, {
                    'ObjectType': 'product',
                    'ID': '5ba01a4a-d140-4853-b927-254e9df5813e',
                    'original': '5ba01a4a-d140-4853-b927-254e9df5813e'
                }]
            }
            AwsMockSinon('S3', 'headObject', AwsMocks.headObject)
            ImageComponent = Studio.module('ImageComponent');
            getBatchImage = ImageComponent('getBatchImage');
        });

        afterEach(() => {
            AwsMockSinon('S3', 'headObject').restore();
        })

        it('Should be resolved with Array of SignedURL', (done) => {

            getBatchImage(RequestPayload)
                .then((response) => {
                    expect(response).to.be.instanceof(Array);
                    expect(response).to.have.lengthOf(3);
                    expect(aws.S3.prototype.getSignedUrl).to.have.been.calledThrice;
                    done();
                })

        });

        // it('Should get success false when the image does not exist ', (done) => {
        //     AwsMockSinon('S3', 'headObject', AwsMocks.headObjectNotFound);
        //
        //     getObjectImage(RequestPayload)
        //         .then((response) => {
        //             expect(response.success).to.be.false;
        //             expect(response).not.to.have.ownProperty('SignedURL');
        //             expect(response.message).to.be.equals('The image does not exist');
        //
        //             done();
        //         })
        //
        // });
    });

    describe('#When delete an Image', () => {

        let ImageComponent, deleteObjectImage, RequestPayload;

        beforeEach(() => {
            RequestPayload = {
                ObjectType: 'product',
                ID: 'f880919f-7e50-474a-b90a-0b1fec4819e0'
            }
            ImageComponent = Studio.module('ImageComponent');
            deleteObjectImage = ImageComponent('deleteObjectImage');
        });

        afterEach(() => {
            AwsMockSinon('S3', 'deleteObjects').restore();
        })

        it('Should get success true', (done) => {

            AwsMockSinon('S3', 'deleteObjects', AwsMocks.removeImage)

            deleteObjectImage(RequestPayload)
                .then((response) => {
                    expect(response.success).to.be.ok;
                    expect(response.message).to.be.equals("Image deleted successfully");
                    expect(AwsMockSinon('S3', 'deleteObjects')).to.have.been.called;
                    done();
                })

        });

        it('Should be rejected when S3 respond with error', (done) => {
            AwsMockSinon('S3', 'deleteObjects', AwsMocks.removeImageError)

            deleteObjectImage(RequestPayload)
                .catch((err) => {
                    expect(AwsMockSinon('S3', 'deleteObjects')).to.have.been.called;
                    expect(err).not.to.be.undefined;
                    done();
                })

        });

    });

});
