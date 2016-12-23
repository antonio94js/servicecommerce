import {Router} from 'express';
import Studio from 'studio';
import PublicationController from '../controllers/PublicationController';

const router = Router();

/* The Base Path for this router is /user you can see it on index.js */

router.post('/', PublicationController.publicationCreate);
// router.put('/account', isAuthenticated, UserController.userUpdateProfile);
// router.get('/account', isAuthenticated, UserController.getUserProfile);

export default router;
