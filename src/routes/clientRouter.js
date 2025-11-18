const express = require('express');
const router = express.Router();
const {createClient, getClients, getClientById, deleteClient, updateClient} = require('../controllers/clientController');
const upload = require('../middleware/uploadMiddleware');

router.post('/clients', upload.single('client_logo'), createClient);
router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.delete('/clients/:id', deleteClient);
router.put('/clients/:id', upload.single('client_logo'), updateClient);
module.exports = router;