const College = require("../models/College");
const Media = require("../models/Media");

const storeMediaCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No media files uploaded" });
    }

    const mediaDocs = await Promise.all(
      req.files.map((file) => {
        return Media.create({
          college: collegeId,
          url: file.buffer.toString("base64"), // ⚠️ not recommended
          filename: file.originalname,
        });
      }),
    );

    return res.status(201).json({
      message: "Media uploaded successfully",
      media: mediaDocs,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Can't store the media",
    });
  }
};

const getMediaofCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { limit = 5, page = 1 } = req.query;

    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;

    const collegeExists = await College.findById(collegeId);
    if (!collegeExists) {
      return res.status(404).json({
        message: "College not found"
      });
    }

    const totalImages = await Media.countDocuments({ college: collegeId });

    const media = await Media.find({ college: collegeId })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      media,
      totalImages,
      totalPages: Math.ceil(totalImages / limitNum),
      currentPage: pageNum
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Unable to get media images"
    });
  }
};

// controllers/mediaController.js
const deleteMultipleMedia = async (req, res) => {
  try {
    const { mediaIds } = req.body; // array of Media _id

    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({
        message: "mediaIds array is required",
      });
    }

    const result = await Media.deleteMany({
      _id: { $in: mediaIds },
    });

    return res.status(200).json({
      message: "Media deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete media error:", error);
    res.status(500).json({
      message: "Failed to delete media",
      error: error.message,
    });
  }
};




module.exports = { storeMediaCollege,getMediaofCollege};
