import {Router} from 'express';
import oauthRouter from './oauthRouter';
import userRouter from './userRoutes';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

router.use('/auth',oauthRouter);
router.use('/user',userRouter);

router.get('/message',isAuthenticated,function (req,res) {
    res.send("If you are here it's mean you pass the Authentication Middleware first");
})


export default router;
