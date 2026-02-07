const AdmissionApplication = require("../models/AdmissionApplication");
const Courses = require("../models/Courses");
const CourseAdmission = require("../models/CourseAdmission");

const createAdmissionApplication = async (req, res) => {
  try {
    // ✅ Parse JSON fields correctly
    const student = JSON.parse(req.body.student);

    const academicDetails = JSON.parse(req.body.academicDetails);
    const documentsMeta = JSON.parse(req.body.documentsMeta);
    const { course, college, courseAdmission } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // ✅ Map documents with uploaded files
    const parsedDocumentsData = documentsMeta.map((doc) => {
      const file = files.find((f) => f.originalname === doc.fileName);

      if (!file) {
        throw new Error(`File not found for document: ${doc.type}`);
      }

      return {
        type: doc.type, // "AADHAAR"
        fileName: doc.fileName, // "aadhar.pdf"
        fileUrl: file.buffer.toString("base64"),
      };
    });

    // ✅ Create application
    const newApplication = new AdmissionApplication({
      student,
      academicDetails,
      course,
      courseAdmission,
      college,
      documents: parsedDocumentsData,
      status: "SUBMITTED",
      submittedAt: new Date(),
    });

    // ✅ Save to database
    const savedApplication = await newApplication.save();

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: newApplication._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to submit admission application",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    const ALLOWED_STATUSES = [
      "SUBMITTED",
      "VIEWED",
      "UNDER_REVIEW",
      "SELECTED",
      "WAITLISTED",
      "REJECTED",
      "CANCELLED",
    ];

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update = {
      $set: {
        currentStatus: status,
      },
      $push: {
        statusHistory: {
          status,
          changedAt: new Date(),
        },
      },
    };

    const updatedApplication = await AdmissionApplication.findByIdAndUpdate(
      applicationId,
      update,
      { new: true },
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      currentStatus: updatedApplication.currentStatus,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update application status" });
  }
};

const getApplicationsByCourse = async (req, res) => {
  try {
    const { courseAdmissionId } = req.params;
    const { limit = 10, page = 1, search = "" } = req.query;

    const skip = (page - 1) * Number(limit);

    let query = {
      courseAdmission: courseAdmissionId,
    };

    if (search) {
      query.$or = [
        { "student.fullName": { $regex: search, $options: "i" } },
        { "student.email": { $regex: search, $options: "i" } },
        { "student.phone": { $regex: search, $options: "i" } },
      ];
    }

    const totalApplication = await AdmissionApplication.countDocuments(query);

    const applications = await AdmissionApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select(
        "student currentStatus statusHistory createdAt course college academicDetails",
      );

    return res.status(200).json({
      applications,
      totalApplication,
      totalPages: Math.ceil(totalApplication / limit),
      currentPage: Number(page),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Unable to fetch applications",
    });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    // documentsMeta is a JSON string in multipart/form-data
    const documentsMeta = JSON.parse(req.body.documents);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const parsedDocumentsData = documentsMeta.map((doc) => {
      const file = files.find((f) => f.originalname === doc.fileName);

      if (!file) {
        throw new Error(`File not found for ${doc.type}`);
      }

      return {
        type: doc.type, // e.g. "AADHAAR"
        fileName: doc.fileName, // e.g. "aadhar.pdf"
        fileUrl: file.buffer.toString("base64"),
      };
    });

    const application = await AdmissionApplication.findByIdAndUpdate(
      applicationId,
      {
        $set: { documents: parsedDocumentsData },
      },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      message: "Documents uploaded successfully",
      documents: application.documents,
    });
  } catch (error) {
    console.error("Upload documents error:", error);
    return res.status(500).json({
      message: "Failed to upload documents",
      error: error.message,
    });
  }
};

const applicationByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await AdmissionApplication.find({
      "student.userId": userId,
    })
      .select("course college courseAdmission currentStatus createdAt")
      .populate("course", "name degree duration fees")
      .populate("college", "name location logo")
      .populate("courseAdmission", "status")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({ applications });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Unable to fetch user applications" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await AdmissionApplication.findById(applicationId)
      .select("-documents")
      .populate("course", "name specialization")
      .populate("college", "name");
    return res.status(200).json({ application });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Can't able to get the application" });
  }
};

const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    console.log("application Id", applicationId);

    const application = await AdmissionApplication.findById(applicationId)
      .populate("course", "name specialization")
      .populate("college", "name");

    return res.status(200).json({ application });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Can't able to get the application by the data" });
  }
};

const getAllApplication = async (req, res) => {
  try {
    const { academicYear } = req.query;

    const pipeline = [
      // 1️⃣ Join CourseAdmission (for academicYear)
      {
        $lookup: {
          from: "courseadmissions",
          localField: "courseAdmission",
          foreignField: "_id",
          as: "courseAdmission",
        },
      },
      { $unwind: "$courseAdmission" },

      // 2️⃣ Filter by academic year (optional)
      ...(academicYear
        ? [
            {
              $match: {
                "courseAdmission.academicYear": academicYear,
              },
            },
          ]
        : []),

      // 3️⃣ Join Course (USING application.course)
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      // 4️⃣ Join College (USING application.college)
      {
        $lookup: {
          from: "colleges",
          localField: "college",
          foreignField: "_id",
          as: "college",
        },
      },
      { $unwind: "$college" },

      // 5️⃣ Extract last status
      {
        $addFields: {
          lastStatus: { $arrayElemAt: ["$statusHistory", -1] },
        },
      },

      // 6️⃣ Final response shape
      {
        $project: {
          student: {
            fullName: "$student.fullName",
            email: "$student.email",
            phone: "$student.phone",
          },

          academicYear: "$courseAdmission.academicYear",

          courseName: "$course.name",
          collegeName: "$college.name",

          currentStatus: 1,

          lastStatusName: "$lastStatus.status",
          lastStatusAt: "$lastStatus.changedAt",

          paymentStatus: "$payment.status",
          createdAt: 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ];

    const applications = await AdmissionApplication.aggregate(pipeline);

    return res.status(200).json({
      total: applications.length,
      applications,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Can't able to get the applications",
    });
  }
};



module.exports = {
  createAdmissionApplication,
  getApplicationsByCourse,
  uploadDocuments,
  updateApplicationStatus, //to update the status of the application
  applicationByUser, //getting user Application
  getApplicationById,
  getApplicationDetails,
  getAllApplication,
};
