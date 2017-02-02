import {
    Router
}
from 'express';
import Studio from 'studio';
import PublicationController from '../controllers/PublicationController';
import CommentController from '../controllers/CommentController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

/* The Base Path for this router is /publication you can see it on index.js */
router
    .get('/search/batch', PublicationController.publicationBatch)
    .get('/search/:publicationID', PublicationController.publicationExpandDetail)
    .get('/batch', isAuthenticated, PublicationController.publicationBatchByOwner)
    .get('/:publicationID',isAuthenticated, PublicationController.publicationDetailByOwner)
    .post('/',isAuthenticated, PublicationController.publicationCreate)
    .post('/comment/',isAuthenticated, CommentController.publicationCreateComment)
    .post('/comment/response',isAuthenticated, CommentController.publicationCreateResponse)
    .put('/',isAuthenticated, PublicationController.publicationUpdate)
    .put('/status/:publicationID/:newStatus',isAuthenticated, PublicationController.publicationChangeStatus)
    .delete('/',isAuthenticated, PublicationController.publicationDelete)
    .delete('/comment/',isAuthenticated, CommentController.publicationDeleteComment);



export default router;
