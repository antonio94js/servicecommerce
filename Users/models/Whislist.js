import mongoose, {
    Schema
}
from 'mongoose';

const WishlistSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    iduser: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: Array,
        "default": []
    },
    __v: {
        type: Number,
        select: false
    }
});

export default mongoose.model('Wishlist', WishlistSchema);
