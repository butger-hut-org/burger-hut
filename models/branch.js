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
      unique: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lon: {
        type: Number,
        required: true
      },
    }
  },
  { autoCreate: true }
);

branchSchema.index({ 'location.lat': 1, 'location.lon': 1 }, { unique: true });
const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
