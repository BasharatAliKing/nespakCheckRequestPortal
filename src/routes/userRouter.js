const express = require('express');
const router = express.Router();
const { getUserByRole , signup, login, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// User CRUD routes
router.get('/users', getUsers);
// get all by role
router.get('/users/role/:role', getUserByRole)
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
