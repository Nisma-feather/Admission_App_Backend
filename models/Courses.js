const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // 🔗 College reference
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    // 📘 Display name (short)
    name: {
      type: String,
      required: true,
      trim: true,
      example: "B.Tech IT",
    },

    // 🎓 Full degree name
    degree: {
      type: String,
      required: true,
      trim: true,
      example: "Bachelor of Technology",
      index: true,
    },

    level: {
      type: String,
      enum: ["UG", "PG", "Diploma", "PhD"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "Engineering",
        "Medical & Paramedical",
        "Arts & Science",
        "Engineering & Technology",
        "Law",
        "Education & Teaching",
        "Diploma",
        "Architecture",
        "Agriculture",
        "Hotel Management",
        "Media & Communication",
        "Aviation",
        "Sports Science",
      ],
      required: true,
      index: true,
    },

    specialization: {
      type: String,
      required: true,
      index: true,
      example: "Information Technology",
    },

    duration: {
      type: Number,
      required: true,
    },

    fees: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
    },

    intake: Number,
    eligibility: String,
    entranceExams: [String],
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

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);



// UNIQUE INDEX
// Prevents duplicate courses in the same college



courseSchema.index({ college: 1, name: 1, level: 1 }, { unique: true });

//
//  FILTER & SEARCH INDEX
// Used for listing, search, and filters
//
courseSchema.index({
  category: 1,
  specialization: 1,
  level: 1,
  isActive: 1,
});

module.exports = mongoose.model("Course", courseSchema);
