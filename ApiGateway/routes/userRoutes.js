import {Router} from 'express';
import Studio from 'studio';
import UserController from '../controllers/UserController';

const router = Router();

const UserComponent = Studio.module('UserComponent');

/* The Base Path for this router is /user you can see it on index.js */

router.post('/account', UserController.userCreate);
router.put('/account', UserController.userCreate);
router.delete('/account', UserController.userCreate);

export default router;
