const AdmissionApplication = require("../models/AdmissionApplication");
const Courses = require("../models/Courses");


const createAdmissionApplication = async (req, res) => {
  try {
    // ✅ Parse JSON fields correctly
    const student = JSON.parse(req.body.student);
    const academicDetails = JSON.parse(req.body.academicDetails);
    const documentsMeta = JSON.parse(req.body.documentsMeta);
    const { course, college } = req.body;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // ✅ Map documents with uploaded files
    const parsedDocumentsData = documentsMeta.map((doc) => {
      const file = files.find(
        (f) => f.originalname === doc.fileName
      );

      if (!file) {
        throw new Error(`File not found for document: ${doc.type}`);
      }

      return {
        type: doc.type,                // "AADHAAR"
        fileName: doc.fileName,        // "aadhar.pdf"
        fileUrl: file.buffer.toString("base64"),
       
      };
    });

    // ✅ Create application
    const newApplication = await AdmissionApplication.create({
      student,
      academicDetails,
      course,
      college,
      documents: parsedDocumentsData,
      status: "SUBMITTED",
      submittedAt: new Date(),
    });

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




const getApplicationsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(403).json({ message: "required field is missing" });
    }

    const isCourseExisting = await Courses.findById(courseId);
    if (!isCourseExisting) {
      return res.status(404).json({ message: "" });
    }
    const applications = await AdmissionApplication.find({ course: courseId });
    return res.status(200).json({ applications });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "Can't able to get the application for the courses",
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
      { new: true }
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




module.exports ={createAdmissionApplication,getApplicationsByCourse,uploadDocuments}