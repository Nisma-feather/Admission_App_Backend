const mongoose = require("mongoose");

const courseAdmissionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    academicYear: {
      type: String, // "2025-2026"
      required: true,
      index: true,
    },

    applicationStatus: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "CLOSED",
      index: true,
    },

    admissionWindow: {
      startDate: Date,
      endDate: Date,
    },

    intake: Number,
    applicationsReceived: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate admission cycles
// courseAdmissionSchema.index(
//   { course: 1, academicYear: 1 },
//   { unique: true }
// );

module.exports = mongoose.model("CourseAdmission", courseAdmissionSchema);
