import mongoose , {Schema} from 'mongoose';

const UserSchema = new Schema({
    _id:{
        type:String,
        required: true,
        unique: true,
    },
    firstname: {
        type:String,
        required: true,
    },
    lastname: {
        type:String,
        required: true,
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    address: {
        type:String,
    }
});

export default mongoose.model('User',UserSchema);
