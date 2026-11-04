
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  createNcrpBoq,
  getAllNcrpBoq,
  getNcrpBoqById,
  getNcrpBoqByProject,
  updateNcrpBoq,
  deleteNcrpBoq,
} = require("../controllers/ncrpBoqController");
const authMiddleware = require("../middleware/authMiddleware");
// Create BOQ
router.post("/ncrpboq",authMiddleware,upload.any(), createNcrpBoq);

// Get all BOQs
router.get("/ncrpboq",authMiddleware, getAllNcrpBoq);

// Get BOQ by project name
router.get("/ncrpboq/project/:project", authMiddleware, getNcrpBoqByProject);

// Get BOQ by MongoDB ID
router.get("/ncrpboq/:id",authMiddleware,getNcrpBoqById);

// Update BOQ by ID
router.put("/ncrpboq/:id",authMiddleware,upload.any(), updateNcrpBoq);

// Delete BOQ by ID
router.delete("/ncrpboq/:id",authMiddleware,deleteNcrpBoq);

module.exports = router;


