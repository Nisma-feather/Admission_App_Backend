const mongoose = require("mongoose");

const APPLICATION_STATUSES = [
  "SUBMITTED",
  "VIEWED",
  "UNDER_REVIEW",
  "SELECTED",
  "WAITLISTED",
  "REJECTED",
  "CANCELLED",
];

const admissionApplicationSchema = new mongoose.Schema(
  {
    // 🔗 Student snapshot
    student: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      dob: Date,
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      address: {
        area: String,
        city: String,
        district: String,
        state: String,
        pincode: String,
      },
    },

    // 🔗 Course references
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    courseAdmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseAdmission",
      required: true,
    },

    // 🎓 Academic details
    academicDetails: [
      {
        qualification: { type: String, required: true },
        boardOrUniversity: { type: String, required: true },
        institution: String,
        passingYear: { type: Number, required: true },
        percentage: Number,
      },
    ],

    // 📄 Documents
    documents: [
      {
        type: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileName: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        verifiedAt: Date,
        remarks: String,
      },
    ],

    // 📌 CURRENT APPLICATION STATUS
    currentStatus: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "SUBMITTED",
      index: true,
    },

    // 🕒 STATUS TRACKING TIMELINE
    statusHistory: [
      {
        status: {
          type: String,
          enum: APPLICATION_STATUSES,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        remarks: String,
      },
    ],

    // 💰 Payment tracking (unchanged)
    payment: {
      totalAmount: Number,
      adminShare: Number,
      collegeShare: Number,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
      paidAt: Date,
    },

    // 📝 Remarks
    studentRemarks: String,
    collegeRemarks: String,
  },
  { timestamps: true }
);

admissionApplicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: "SUBMITTED",
      changedAt: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model(
  "AdmissionApplication",
  admissionApplicationSchema
);


