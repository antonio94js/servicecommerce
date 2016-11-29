import jwtHandler from '../services/TokenService';

const ensureAuthenticated = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({
            "Message": "The Authentication header is missing"
        });
    }

    let [scheme, token] = req.headers.authorization.split(" ");
    // console.log(scheme);
    // console.log(token);

    if (/^Bearer$/i.test(scheme)) {

        jwtHandler.verifyAccessToken(token, (err, decodedToken) => {

            if (err)
                return res.status(401).json({
                    "Message": "The Authentication token is invalid"
                });

            req.user = decodedToken;
            next();

        });
    } else {
        return res.status(401).json({
            err: 'Format is Authorization: Bearer [token]'
        });
    }
};

export default ensureAuthenticated;
