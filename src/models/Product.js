const mongoose = require('mongoose');
const {Schema} = mongoose;

const ProductSchema = new Schema({
    name:{type:String, required:true},
    amount:{type:String, required:true},
    price:{type:String, required:true},
    description:{type:String, required:true},
    image:{type:String, required:true}
});

module.exports = mongoose.model('Product', ProductSchema)