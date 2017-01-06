import {
    Router
}
from 'express';
import Studio from 'studio';
import WishlistController from '../controllers/WishlistController';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

// const UserComponent = Studio.module('UserComponent');

/* The Base Path for this router is /user you can see it on index.js */

router
    .post('/:publicationID', WishlistController.addPublication)
    .delete('/:publicationID', WishlistController.deletePublication);

export default router;
