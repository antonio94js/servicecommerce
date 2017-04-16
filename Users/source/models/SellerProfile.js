import mongoose, {
    Schema
}
from 'mongoose';
import bcrypt from 'bcryptjs'
import moment from 'moment'

import validator from '../utils/Validator';


const SellerSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: String,
        required: true,
    },
    collectorID: {
        type: String
    },
    mercadoPagoToken: {
        type: String,
    },
    mercadoPagoRefresh: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
    },
    sellerScore: {
        type: Number
    },
    bankAccounts: [{
        type: String,
        ref: "BankAccount"
    }]
});


// UserSchema.set('toObject', { virtuals: true });


export default mongoose.model('SellerProfile', SellerSchema);
