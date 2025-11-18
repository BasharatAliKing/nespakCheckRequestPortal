const express = require('express');
const router = express.Router();
const {createConsultant, getConsultants, getConsultantById, deleteConsultant, updateConsultant} = require('../controllers/consultantController');
const upload = require('../middleware/uploadMiddleware');

router.post('/consultants', upload.single('consultant_logo'), createConsultant);
router.get('/consultants', getConsultants);
router.get('/consultants/:id', getConsultantById);
router.delete('/consultants/:id', deleteConsultant);
router.put('/consultants/:id', upload.single('consultant_logo'), updateConsultant);

module.exports = router;
