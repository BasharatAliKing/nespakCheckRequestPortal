
const fs = require("fs/promises");
const path = require("path");

const UPLOAD_DIR = path.resolve(
  process.cwd(),
  "uploads"
);

// Return only the filename, never an arbitrary path.
const getFilename = (image) => {
  if (typeof image !== "string" || !image.trim()) {
    return null;
  }

  return path.basename(image);
};

// Delete a single uploaded image.
const deleteImage = async (image) => {
  const filename = getFilename(image);

  if (!filename) return;

  const filePath = path.resolve(
    UPLOAD_DIR,
    filename
  );

  if (path.dirname(filePath) !== UPLOAD_DIR) {
    throw new Error("Invalid image path");
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

// Delete multiple images.
const deleteImages = async (images = []) => {
  const uniqueImages = [
    ...new Set(images.filter(Boolean)),
  ];

  const results = await Promise.allSettled(
    uniqueImages.map(deleteImage)
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Image cleanup failed:",
        result.reason.message
      );
    }
  });
};

// Delete newly uploaded files when DB operation fails.
const cleanupUploadedFiles = async (files = []) => {
  await deleteImages(
    files.map((file) => file.filename)
  );
};

// Extract image filenames from BOQ.
const getBoqImages = (lineItems = []) => {
  return lineItems.flatMap((item) =>
    (item.line_item_checklist || [])
      .map((checklist) => checklist.image)
      .filter(Boolean)
  );
};

// Attach uploaded files to checklist items.
const attachImages = (
  lineItems,
  files,
  existingLineItems = []
) => {
  return lineItems.map((item, itemIndex) => {
    const checklists =
      item.line_item_checklist || [];

    const oldChecklists =
      existingLineItems[itemIndex]
        ?.line_item_checklist || [];

    return {
      ...item,

      line_item_checklist: checklists.map(
        (checklist, checklistIndex) => {
          const fieldName =
            `image_${itemIndex}_${checklistIndex}`;

          const uploadedFile = files.find(
            (file) => file.fieldname === fieldName
          );

          // New image takes priority.
          if (uploadedFile) {
            return {
              ...checklist,
              image: uploadedFile.filename,
            };
          }

          // Explicit null or empty string removes image.
          if (
            checklist.image === null ||
            checklist.image === ""
          ) {
            return {
              ...checklist,
              image: "",
            };
          }

          // Preserve existing image if not replaced.
          const oldImage =
            oldChecklists[checklistIndex]?.image;

          return {
            ...checklist,
            image:
              checklist.image !== undefined
                ? checklist.image
                : oldImage || "",
          };
        }
      ),
    };
  });
};

module.exports = {
  deleteImage,
  deleteImages,
  cleanupUploadedFiles,
  getBoqImages,
  attachImages,
};
