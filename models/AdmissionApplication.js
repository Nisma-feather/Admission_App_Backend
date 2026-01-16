const mongoose = require("mongoose");

const admissionApplicationSchema = new mongoose.Schema(
  {
    // 🔗 References
    student: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      dob: Date,

      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },

      address: {
        area: String,
        city: String,
        district: String,
        state: String,
        pincode: String,
      },
    },

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
    courseAdmission:{
   type:mongoose.Schema.Types.ObjectId,
    ref:"CourseAdmission",
    required:true
    },

    // 🎓 Academic details
    academicDetails: [
      {
        qualification: {
          type: String,
          enum: ["10th", "12th", "Diploma", "UG", "PG"],
          required: true,
        },

        boardOrUniversity: {
          type: String,
          required: true,
        },

        institution: String,

        passingYear: {
          type: Number,
          required: true,
        },

        percentage: Number,

      },
    ],

    // 📄 Uploaded documents (dynamic per course)
    documents: [
      {
        type: {
          type: String, // must match Course.requiredCertifications.type
          required: true,
        },

        fileUrl: {
          type: String,
          required: true,
        },
        fileName:{
          type:String,
          required:true,
        },

        verified: {
          type: Boolean,
          default: false,
        },

        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        verifiedAt: Date,

        remarks: String,
      },
    ],

    // 📌 Application status
    status: {
      type: String,
      enum: [
        "DRAFT", // saved but not submitted
        "SUBMITTED", // student submitted
        "UNDER_REVIEW", // college reviewing
        "DOCUMENT_REJECTED", // missing / wrong documents
        "APPROVED", // eligible to pay
        "PAYMENT_PENDING",
        "PAID",
        "REJECTED",
      ],
      default: "SUBMITTED",
      index: true,
    },

    // 💰 Payment tracking
    payment: {
      totalAmount: Number,

      adminShare: Number, // eg: 10000
      collegeShare: Number, // eg: 40000

      razorpayOrderId: String,
      razorpayPaymentId: String,

      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },

      paidAt: Date,
    },

    // 📝 Optional notes
    studentRemarks: String,
    collegeRemarks: String,
  },
  { timestamps: true }
);

//
// 🔒 Prevent duplicate applications for same course
//
// admissionApplicationSchema.index(
//   { "student.userId": 1, course: 1 },
//   { unique: true }
// );

module.exports = mongoose.model(
  "AdmissionApplication",
  admissionApplicationSchema
);
