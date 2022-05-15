const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let RoleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: { type: String, required: true },
  //scopes: { type: String, enum: [scopes["ADMIN"], scopes["EMPLOYEE"], scopes["CLIENT"]]}
});

const userSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  role: { type: RoleSchema, required: true, default: { role: "CLIENT" } },
});

module.exports = mongoose.model("User", userSchema);

let User = mongoose.model("User", userSchema);

module.exports = User;
