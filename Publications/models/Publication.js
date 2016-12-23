import mongoose, {Schema} from 'mongoose';
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
        default: moment(new Date()),
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    publicationDetail: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    comments: [{
        type: String,
        ref: "Comment"
    }]
});


PublicationSchema.set('toObject', {
    virtuals: true
});


export default mongoose.model('Publication', PublicationSchema);
