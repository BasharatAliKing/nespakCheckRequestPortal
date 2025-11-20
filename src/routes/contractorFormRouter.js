const express=require('express');
const router=express.Router();
const {
    getContractorkpis,
    getContractorkpisByProject,
    createContractorForm,
    getContractorForms,
    getContractorFormById,
    updateContractorForm,
    deleteContractorForm
}=require('../controllers/contractorFormController');
const authMiddleware=require('../middleware/authMiddleware');

// KPI route must come before :id route to avoid conflicts
router.get('/main-form/contractorkpis',authMiddleware,getContractorkpis);
router.get('/main-form/contractorkpis/:projectId',authMiddleware,getContractorkpisByProject);
// All routes require authentication
router.post('/main-form',authMiddleware,createContractorForm);
router.get('/main-form',authMiddleware,getContractorForms);
router.get('/main-form/:id',authMiddleware,getContractorFormById);
router.put('/main-form/:id',authMiddleware,updateContractorForm);
router.delete('/main-form/:id',authMiddleware,deleteContractorForm);

module.exports=router;