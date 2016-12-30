import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const WishlistComponent = Studio.module('WishlistComponent'); //Fetching the Wishlist Microservice


const addPublication = (req, res, next) => {

    let addPublication = WishlistComponent('addPublication');
    let payload = {
        'userID': req.user.id,
        'data': {
            publicationID: req.params.publicationID,
            publicationName: req.body.publicationName
        }
    };

    addPublication(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};

const deletePublication = (req, res, next) => {

    let deletePublication = WishlistComponent('deletePublication');
    let payload = {
        'userID': req.user.id,
        'data': {
            publicationID: req.params.publicationID,
            publicationName: req.body.publicationName
        }
    };

    deletePublication(payload)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            ErrorHandler(err, res, next);
        })

};



export default {
    addPublication,deletePublication
}
