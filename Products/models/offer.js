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
    productID: {
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
    __v: {
       type: Number,
       select: false
   }
});

export default mongoose.model('Offer', offerSchema);
