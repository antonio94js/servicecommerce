import mongoose, { Schema } from 'mongoose';


// Here, we have a minimalist aproach of our real user model, it's just needed to Authentication test
const userSchema = new Schema({
    _id: String,
    user: String,
    email: String
}, {
    collection: 'user'
});


export default mongoose.model('User', userSchema)
