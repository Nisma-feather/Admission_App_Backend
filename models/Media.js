const mongoose = require('mongoose');



const mediaSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Media", mediaSchema);


