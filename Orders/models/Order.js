import mongoose, {Schema}
from 'mongoose';
import moment from 'moment';

const OrderSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    timeCreated: {
        type: Date,
        default: Date.now(),
    },
    timePayed: {
        type: Date,
    },
    status: {
        type: string,
        enum: ['inprocess', 'processed','cancelled','finished'],
        default: 'inprocess',
    },
    sellerID: {
        type: String,
        required: true,
    },
    buyerID: {
        type: String,
        required: true,
    },
    productQuantity: {
        type: number,
        required: true,
    },
    totalPrice: {
        type: number,
        required: true,
    },
    unitPrice: {
        type: number,
        required: true,
    },
    publicationName: {
        type: String,
        required: true,
    },
    paymentOrderType: {
        type: String,
        enum: ['automatic', 'manual'],
        required: true,
    },
    paymentLink: {
        type: String,
    }
});

OrderSchema.set('toObject', {virtuals: true});

export default mongoose.model('Order', OrderSchema);
