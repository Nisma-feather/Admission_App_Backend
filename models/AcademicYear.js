const mongoose = require('mongoose')

const academicYearSchema = new mongoose.Schema(
  {
    

    label: {
      type: String, // "2024 - 2025"
      required: true,
      unique: true,
    },

    active: {
      type: Boolean,
      default: false,
    },

    
  },
  { timestamps: true },
);

module.exports= mongoose.model("AcademicYear", academicYearSchema);
