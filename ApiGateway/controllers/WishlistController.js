import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';


const WishlistComponent = Studio.module('WishlistComponent'); //Fetching the User Microservice


const addPublication = (req, res, next) => {
    let addPublication = WishlistComponent('addPublication');
    let payload = {
        iduser: req.user.id,

        data: {
            publicationID: req.params.publicationID,
            publicationName: req.body.publicationName
        }

    }

    addPublication(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};

const deletePublication = (req, res, next) => {
    let deletePublication = WishlistComponent('deletePublication');
    let payload = {
        iduser: req.user.id,

        data: {
            publicationID: req.params.publicationID,
            publicationName: req.body.publicationName
        }

    }

    deletePublication(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
            // res.status(500).json(err);
        })

};



export default {
    addPublication,deletePublication
}
