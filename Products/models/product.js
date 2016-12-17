import mongoose, {
    Schema
}
from 'mongoose';
import moment from 'moment';

const productSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    iduser: {
        type: String,
        required: true,
    },
    productdetail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: moment(new Date()),
    },
    status: {
        type: String,
        enum: ['New', 'Used'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    offer:{
        type: String,
        ref: 'Offer'
    }
});

export default mongoose.model('Product', productSchema);
