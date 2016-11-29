import User from '../model/user';
import jwtHandler from '../services/TokenService'

const userLogin = (req, res) => {
    console.log(req.body.email);
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        console.log(user);
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            let payload = {
                "id": user._id,
                "UserName": user.user,
            };

            return res.status(200).send({
                token: jwtHandler.generateAccessToken(payload)
            });
        }
    });

    // User.find({},(err,docs) => {
    //     if (err)
    //         console.log("PIPE");
    //     else
    //         console.log(docs);
    //
    //
    // })
};

export default {userLogin}
