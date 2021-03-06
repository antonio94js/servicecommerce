import studio from 'studio';
import _ from 'lodash';
import aws from '../handler/awsHandler';
import ImageService from '../business/ImageService';
import MessagaeHandler from '../handler/MessageHandler'
import ImageMiddleware from '../middleware/ImageMiddleware';
import {registerMicroservice} from '../handler/StopComponentHandler';
import 'babel-polyfill';

// const s3 = new AwsHandler('servicecommerce');

class ImageComponent {

    * putObjectImage(data) {

        let imageData = ImageService.processImage(data);

        if (!imageData) throw MessagaeHandler.errorGenerator("The image's type is not valid", 400);

        let success = yield aws.saveImage(...imageData);

        return MessagaeHandler.messageGenerator('Image uploaded successfully', success);
    }

    getObjectImage(data) {
        // return {SignedURL:'https://mockimageurl.com'
        return aws.getSignedUrl(data);

    }

    * getBatchImage(data) {
        let SignedUrls = [];

        for (const guid of data.guids) {
            let response = yield aws.getSignedUrl(guid);

            if (response && response.success) {
                SignedUrls.push({
                    id: guid.original,
                    SignedUrl: response.SignedURL
                });
            }
        }

        return SignedUrls;


    }

    deleteObjectImage(data) {
        return aws.removeImage(data);
    }
}



let ImageObject = studio.serviceClass(ImageComponent);
// ImageObject.getObjectImage.timeout(50);
if (process.env.NODE_ENV !== 'test') {
    ImageMiddleware.setMiddleware(ImageObject);
    registerMicroservice(ImageObject);

}

/*tomar en cuanta la posibilida de manejar una base de datos para llevar el control de los usuarios y/o productos
junto con el nombre de la imagen que se les fue generado, para poder recueperar la imagen desde aws S3, esto con
el fin principal de lograr  que un producto pueda tener multiples imagenes anidadas*/
