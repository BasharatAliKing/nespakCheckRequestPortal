const express = require('express');
const router = express.Router();
const { signup, login, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// User CRUD routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
