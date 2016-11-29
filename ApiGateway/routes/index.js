import {Router} from 'express';
import oauthRouter from './oauthRouter';
import isAuthenticated from '../policies/isAuthenticated';

const router = Router();

router.use('/auth',oauthRouter);

router.get('/message',isAuthenticated,function (req,res) {
    res.send("If you are here it's mean you pass the Authentication Middleware first");
})


export default router;
