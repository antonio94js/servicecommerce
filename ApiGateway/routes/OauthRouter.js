import {Router} from 'express';
import UserController from '../controllers/UserController';

const router = Router();


/* The Base Path for this router is /oauth you can see it on index.js */

router.post('/token', UserController.userLogin);


//TODO refresh token service

// router.post('/token/refresh', UserController.userLogin);
// router.post('/token/reject ', UserController.userLogin);

export default router;
