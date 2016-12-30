import {Router} from 'express';
import ImageController from '../controllers/ImageController';

const router = Router();

/* The Base Path for this router is /image you can see it on index.js */

router.get('/:ObjectType/:ID',ImageController.getImage);
router.post('/detail/:ObjectType/:ID', ImageController.saveImage);
router.post('/batch/:ObjectType/',ImageController.getBatchImage);
router.delete('/:ObjectType/:ID',  ImageController.deleteImage);

export default router;
