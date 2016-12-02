import mongoose, {
    Schema
}
from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment'


const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    }
});

UserSchema.pre('save', function(next) {

    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });

    // this.password = bcrypt.hashSync(this.password, 10);

});


export default mongoose.model('User', UserSchema);
