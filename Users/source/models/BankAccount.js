import mongoose, {
    Schema
}
from 'mongoose';
import bcrypt from 'bcryptjs'
import moment from 'moment'

import validator from '../utils/Validator';


const BankSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    ownerAccountName: {
        type: String,
        required: true,
    },
    refOwnerIdentity: {
        type: String,
        required: true,
    },
    typeOwnerIdentity: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
    },

});


// UserSchema.set('toObject', { virtuals: true });


export default mongoose.model('BankAccount', BankSchema);
