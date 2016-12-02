import {Router} from 'express';
import Studio from 'studio';
import UserController from '../controllers/UserController';
import ProductController from '../controllers/ProductController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

const UserComponent = Studio.module('ProductComponent');

/* The Base Path for this router is /user you can see it on index.js */
router.use(isAuthenticated);
router.post('/', ProductController.createProduct);
router.put('/', ProductController.productUpdate);
router.delete('/', ProductController.productDelete);

export default router;
