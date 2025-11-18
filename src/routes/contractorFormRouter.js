const express=require('express');
const router=express.Router();
const {
    createContractorForm,
    getContractorForms,
    getContractorFormById,
    updateContractorForm,
    deleteContractorForm
}=require('../controllers/contractorFormController');
const authMiddleware=require('../middleware/authMiddleware');

// All routes require authentication
router.post('/main-form',authMiddleware,createContractorForm);
router.get('/main-form',authMiddleware,getContractorForms);
router.get('/main-form/:id',authMiddleware,getContractorFormById);
router.put('/main-form/:id',authMiddleware,updateContractorForm);
router.delete('/main-form/:id',authMiddleware,deleteContractorForm);

module.exports=router;