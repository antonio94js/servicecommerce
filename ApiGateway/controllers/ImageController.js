import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler'


const ImageComponent = Studio.module('ImageComponent'); //Fetching the Image Microservice


const saveImage = (req, res, next) => {

    let putObjectImage = ImageComponent('putObjectImage');
    let payload = {
        ObjectType: req.params.ObjectType,
        ID: req.params.ID,
        userid: req.user.id,
        file: req.body.file
    };

    // console.log("calling");

    putObjectImage(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const getImage = (req, res, next) => {

    let getObjectImage = ImageComponent('getObjectImage');
    let payload = {
        ObjectType: req.params.ObjectType,
        ID: req.params.ID,
        userid: req.user.id,
    };

    getObjectImage(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const getBatchImage = (req, res, next) => {

    let getBatchImage = ImageComponent('getBatchImage');
    // console.log("lca");
    // console.log(req.params.ObjectType);
    let payload = {
        ObjectType: req.params.ObjectType,
        guids:req.body.guids
    };
    // console.log(payload);

    getBatchImage(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};

const deleteImage = (req, res, next) => {

    let deleteObjectImage = ImageComponent('deleteObjectImage');
    let payload = {
        ObjectType: req.params.ObjectType,
        ID: req.params.ID,
        userid: req.user.id
    }

    deleteObjectImage(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        });

};



export default {saveImage, getImage, deleteImage,getBatchImage}
