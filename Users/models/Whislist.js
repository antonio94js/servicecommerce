import mongoose, {Schema}
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
    }
});
