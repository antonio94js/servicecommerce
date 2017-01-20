import studio from 'studio'
import _ from 'lodash';
import ImageService from '../business/ImageService';
import MessageHandler from '../handler/MessageHandler';
import Common from '../utils/Common';


const ProductComponent = studio.module('ProductComponent'); //Fetching the Product Microservice

/*
This filter / middleware allow us to filter all the bad request model sending to our
ImageMicroservice and also check if the user can do a specific action like upload or delete
a Product image or his own photo
*/

// const ToImprove = () => {
//     for (let property in ImageObject) {
//
//         if (ImageObject.hasOwnProperty(property) && typeof ImageObject[property] === 'function') {
//             setMiddleware();
//         }
//     }
// }

const setMiddleware = (ImageObject) => {
    for (let property in ImageObject) {

        if (ImageObject.hasOwnProperty(property) && typeof ImageObject[property] === 'function') {

            // ImageObject[property].timeout(3000); //Setting global timeout for all the service
            // ImageObject[property].retry({max: 3,afterCall:function(options){
            //             console.log(options);
            //         }});

            // console.log(ImageObject[property]);

            // Studio.use(Studio.plugin.retry({max: 3,afterCall:function(options){
            //             console.log("LLAMANDOME");
            //         }}));

            ImageObject[property].filter((requestData) => { //Setting Studio filter like a middleware

                if (!ImageService.checkObjectType(requestData.ObjectType)) {
                    throw MessageHandler.errorGenerator("The ObjectType is invalid", 400);
                }

                if (requestData.ObjectType === 'user' && requestData.ID !== requestData.userID) {

                    throw MessageHandler.errorGenerator("You are not allowed to do this action", 403);
                }

                if (requestData.ObjectType === 'product' && property !== 'getBatchImage') {

                    let checkOwnership = ProductComponent('checkOwnership');
                    return checkOwnership({ // return a promise
                            productID: requestData.ID,
                            userID: requestData.userID
                        })
                        .then((value) => {
                            requestData.ID = Common.cryptoID(requestData.ID, 'encrypt');
                            return true; // resolve the promise with true
                        }).catch((err) => {
                            // console.log(err);
                            if (err.statusCode === 400)
                                throw err;
                            else {
                                throw MessageHandler.errorGenerator("Actually this service is not enabled", 500);
                            }
                            //reject the promise with the specific error
                        });
                }


                if (property !== 'getBatchImage') {
                    requestData.ID = Common.cryptoID(requestData.ID, 'encrypt');
                } else {
                    requestData.guids = _.map(requestData.guids, guid => ({
                        original: guid,
                        ID: Common.cryptoID(guid, 'encrypt'),
                        ObjectType: 'product'
                    }))
                }

                return true;

            });
        }
    }
}

export default {
    setMiddleware
};
