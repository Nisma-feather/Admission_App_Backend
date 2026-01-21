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

    // 💰 Admission-related fees
    fees: {
      applicationFee: {
        amount: Number,
        currency: { type: String, default: "INR" },
      },

      admissionFee: {
        amount: Number, // seat booking fee
        currency: { type: String, default: "INR" },
      },
    },

    applicationDetails: {
      requiredCertifications: [
        {
          type: String,
          enum: [
            "10TH_MARKSHEET",
            "12TH_MARKSHEET",
            "DIPLOMA_CERTIFICATE",
            "UG_CERTIFICATE",
            "ENTRANCE_SCORECARD",
            "TRANSFER_CERTIFICATE",
            "COMMUNITY_CERTIFICATE",
            "INCOME_CERTIFICATE",
            "AADHAAR",
            "PASSPORT_PHOTO",
          ],
        },
      ],
      requiredDetails: [
        {
          type: String,
          enum: [
            "10TH_DETAILS",
            "12TH_DETAILS",
            "DIPLOMA_DETAILS",
            "UG_DETAILS",
            "ENTRANCE_TEST_DETAILS",
          ],
        },
      ],
    },
  },
  { timestamps: true },
);

// ❌ Prevent duplicate admission cycle per year
courseAdmissionSchema.index({ course: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model("CourseAdmission", courseAdmissionSchema);
