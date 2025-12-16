const mongoose = require("mongoose");

const searchLocationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      default: "Tamil Nadu",
    },

    district: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    type: {
      type: String, // City / Town / Village
    
    },

    lat: Number,
    lng: Number,

    pincode: String,
  },
  { timestamps: false } 
);

// 🔍 Indexes for search
searchLocationSchema.index({ district: 1 });
searchLocationSchema.index({ city: 1 });
searchLocationSchema.index({ pincode: 1 });

module.exports = mongoose.model("Location", searchLocationSchema);
