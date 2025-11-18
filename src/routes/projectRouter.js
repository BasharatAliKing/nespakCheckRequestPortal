const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');

router.post('/projects', authMiddleware, createProject);
router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:id', authMiddleware, getProjectById);
router.put('/projects/:id', authMiddleware, updateProject);
router.delete('/projects/:id', authMiddleware, deleteProject);

module.exports = router;
