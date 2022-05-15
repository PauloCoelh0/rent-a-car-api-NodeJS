const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  carType: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  seatingCapacity: { type: Number, required: true },
  numDoors: { type: Number, required: true },
  transmisson: { type: String, required: true, default: "Manual" },
  rentPricePerDay: { type: Number, required: true },
});

module.exports = mongoose.model("Car", carSchema);
