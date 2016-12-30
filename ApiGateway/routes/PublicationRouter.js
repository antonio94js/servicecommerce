import {Router} from 'express';
import Studio from 'studio';
import PublicationController from '../controllers/PublicationController';
import CommentController from '../controllers/CommentController';

const router = Router();

/* The Base Path for this router is /publication you can see it on index.js */

router.get('/:publicationID', PublicationController.publicationDetail);
router.post('/', PublicationController.publicationCreate);
router.post('/comment/', CommentController.publicationCreateComment);
router.post('/comment/response', CommentController.publicationCreateResponse);
router.put('/', PublicationController.publicationUpdate);
router.delete('/', PublicationController.publicationDelete);
router.delete('/comment/', CommentController.publicationDeleteComment);



export default router;
