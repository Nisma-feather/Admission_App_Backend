const College = require("../models/College");
const CourseAdmission = require("../models/CourseAdmission");
const AdmissionApplication = require("../models/AdmissionApplication");


const changeCollegeStatus = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { statusCode } = req.body;
    const updatedData = {};

    // Validate input
    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: "College ID is required",
      });
    }

    if (!statusCode) {
      return res.status(400).json({
        success: false,
        message: "Status code is required",
      });
    }

    // Set updatedData based on statusCode
    switch (statusCode) {
      case "233": // Reject
        updatedData.verificationStatus = "Rejected";
        updatedData.isVerified = false;
        updatedData.rejectedAt = new Date();
        break;

      case "111": // Approve
        updatedData.verificationStatus = "Approved";
        updatedData.isVerified = true;
        updatedData.verifiedAt = new Date();
        break;

      default: // Pending
        updatedData.verificationStatus = "Pending";
        updatedData.isVerified = false;
        break;
    }

    // Update the college
    const collegeData = await College.findByIdAndUpdate(
      collegeId,
      updatedData, // NOT {updatedData}
      { new: true }
    );

    if (!collegeData) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: {
        verificationStatus: collegeData.verificationStatus,
        isVerified: collegeData.isVerified,
        updatedAt: collegeData.updatedAt,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAdminDashboardOverview = async (req, res) => {
  try {
    const { academicYear } = req.query;

    // Dynamic filters
    const courseQuery = {};
    const applicationQuery = {};

    if (academicYear) {
      courseQuery.academicYear = academicYear;
      applicationQuery["courseAdmission.academicYear"] = academicYear; // if stored
    }

    const [totalColleges, totalActiveCourses, totalApplications] =
      await Promise.all([
        College.countDocuments(),
        CourseAdmission.countDocuments(courseQuery),
        AdmissionApplication.countDocuments(applicationQuery),
      ]);

    return res.status(200).json({
      totalColleges,
      totalActiveCourses,
      totalApplications,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Unable to fetch admin dashboard overview",
    });
  }
};


//updating college with images



module.exports={changeCollegeStatus,getAdminDashboardOverview}