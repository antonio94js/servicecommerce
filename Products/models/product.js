import mongoose, {
    Schema
}
from 'mongoose';

const productSchema = new Schema({
    _id: String,
    user: String,
    productdetail: String,
    date: Date,
    status: Number,
    price: Number,
    quantity: Number,
    name: String,
}, {
    collection: 'product'
});


export default mongoose.model('Product', productSchema);
