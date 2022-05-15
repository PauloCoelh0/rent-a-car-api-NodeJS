const mongoose = require("mongoose");
const Joi = require("joi");

const Car = require("./car");

const rentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  collectDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  // rentPrice: { type: Number, min: 0}  // FUTURE
});

// FUTURE IDEIAS

// rentSchema.statics.lookup = function(carId) {
//     return this.findOne({
//         'car._id': carId,
//         returnDate: undefined
//     });
// };

// rentSchema.methods.return =  function() {
//     this.returnDate = new Date();

//     const rentDays = moment().diff(this.collectDate, 'days');
//     this.rentPrice = rentDays * this.car.rentPricePerDay;
// };

module.exports = mongoose.model("Rent", rentSchema);
