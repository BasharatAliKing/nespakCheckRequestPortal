const mongoose = require("mongoose");
const ncrpBoq = require("../models/ncrpBoqModel");

const {
  deleteImages,
  cleanupUploadedFiles,
  getBoqImages,
  attachImages,
} = require("../services/ncrpBosImageService");

// ======================================================
// COMMON HELPERS
// ======================================================

const isValidId = (id) =>
  typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

const getFiles = (req) => (Array.isArray(req.files) ? req.files : []);

const parseLineItems = (value) => {
  if (typeof value === "string") {
    value = JSON.parse(value);
  }

  if (!Array.isArray(value)) {
    throw new Error("line_item must be an array");
  }

  return value;
};

const validateOptionalId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (!isValidId(value)) {
    throw new Error(`Invalid ${fieldName}`);
  }

  return new mongoose.Types.ObjectId(value);
};

const sendError = (res, error) => {
  console.error("NCRP BOQ Error:", error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "BOQ already exists for this project",
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error instanceof SyntaxError ||
    error.message.startsWith("Invalid ") ||
    error.message === "line_item must be an array"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

// ======================================================
// CREATE BOQ
// ======================================================

const createNcrpBoq = async (req, res) => {
  const files = getFiles(req);

  try {
    const project = req.body.project?.trim();

    if (!project) {
      await cleanupUploadedFiles(files);

      return res.status(400).json({
        success: false,
        message: "Project is required",
      });
    }

    // Validate optional references
    const checkRequestId = validateOptionalId(
      req.body.checkRequestId,
      "checkRequestId",
    );

    const userId = validateOptionalId(req.body.user || req.user?._id, "user");

    // Parse line items
    const lineItems = req.body.line_item
      ? parseLineItems(req.body.line_item)
      : [];

    // Check duplicate project
    const existing = await ncrpBoq.exists({ project });

    if (existing) {
      await cleanupUploadedFiles(files);

      return res.status(409).json({
        success: false,
        message: "BOQ already exists for this project",
      });
    }

    // Attach uploaded images to checklist items
    const preparedLineItems = attachImages(lineItems, files);

    const boq = await ncrpBoq.create({
      project,
      checkRequestId,
      user: userId,
      line_item: preparedLineItems,
    });

    return res.status(201).json({
      success: true,
      message: "BOQ created successfully",
      data: boq,
    });
  } catch (error) {
    await cleanupUploadedFiles(files);
    return sendError(res, error);
  }
};

// ======================================================
// GET ALL BOQS
// ======================================================

const getAllNcrpBoq = async (req, res) => {
  try {
    const data = await ncrpBoq
      .find()
      .populate("checkRequestId")
      .populate("user")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ======================================================
// GET BOQ BY ID
// ======================================================

const getNcrpBoqById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid BOQ ID",
      });
    }

    const data = await ncrpBoq
      .findById(id)
      .populate("checkRequestId")
      .populate("user")
      .lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "BOQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ======================================================
// GET BOQ BY PROJECT
// ======================================================

const getNcrpBoqByProject = async (req, res) => {
  try {
    const project = req.params.project?.trim();

    if (!project) {
      return res.status(400).json({
        success: false,
        message: "Project is required",
      });
    }

    const data = await ncrpBoq
      .findOne({ project })
      .populate("checkRequestId")
      .populate("user")
      .lean();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "BOQ not found for this project",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ======================================================
// UPDATE BOQ
// ======================================================

const updateNcrpBoq = async (req, res) => {
  const files = getFiles(req);

  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      await cleanupUploadedFiles(files);

      return res.status(400).json({
        success: false,
        message: "Invalid BOQ ID",
      });
    }

    const existingBoq = await ncrpBoq.findById(id);

    if (!existingBoq) {
      await cleanupUploadedFiles(files);

      return res.status(404).json({
        success: false,
        message: "BOQ not found",
      });
    }

    const updateData = {};

    // ------------------------------------------
    // UPDATE PROJECT
    // ------------------------------------------

    if (req.body.project !== undefined) {
      const project = req.body.project?.trim();

      if (!project) {
        await cleanupUploadedFiles(files);

        return res.status(400).json({
          success: false,
          message: "Project cannot be empty",
        });
      }

      const duplicate = await ncrpBoq.exists({
        project,
        _id: { $ne: id },
      });

      if (duplicate) {
        await cleanupUploadedFiles(files);

        return res.status(409).json({
          success: false,
          message: "Project already has a BOQ",
        });
      }

      updateData.project = project;
    }

    // ------------------------------------------
    // UPDATE CHECK REQUEST ID
    // ------------------------------------------

    if (req.body.checkRequestId !== undefined) {
      updateData.checkRequestId = validateOptionalId(
        req.body.checkRequestId,
        "checkRequestId",
      );
    }

    // ------------------------------------------
    // UPDATE USER
    // ------------------------------------------

    if (req.body.user !== undefined) {
      updateData.user = validateOptionalId(req.body.user, "user");
    }

    // ------------------------------------------
    // UPDATE LINE ITEMS + IMAGES
    // ------------------------------------------

    let oldImages = [];

    if (req.body.line_item !== undefined) {
      const lineItems = parseLineItems(req.body.line_item);

      // IMPORTANT: Capture old images BEFORE updating.
      oldImages = getBoqImages(existingBoq.toObject().line_item);

      // Attach new images and preserve existing images
      const preparedLineItems = attachImages(
        lineItems,
        files,
        existingBoq.line_item,
      );

      updateData.line_item = preparedLineItems;
    }

    // ------------------------------------------
    // CHECK UPDATE DATA
    // ------------------------------------------

    if (Object.keys(updateData).length === 0) {
      await cleanupUploadedFiles(files);

      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // ------------------------------------------
    // SAVE UPDATED BOQ
    // ------------------------------------------

    Object.assign(existingBoq, updateData);

    const updatedBoq = await existingBoq.save();

    // ------------------------------------------
    // DELETE REMOVED IMAGES
    // ------------------------------------------

    if (req.body.line_item !== undefined) {
      const newImages = getBoqImages(updatedBoq.toObject().line_item);

      const imagesToDelete = oldImages.filter(
        (image) => !newImages.includes(image),
      );

      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
      }
    }

    return res.status(200).json({
      success: true,
      message: "BOQ updated successfully",
      data: updatedBoq,
    });
  } catch (error) {
    await cleanupUploadedFiles(files);
    return sendError(res, error);
  }
};

// ======================================================
// DELETE BOQ
// ======================================================

const deleteNcrpBoq = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid BOQ ID",
      });
    }

    const boq = await ncrpBoq.findById(id);

    if (!boq) {
      return res.status(404).json({
        success: false,
        message: "BOQ not found",
      });
    }

    // Get all images before deleting the record
    const images = getBoqImages(boq.toObject().line_item);

    // Delete database record
    await ncrpBoq.findByIdAndDelete(id);

    // Delete associated images
    if (images.length > 0) {
      await deleteImages(images);
    }

    return res.status(200).json({
      success: true,
      message: "BOQ deleted successfully",
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  createNcrpBoq,
  getAllNcrpBoq,
  getNcrpBoqById,
  getNcrpBoqByProject,
  updateNcrpBoq,
  deleteNcrpBoq,
};
