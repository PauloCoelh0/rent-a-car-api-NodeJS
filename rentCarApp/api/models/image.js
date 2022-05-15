const mongoose =  require('mongoose');

const imageSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },  //Connect this schema with the Car Schema
    carImage: { type:String, required:true }
});

module.exports =  mongoose.model('Image', imageSchema);