const express = require('express');
const router = express.Router();
const {createContractor, getContractors, getContractorById, deleteContractor, updateContractor} = require('../controllers/contractorController');
const upload = require('../middleware/uploadMiddleware');

router.post('/contractors', upload.single('contractor_logo'), createContractor);
router.get('/contractors', getContractors);
router.get('/contractors/:id', getContractorById);
router.delete('/contractors/:id', deleteContractor);
router.put('/contractors/:id', upload.single('contractor_logo'), updateContractor);

module.exports = router;
