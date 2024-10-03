const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, //TODO: remember to change this to unique in the collection itself
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  { autoCreate: true }
);

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
