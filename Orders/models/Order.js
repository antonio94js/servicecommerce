import mongoose, {Schema}
from 'mongoose';
import moment from 'moment';

const OrderSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1,
    },
    publicationID: {
        type: String,
        required: true,
    }
});

OrderSchema.set('toObject', {virtuals: true});

export default mongoose.model('Order', OrderSchema);
