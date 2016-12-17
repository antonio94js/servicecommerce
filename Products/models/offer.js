import mongoose, {
    Schema
}
from 'mongoose';

const offerSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    _idproduct: {
        type: String,
        required: true,
        unique: true,
    },
    start_date: {
        type: Date,
        required: true,
        unique: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, {
    collection: 'offer'
});


export default mongoose.model('Offer', offerSchema);
