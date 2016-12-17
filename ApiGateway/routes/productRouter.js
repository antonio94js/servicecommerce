import {Router} from 'express';
import Studio from 'studio';
import UserController from '../controllers/UserController';
import ProductController from '../controllers/ProductController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /product you can see it on index.js */
router.post('/', ProductController.createProduct);
router.put('/', ProductController.productUpdate);
router.delete('/', ProductController.productDelete);
router.get('/', ProductController.productDetail);
router.get('/batch', ProductController.productBatch);

export default router;
