import {Router}
from 'express';
import Studio from 'studio';
import OrderController from '../controllers/OrderController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /order you can see it on index.js */

router
    .post('/notification', OrderController.getMPNotification)
    .post('/:orderID/review',isAuthenticated, OrderController.creteaOrderReview)
    .put('/status',isAuthenticated,OrderController.changeOrderStatus)
    .get('/batch',isAuthenticated,OrderController.getOrdersBatch)
    .post('/',isAuthenticated,OrderController.pay)

export default router;
