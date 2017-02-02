import mongoose, {Schema} from 'mongoose';
import moment from 'moment';

const OrderReviewSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    comment: {
        type:String,
        required:true
    },
    sellerID : {
        type:String,
        unique:true,
        required:true
    },
    timeCreated: {
        type:Date,
        default: new Date()
    },
    orderScore: {
        type: Number,
        enum: [1,2,3,4,5],
        required: true,
    },
    order: {
        type:String,
        ref:"Order"
    }

});

OrderReviewSchema.set('toObject', {virtuals: true});

export default mongoose.model('OrderReview', OrderReviewSchema);
