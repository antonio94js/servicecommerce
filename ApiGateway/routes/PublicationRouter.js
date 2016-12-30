import {Router} from 'express';
import Studio from 'studio';
import PublicationController from '../controllers/PublicationController';

const router = Router();

/* The Base Path for this router is /publication you can see it on index.js */

router.get('/:publicationID', PublicationController.publicationDetail);
router.post('/', PublicationController.publicationCreate);
router.post('/comment/', PublicationController.publicationCreateComment);
router.post('/comment/response', PublicationController.publicationCreateResponse);
router.put('/', PublicationController.publicationUpdate);
router.delete('/', PublicationController.publicationDelete);
router.delete('/comment/', PublicationController.publicationDeleteComment);



export default router;
