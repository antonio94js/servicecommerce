import {Router}
from 'express';
import Studio from 'studio';
import OrderController from '../controllers/OrderController';

const router = Router();

/* The Base Path for this router is /order you can see it on index.js */

router
    .post('/notification', OrderController.getMPNotification)
    .post('/',OrderController.pay);

export default router;
