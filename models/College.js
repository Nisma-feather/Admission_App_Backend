const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String, // AICTE / University code
      unique: true,
      sparse: true,
    },
    type: {
      type: String,
      enum: ["Government", "Private", "Deemed"],
      required: true,
    },
    establishedYear: {
      type: Number,
    },
    affiliatedUniversity: {
      type: String,
    },
    accreditation: {
      naac: {
        type: String, // A+, A, B++, etc.
      },
      nba: {
        type: Boolean,
        default: false,
      },
    },
    // 2️⃣ LOCATION DETAILS (VERY IMPORTANT)
    location: {
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
      area: {
        type: String,
      },
      pincode: {
        type: String,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // 3️⃣ CONTACT INFORMATION
    contact: {
      email: {
        type: String,
        lowercase: true,
      },
      phone: {
        type: String,
      },
      website: {
        type: String,
      },
      address: {
        type: String,
      },
    },

    // 4️⃣ ADMISSION DETAILS
    admission: {
      admissionProcess: {
        type: String,
        enum: ["Merit Based", "Entrance Based", "Both"],
      },
      entranceExams: [String], // TNEA, NEET, CAT, etc.
      applicationStartDate: Date,
      applicationEndDate: Date,
    },

    // 5️⃣ FACILITIES
    facilities: {
      hostel: {
        type: Boolean,
        default: false,
      },
      transport: {
        type: Boolean,
        default: false,
      },
      library: {
        type: Boolean,
        default: true,
      },
      sports: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: false,
      },
      placementCell: {
        type: Boolean,
        default: false,
      },
    },

    // 6️⃣ PLACEMENT DETAILS
    placement: {
      placementPercentage: Number,
      averagePackage: Number,
      highestPackage: Number,
      topRecruiters: [String],
    },

    // 7️⃣ MEDIA
    media: {
      logo: String,
      images: [String],
      brochure: String,
    },

    // 8️⃣ ADMIN / SYSTEM FIELDS
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // or just ["Pending", "Approved", "Rejected"]
      default: "Pending",
    },
    verifiedAt: Date,
    rejectedAt: Date,
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
