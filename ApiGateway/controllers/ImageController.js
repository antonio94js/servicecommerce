import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const ImageComponent = Studio.module('ImageComponent'); //Fetching the Image Microservice

class ImageController {

    saveImage(req, res, next) {
        let putObjectImage = ImageComponent('putObjectImage');
        let imageData = {
            'ObjectType': req.params.ObjectType,
            'ID': req.params.ID,
            'userID': req.user.id,
            'file': req.body.file
        };

        putObjectImage(imageData)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

    getImage(req, res, next) {
        let getObjectImage = ImageComponent('getObjectImage');
        let imageData = {
            'ObjectType': req.params.ObjectType,
            'ID': req.params.ID,
            'userID': req.user.id,
        };

        getObjectImage(imageData)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

    getBatchImage(req, res, next) {
        let getBatchImage = ImageComponent('getBatchImage');
        let imageData = {
            'ObjectType': req.params.ObjectType,
            'guids':req.body.guids
        };

        getBatchImage(imageData)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

    deleteImage(req, res, next){
        let deleteObjectImage = ImageComponent('deleteObjectImage');
        let imageData = {
            'ObjectType': req.params.ObjectType,
            'ID': req.params.ID,
            'userID': req.user.id
        };

        deleteObjectImage(imageData)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }
}

const imageController = new ImageController();

export default imageController;
