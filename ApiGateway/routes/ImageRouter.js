import {Router} from 'express';
import ImageController from '../controllers/ImageController';

const router = Router();

/* The Base Path for this router is /image you can see it on index.js */

router
    .get('/:ObjectType/:ID', ImageController.getImage)
    .post('/detail/:ObjectType/:ID', ImageController.saveImage)
    .post('/batch/:ObjectType/', ImageController.getBatchImage)
    .delete('/:ObjectType/:ID', ImageController.deleteImage);

export default router;
