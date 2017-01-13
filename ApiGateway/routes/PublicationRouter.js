import {
    Router
}
from 'express';
import Studio from 'studio';
import PublicationController from '../controllers/PublicationController';
import CommentController from '../controllers/CommentController';

const router = Router();

/* The Base Path for this router is /publication you can see it on index.js */
router
    .get('/batch', PublicationController.publicationBatch)
    .get('/:publicationID', PublicationController.publicationDetail)
    .post('/', PublicationController.publicationCreate)
    .post('/comment/', CommentController.publicationCreateComment)
    .post('/comment/response', CommentController.publicationCreateResponse)
    .put('/', PublicationController.publicationUpdate)
    .delete('/', PublicationController.publicationDelete)
    .delete('/comment/', CommentController.publicationDeleteComment);



export default router;
