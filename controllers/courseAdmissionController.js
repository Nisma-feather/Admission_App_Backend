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

const getCourseAdmissionsAgg = async (req, res) => {
  try {
    const {
      courseSearch,
      collegeSearch,
      academicYear,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const pipeline = [];

    /* ---------------- Academic Year Filter ---------------- */
    if (academicYear) {
      pipeline.push({ $match: { academicYear } });
    }

    /* ---------------- Lookup Course ---------------- */
    pipeline.push(
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
    );

    /* ---------------- Course Partial Search ---------------- */
    if (courseSearch) {
      pipeline.push({
        $match: {
          $or: [
            { "course.name": { $regex: courseSearch, $options: "i" } },
            {
              "course.specialization": {
                $regex: courseSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    /* ---------------- Lookup College ---------------- */
    pipeline.push(
      {
        $lookup: {
          from: "colleges",
          localField: "college",
          foreignField: "_id",
          as: "college",
        },
      },
      { $unwind: "$college" },
    );

    /* ---------------- College Partial Search ---------------- */
    if (collegeSearch) {
      pipeline.push({
        $match: {
          "college.name": { $regex: collegeSearch, $options: "i" },
        },
      });
    }

    /* ---------------- Facet: Data + Stats ---------------- */
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: Number(limit) },
          {
            $project: {
              academicYear: 1,
              applicationStatus: 1,
              intake: 1,
              admissionWindow:1,
              applicationsReceived: 1,
              createdAt: 1,

              course: {
                _id: "$course._id",
                name: "$course.name",
                specialization: "$course.specialization",
                level: "$course.level",
              },

              college: {
                _id: "$college._id",
                name: "$college.name",
              },
            },
          },
        ],

        stats: [
          {
            $group: {
              _id: null,
              totalAdmissions: { $sum: 1 },
              openAdmissions: {
                $sum: {
                  $cond: [{ $eq: ["$applicationStatus", "OPEN"] }, 1, 0],
                },
              },
              closedAdmissions: {
                $sum: {
                  $cond: [{ $eq: ["$applicationStatus", "CLOSED"] }, 1, 0],
                },
              },
            },
          },
        ],
      },
    });

    const result = await CourseAdmission.aggregate(pipeline);

    const data = result[0]?.data || [];
    const stats = result[0]?.stats[0] || {
      totalAdmissions: 0,
      openAdmissions: 0,
      closedAdmissions: 0,
    };

    return res.json({
      success: true,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: stats.totalAdmissions,
        totalPages: Math.ceil(stats.totalAdmissions / limit),
      },
      stats,
      admissions: data,
    });
  } catch (error) {
    console.error("Aggregation search error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course admissions",
    });
  }
};



module.exports = {
  getUnassignedCourses,
  createCourseAdmission,
  getCourseAdmissionStatus,
  getAcademicAdmissionDetails,
  getCourseAdmissionsAgg,//searching the admisson courses with colleges
  getCoursesByAcademyYear, //getting the cpourses by academic year
};
