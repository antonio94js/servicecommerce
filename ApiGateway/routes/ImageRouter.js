import {Router} from 'express';
import ImageController from '../controllers/ImageController';

const router = Router();
router.post('/detail/:ObjectType/:ID', ImageController.saveImage);
router.get('/:ObjectType/:ID',ImageController.getImage);
router.post('/batch/:ObjectType/',ImageController.getBatchImage);
// router.put('/:ObjectType/:ID',  ImageController.userUpdateProfile);
router.delete('/:ObjectType/:ID',  ImageController.deleteImage);

export default router;
