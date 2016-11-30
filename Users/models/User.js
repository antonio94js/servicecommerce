import mongoose , {Schema} from 'mongoose';
import bcrypt from 'bcrypt';


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

UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();

});

export default mongoose.model('User',UserSchema);
