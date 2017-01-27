import {Router} from 'express';
import oauthRouter from './OauthRouter';
import userRouter from './UserRoutes';
import productRouter from './ProductRouter';
import offerRouter from './OfferRouter';
import wishlistRouter from './WishlistRouter';
import ImageRouter from './ImageRouter';
import PublicationRouter from './PublicationRouter';
import OrderRouter from './OrderRouter';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

router
    .use('/auth', oauthRouter)
    .use('/user', userRouter)
    .use('/product', isAuthenticated, productRouter)
    .use('/product/offer', isAuthenticated, offerRouter)
    .use('/wishlist', isAuthenticated, wishlistRouter)
    .use('/image', isAuthenticated, ImageRouter)
    .use('/publication', isAuthenticated, PublicationRouter)
    .use('/order', OrderRouter);


export default router;
