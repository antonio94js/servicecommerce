import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs'
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
    },
    wishlist: {
        type: String,
        ref: 'Wishlist'

    }
});

UserSchema.pre('save', function(next) {

    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });

});

// UserSchema.set('toObject', { virtuals: true });


export default mongoose.model('User', UserSchema);
