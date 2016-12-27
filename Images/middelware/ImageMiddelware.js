import ImageService from '../business/ImageService';
import MessagaeHandler from '../handler/MessageHandler';
import Common from '../utils/Common';
import studio from 'studio'
import _ from 'lodash';


const ProductComponent = studio.module('ProductComponent'); //Fetching the Product Microservice

/*
This filter / middelware allow us to filter all the bad request model sending to our
ImageMicroservice and also check if the user can do a specific action like upload or delete
a Product image or his own photo
*/

// const ToImprove = () => {
//     for (let property in ImageObject) {
//
//         if (ImageObject.hasOwnProperty(property) && typeof ImageObject[property] === 'function') {
//             setMiddelware();
//         }
//     }
// }

const setMiddelware = (ImageObject) => {
    for (let property in ImageObject) {

        if (ImageObject.hasOwnProperty(property) && typeof ImageObject[property] === 'function') {

            ImageObject[property].filter((data) => { //Setting Studio filter like a middelware

                if (!ImageService.checkObjectType(data.ObjectType)) {
                    throw MessagaeHandler.errorGenerator("The ObjectType is invalid", 400);
                }

                if (data.ObjectType === 'user' && data.ID !== data.userID) {

                    throw MessagaeHandler.errorGenerator("You are not allowed to do this action", 403);
                }

                if (data.ObjectType === 'product' && property !== 'getBatchImage') {
                    // console.log(data.userid);
                    let checkOwnership = ProductComponent('checkOwnership');
                    return checkOwnership({ // return a promise
                            productID: data.ID,
                            userID: data.userID
                        })
                        .then((value) => {
                            data.ID = Common.cryptoID(data.ID, 'encrypt');
                            return true; // resolve the promise with true
                        }).catch((err) => {
                            if (err.statusCode === 400)
                                throw err;
                            else {
                                throw MessagaeHandler.errorGenerator(
                                    "Actualmente no esta disponible este servicio", 500);
                            }
                            //reject the promise with the specific error
                        });
                }


                if (property !== 'getBatchImage') {
                    data.ID = Common.cryptoID(data.ID, 'encrypt');
                } else {
                    data.guids = _.map(data.guids, (guid) => {
                        return {
                            original: guid,
                            ID: Common.cryptoID(guid, 'encrypt'),
                            ObjectType: 'product'
                        }
                    })
                }

                return true;

            });
        }
    }
}

export default {
    setMiddelware
};
