import aws from 'aws-sdk';
import Promise from 'bluebird';
import MessageHanlder from '../handler/MessageHandler';
import Common from '../utils/Common';

const BUCKET_NAME = 'servicecommerce';
const s3 = new aws.S3({
    params: {
        Bucket: BUCKET_NAME
    }
});

const saveImage = (mimeType, fileBuffer, ImageData) => {

    let data = {
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: `${ImageData.ObjectType}/${ImageData.ID}`,
        Body: fileBuffer,
        ContentEncoding: 'base64',
        ContentType: mimeType
    }

    // console.log(`${ImageData.ObjectType}/${ImageData.ID}`);

    return new Promise(function(resolve, reject) {
        s3.putObject(data, function(err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });


};

const getSignedUrl = (data) => {

    let urlParams = {
        Bucket: BUCKET_NAME,
        Key: `${data.ObjectType}/${data.ID}`
    };

    // console.log(`${data.ObjectType}/${data.ID}`);

    return new Promise((resolve, reject) => {

        s3.headObject(urlParams, function(err, data) {
            if (err && err.code === 'NotFound') {
                resolve(MessageHanlder.messageGenerator("The image does not exist", false))
            }
            else {
                urlParams.Expires = 43200; //Expires in 12 hours
                s3.getSignedUrl('getObject', urlParams, function(err, url) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(MessageHanlder.messageGenerator(url, true, 'SignedURL'))
                    }
                })
            }
        });

    });
}

const removeImage = (data) => {

    let params = {
        Bucket: BUCKET_NAME,
        Delete: {
            Objects: [{
                Key: `${data.ObjectType}/${data.ID}`
            }]
        }
    };
    // return true;

    return new Promise((resolve, reject) => {
        s3.deleteObjects(params, function(err, data) {
            if (err) reject(err);
            else resolve(MessageHanlder.messageGenerator('Image deleted successfully', true));
        });
    });

}



export default {
    saveImage, getSignedUrl, removeImage
}
