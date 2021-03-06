import {
    Router
}
from 'express';
import Studio from 'studio';
import UserController from '../controllers/UserController';
import ProductController from '../controllers/ProductController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /product you can see it on index.js */

router
    .get('/', ProductController.productDetail)
    .get('/batch', ProductController.productBatch)
    .post('/', ProductController.createProduct)
    .put('/', ProductController.productUpdate)
    .delete('/', ProductController.productDelete);


export default router;
