import ImageService from '../business/ImageService';
import MessagaeHandler from '../handler/MessageGenerator';
import Common from '../utils/Common';
import studio from 'studio'


const ProductComponent = studio.module('ProductComponent'); //Fetching the Image Microservice

const setServiceFilter = (ImageObject) => {
    for (let property in ImageObject) {

        if (ImageObject.hasOwnProperty(property) && typeof ImageObject[property] === 'function') {

            ImageObject[property].filter((data) => {

                if (!ImageService.checkObjectType(data.ObjectType)) {
                    throw MessagaeHandler.errorGenerator("The ObjectType is invalid", 400);
                }

                if(data.ObjectType === 'user' && data.ID !== data.userid ){
                    throw MessagaeHandler.errorGenerator("You are not allowed to do this action", 403);
                }

                if(data.ObjectType === 'product' ){
                    let checkOwnership = ProductComponent('checkOwnership');
                    // console.log(data.ID);
                    // console.log(data.userid);
                    return checkOwnership({idproduct:data.ID,iduser:data.userid}).then((value) => {
                        return true;
                    }).catch((err) => {
                        throw MessagaeHandler.errorGenerator("You don't have enought permission to do this action", 403);
                    })

                }

                data.ID = Common.cryptoID(data.ID, 'encrypt');
                return true;

            })
        }
    }
}

export default setServiceFilter;
