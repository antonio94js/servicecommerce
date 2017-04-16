import mongoose, {
    Schema
}
from 'mongoose';
import moment from 'moment'


const PublicationSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
    },
    productID: {
        type: String,
        required: true,
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
    publicationDetail: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['automatic', 'manual', 'both'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    comments: [{
        type: String,
        ref: "Comment"
    }]
});


PublicationSchema.index({name: 'text',tags: 'text'}, {weights: {name: 10,tags: 5},name: "MyTextIndex"})

PublicationSchema.set('toObject', {virtuals: true});


export default mongoose.model('Publication', PublicationSchema);
