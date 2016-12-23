import {
    UserMock
}
from './Fixtures';
import PromiseHandler from '../Promise';

let NotFound = false;


const DuplicatedError = {
    "code": 11001
};

const headObject = (user, cb) => {
    // console.log("q
    cb(null, {});


}

const headObjectNotFound = (user, cb) => {
    cb({
        'code': 'NotFound'
    }, null);
}

const getSignedUrl = (user, urlParams, cb) => {
    // console.log("super");
    cb(null, 'https://aws.test.com/servicecommerce');
}

const putObject = (user, cb) => {
    // console.log("super");
    cb(null, true);
}

const putObjectError = (user, cb) => {

    cb({}, null);
}

const removeImage = (user, cb) => {

    cb(null, true);
}

const removeImageError = (user, cb) => {

    cb({}, null);
}





export default {
    headObject, headObjectNotFound, getSignedUrl, putObject, putObjectError, removeImage, removeImageError
}
