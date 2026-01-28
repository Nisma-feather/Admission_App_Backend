const CourseAdmission = require("../models/CourseAdmission");
const Course = require("../models/Courses");

const createCourseAdmission = async (req, res) => {
  try {
    const { collegeId, courseId } = req.params;

    if (!collegeId || !courseId) {
      return res.status(400).json({
        message: "collegeId and courseId are required",
      });
    }

    const {
      academicYear,
      admissionWindow,
      intake,
      fees,
      applicationStatus,
      applicationDetails,
    } = req.body;

    // Basic validation
    if (!academicYear) {
      return res.status(400).json({ message: "Academic year is required" });
    }

    if (!admissionWindow?.startDate || !admissionWindow?.endDate) {
      return res.status(400).json({
        message: "Admission start and end dates are required",
      });
    }

    const newAdmissionCourse = await CourseAdmission.create({
      course: courseId,
      college: collegeId,
      academicYear,
      admissionWindow,
      intake,
      fees,
      applicationStatus: "OPEN", // optional (OPEN / CLOSED)
      applicationDetails,
    });

    return res.status(201).json({
      message: "Course admission created successfully",
      data: newAdmissionCourse,
    });
  } catch (e) {
    console.error(e);

    // Duplicate academic year for same course
    if (e.code === 11000) {
      return res.status(409).json({
        message: "Admission already exists for this course and academic year",
      });
    }

    return res.status(500).json({
      message: "Unable to create course admission",
    });
  }
};

const getUnassignedCourses = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { academicYear } = req.query;

    if (!academicYear) {
      return res.status(400).json({
        message: "Academic year is required",
      });
    }
    const admissions = await CourseAdmission.find(
      {
        college: collegeId,
        academicYear,
      },
      {
        course: 1,
      },
    );
    const admittedCourseIds = admissions.map((admission) => admission.course);
    const availableCourses = await Course.find({
      college: collegeId,
      isActive: true,
      _id: { $nin: admittedCourseIds },
    }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ count: availableCourses.length, availableCourses });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({
        message: "Can't able to get the unassigned courses for the year",
      });
  }
};

const getCourseAdmissionStatus = async (req, res) => {
  const { courseId } = req.params;
  console.log("Course ID", courseId);
  const { academicYear } = req.query;

  const admission = await CourseAdmission.findOne({
    course: courseId,
    academicYear,
    applicationStatus: "OPEN",
  });

  return res.status(200).json({
    isOpen: !!admission,
    admission,
  });
};
//get the details by Id
const getAcademicAdmissionDetails = async (req, res) => {
  try {
    const { courseAdmissionId } = req.params;
    const courseAdmissionExists =
      await CourseAdmission.findById(courseAdmissionId)

    if (!courseAdmissionExists) {
      return res.status(404).json({ message: "course admission not present" });
    }
    return res.status(200).json({ courseAdmission: courseAdmissionExists });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Can't able to get the academic admission details" });
  }
};

const getCoursesByAcademyYear = async (req, res) => {
  try {
    const { academicYear, collegeId } = req.query;

    const query = {};

    if (academicYear) {
      query.academicYear = academicYear;
    }

    if (collegeId) {
      query.college = collegeId;
    }

    const activeApplication = await CourseAdmission.countDocuments({
      ...query,
      applicationStatus: "OPEN",
    });
    const inActiveApplication = await CourseAdmission.countDocuments({
      ...query,
      applicationStatus: "CLOSED",
    });
    const courseAdmission = await CourseAdmission.find(query)
      .select(
        "academicYear course admissionWindow applicationStatus intake updatedAt",
      )
      .populate("course", "name specialization");;

    return res
      .status(200)
      .json({total:courseAdmission?.length || 0 ,activeApplication, inActiveApplication, courseAdmission });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Can't able to get the course admission" });
  }
};

module.exports = {
  getUnassignedCourses,
  createCourseAdmission,
  getCourseAdmissionStatus,
  getAcademicAdmissionDetails,
  getCoursesByAcademyYear, //getting the cpourses by academic year
};
