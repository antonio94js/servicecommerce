import Studio from 'studio';
// import jwtHandler from '../services/TokenService';
import ErrorHandler from '../handler/ErrorHandler';


const PublicationComponent = Studio.module('PublicationComponent'); //Fetching the Publication Microservice

const publicationCreate = (req, res, next) => {

    let createPublication = PublicationComponent('createPublication');
    req.body.userID = req.user.id;

    createPublication(req.body)
        .then((response) => {
            res.status(201).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const publicationUpdate = (req, res, next) => {
    let updatePublication = ProductComponent('updatePublication');
    req.body.userID = req.user.id;
    updateProduct(req.body)
=======
const publicationDelete = (req, res, next) => {

    let deletePublication = PublicationComponent('deletePublication');
    req.body.userID = req.user.id;

    deletePublication(req.body)
>>>>>>> 83a743f19e7f2076eced1d776a5b51a090723c57
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
<<<<<<< HEAD
        });
=======
        })

};


export default {publicationCreate,publicationDelete}
