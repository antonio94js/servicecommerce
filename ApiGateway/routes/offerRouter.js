import {Router} from 'express';
import Studio from 'studio';
import OfferController from '../controllers/OfferController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /user you can see it on index.js */
router.use(isAuthenticated);
router.post('/', OfferController.createOffer);
router.put('/', OfferController.updateOffer);
router.delete('/', OfferController.deleteOffer);
// router.get('/', OfferController.productDetail);

export default router;
