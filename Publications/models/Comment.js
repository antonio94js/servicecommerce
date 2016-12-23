import mongoose, {Schema} from 'mongoose';
import moment from 'moment'


const CommentSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    publicationID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: moment(new Date()),
    },
    body: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        ref: "Comment"
    }
});


CommentSchema.set('toObject', {
    virtuals: true
});


export default mongoose.model('Comment', CommentSchema);
