import {Router} from 'express';
import oauthRouter from './OauthRouter';
import userRouter from './UserRoutes';
import productRouter from './ProductRouter';
import offerRouter from './OfferRouter';
import wishlistRouter from './WishlistRouter';
import ImageRouter from './ImageRouter';
import PublicationRouter from './PublicationRouter';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

router.use('/auth',oauthRouter);
router.use('/user',userRouter);
router.use('/product',isAuthenticated, productRouter);
router.use('/product/offer',isAuthenticated,offerRouter);
router.use('/wishlist',isAuthenticated, wishlistRouter);
router.use('/image',isAuthenticated, ImageRouter);
router.use('/publication',isAuthenticated, PublicationRouter);



export default router;
