const express = require("express");
const router = express.Router();
const {
  createBoq,
  getAllBoqs,
  getBoqById,
  getBoqByProjectId,
  deleteBoqById,
  updateBoqById,
} = require("../controllers/boqController");
const authMiddleware = require("../middleware/authMiddleware");

//************************************************ */
//    CreateBOQ Router Here
//************************************************ */
router.post("/createboq", authMiddleware, createBoq);
//************************************************ */
//    GET All BOQs Router Here
//************************************************ */
router.get("/getallboqs", authMiddleware, getAllBoqs);
//************************************************ */
//    GET  BOQ by id Router Here
//************************************************ */
router.get("/getboqbyid/:id", authMiddleware, getBoqById);
//************************************************ */
//    GET  BOQ by Project id Router Here
//************************************************ */
router.get("/getboqbyprojectid/:projectId", authMiddleware, getBoqByProjectId);
//************************************************ */
//    DELETE  BOQ by id Router Here
//************************************************ */
router.delete("/deleteboq/:id", authMiddleware, deleteBoqById);
//************************************************ */
//    UPDATE  BOQ by id Router Here
//************************************************ */
router.put("/updateboq/:id", authMiddleware, updateBoqById)

module.exports = router;
