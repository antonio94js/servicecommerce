import mongoose, {Schema} from 'mongoose';
import validator from '../utils/Validator';

const WishlistSchema = new Schema({
    _id: {
        type: String,
        required: true,

        unique: true
    },
    userID: {
        type: String,
        required: true,
        unique: true
    },
    publications: {
        type: Array,
        "default": []
    },
    __v: {
        type: Number,
        select: false
    }
});

export default mongoose.model('Wishlist', WishlistSchema);
