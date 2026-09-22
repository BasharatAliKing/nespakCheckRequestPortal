const express = require("express");
const router = express.Router();
const {
  getContractorkpis,
  getContractorkpisByRoleAndId,
  getContractorkpisByProject,
  getContractorFormsByStatus,
  getContractorFormsByStatusRoleuserId,
  getContractorFormsByProjectAndStatus,
  getContractorFormsByProjectAndStatusRoleuserId,
  createContractorForm,
  getContractorForms,
  getContractorFormById,
  updateContractorForm,
  deleteContractorForm,
} = require("../controllers/contractorFormController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadFormMiddleware");
// KPI route must come before :id route to avoid conflicts
router.get("/main-form/contractorkpis", authMiddleware, getContractorkpis);
router.get(
  "/main-form/contractorkpis/:role/:userId",
  authMiddleware,
  getContractorkpisByRoleAndId,
);

router.get(
  "/main-form/contractorkpis/:id",
  authMiddleware,
  getContractorkpisByProject,
);
// status routes
router.get(
  "/main-form/status/:type/:status/",
  authMiddleware,
  getContractorFormsByStatus,
);
router.get(
  "/main-form/status/:type/:status/:role/:userId",
  authMiddleware,
  getContractorFormsByStatusRoleuserId,
);

router.get(
  "/main-form/status/:projectId/:type/:status",
  authMiddleware,
  getContractorFormsByProjectAndStatus,
);
router.get(
  "/main-form/status/:projectId/:type/:status/:role/:userId",
  authMiddleware,
  getContractorFormsByProjectAndStatusRoleuserId,
);

// All routes require authentication
router.post(
  "/main-form",
  authMiddleware,
  upload.array("contractor_attachments", 10),
  createContractorForm,
);
router.get("/main-form", authMiddleware, getContractorForms);
router.get("/main-form/:id", authMiddleware, getContractorFormById);
router.put(
  "/main-form/:id",
  authMiddleware,
  upload.fields([
    {
      name: "contractor_attachments",
      maxCount: 10,
    },
    {
      name: "consultant_attachments",
      maxCount: 10,
    },
    {
      name: "inspector_attachments",
      maxCount: 10,
    },
    {
      name: "surveyor_attachments",
      maxCount: 10,
    },
    {
      name: "me_attachments",
      maxCount: 10,
    },
    {
      name: "are_attachments",
      maxCount: 10,
    },
    {
      name: "re_attachments",
      maxCount: 10,
    },
  ]),
  updateContractorForm,
); 
router.delete("/main-form/:id", authMiddleware, deleteContractorForm);

module.exports = router;