import Studio from 'studio';
import ErrorHandler from '../handler/ErrorHandler';

const OfferComponent = Studio.module('OfferComponent'); //Fetching the Offer Microservice

class OfferController {

    createOffer(req, res, next) {
        let createOffer = OfferComponent('createOffer');
        req.body.userID = req.user.id;

        createOffer(req.body)
            .then((response) => {
                if (response.success) {
                    res.status(201).json(response);
                } else {
                    res.status(200).json(response);
                }

            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

    updateOffer(req, res, next) {
        let updateOffer = OfferComponent('updateOffer');
        req.body.userID = req.user.id;

        updateOffer(req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

    deleteOffer(req, res, next) {
        let deleteOffer = OfferComponent('deleteOffer');
        req.body.userID = req.user.id;
        req.body.productID = req.query.productID;

        deleteOffer(req.body)
            .then((response) => {

                    res.status(200).json(response);


            })
            .catch((err) => {
                ErrorHandler(err, res, req, next);
            });
    }

}

const offerController = new OfferController();

export default offerController;
