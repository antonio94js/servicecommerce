import {Router} from 'express';
import ImageController from '../controllers/ImageController';

const router = Router();

/* The Base Path for this router is /image you can see it on index.js */

router
    .get('/:ObjectType/:ID', ImageController.getImage)
    //  .post('/batch/:ObjectType/', ImageController.getBatchImage)
    .post('/:ObjectType/:ID', ImageController.saveImage)
    .delete('/:ObjectType/:ID', ImageController.deleteImage);

export default router;
