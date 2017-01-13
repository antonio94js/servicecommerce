import {
    Router
}
from 'express';
import Studio from 'studio';
import OfferController from '../controllers/OfferController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /product/offer you can see it on index.js */

router
    .post('/', OfferController.createOffer)
    .put('/', OfferController.updateOffer)
    .delete('/', OfferController.deleteOffer);


export default router;
